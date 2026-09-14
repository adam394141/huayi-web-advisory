import { verifyAdmin } from "@/lib/admin-auth";
import { detectAcceptedImage, IMAGE_UPLOAD_LIMIT, validAssetContext } from "@/lib/asset-upload";
import { optimizeImageForWeb, parseImageUsage } from "@/lib/image-optimization";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

export async function POST(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.status !== 200) return reply({ error: "請以獲授權的管理員帳號完成雙重驗證。" }, auth.status);
    if (process.env.CMS_WRITE_ENABLED !== "true") return reply({ error: "圖片上傳尚未啟用。" }, 503);
    const declaredLength = Number(request.headers.get("content-length") || "0");
    if (declaredLength > IMAGE_UPLOAD_LIMIT + 100_000) return reply({ error: "圖片不可超過 4 MB。" }, 413);

    const form = await request.formData();
    const file = form.get("file");
    const collection = form.get("collection");
    const itemId = form.get("itemId");
    const usage = parseImageUsage(form.get("usage"));
    if (!(file instanceof File) || !validAssetContext(collection, itemId) || !usage) return reply({ error: "上傳資料不完整。" }, 400);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const image = detectAcceptedImage(bytes, file.type, file.size);
    if (!image) return reply({ error: "僅接受 4 MB 以下的 JPG、PNG 或 WebP 圖片。" }, 400);

    let optimized: Awaited<ReturnType<typeof optimizeImageForWeb>>;
    try {
      optimized = await optimizeImageForWeb(bytes, usage);
    } catch (error) {
      if (error instanceof Error && error.message === "ANIMATED_IMAGE_UNSUPPORTED") {
        return reply({ error: "目前只接受靜態圖片，不接受動畫 WebP。" }, 400);
      }
      return reply({ error: "圖片尺寸過大、內容損壞或無法最佳化。請更換圖片後重試。" }, 400);
    }

    const table = collection as "works" | "blog_posts";
    const id = itemId as string;
    const { data: record, error: recordError } = await auth.client.from(table).select("id").eq("id", id).maybeSingle();
    if (recordError || !record) return reply({ error: "找不到要加入圖片的內容。" }, 404);

    const assetId = crypto.randomUUID();
    const originalPath = `cms/${auth.userId}/${table}/${id}/original/${assetId}.${image.extension}`;
    const optimizedPath = `cms/${auth.userId}/${table}/${id}/optimized/${assetId}.${optimized.extension}`;
    const { error: originalError } = await auth.client.storage.from("published-assets").upload(originalPath, bytes, {
      contentType: image.contentType, cacheControl: "31536000", upsert: false,
    });
    if (originalError) return reply({ error: "原圖保存失敗，未修改頁面。" }, 503);
    const { error: optimizedError } = await auth.client.storage.from("published-assets").upload(optimizedPath, optimized.bytes, {
      contentType: optimized.contentType, cacheControl: "31536000", upsert: false,
    });
    if (optimizedError) return reply({ error: "網站版圖片上傳失敗，未修改頁面。" }, 503);

    const storage = auth.client.storage.from("published-assets");
    const { data: optimizedData } = storage.getPublicUrl(optimizedPath);
    const savedPercent = Math.round((1 - optimized.optimizedBytes / optimized.originalBytes) * 100);
    return reply({
      url: optimizedData.publicUrl,
      originalWidth: optimized.originalWidth,
      originalHeight: optimized.originalHeight,
      width: optimized.optimizedWidth,
      height: optimized.optimizedHeight,
      originalBytes: optimized.originalBytes,
      optimizedBytes: optimized.optimizedBytes,
      savedPercent,
      format: "WebP",
      cropPolicy: "contain",
    });
  } catch { return reply({ error: "圖片上傳服務暫時無法使用。" }, 503); }
}
