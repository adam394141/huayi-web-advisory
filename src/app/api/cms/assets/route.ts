import { verifyAdmin } from "@/lib/admin-auth";
import { detectAcceptedImage, IMAGE_UPLOAD_LIMIT, validAssetContext } from "@/lib/asset-upload";
import { optimizeImageForWeb, parseImageUsage } from "@/lib/image-optimization";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
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
    console.info("[cms-assets] accepted", { requestId, collection, usage, bytes: file.size });

    let optimized: Awaited<ReturnType<typeof optimizeImageForWeb>>;
    try {
      optimized = await optimizeImageForWeb(bytes, usage);
    } catch (error) {
      if (error instanceof Error && error.message === "ANIMATED_IMAGE_UNSUPPORTED") {
        return reply({ error: "目前只接受靜態圖片，不接受動畫 WebP。" }, 400);
      }
      console.warn("[cms-assets] optimization-failed", { requestId, error: error instanceof Error ? error.message : "unknown" });
      return reply({ error: "圖片尺寸過大、內容損壞或無法最佳化。請更換圖片後重試。" }, 400);
    }

    const table = collection as "works" | "blog_posts";
    const id = itemId as string;
    const { data: record, error: recordError } = await auth.client.from(table).select("id").eq("id", id).maybeSingle();
    if (recordError || !record) {
      console.warn("[cms-assets] record-not-found", { requestId, collection });
      return reply({ error: "找不到要加入圖片的內容。" }, 404);
    }

    const assetId = crypto.randomUUID();
    const originalPath = `cms/${auth.userId}/${table}/${id}/original/${assetId}.${image.extension}`;
    const optimizedPath = `cms/${auth.userId}/${table}/${id}/optimized/${assetId}.${optimized.extension}`;
    const storage = auth.client.storage.from("published-assets");
    const uploadStartedAt = performance.now();
    // 原圖與網站版互不相依，並行保存可避免兩次網路等待時間相加。
    const [originalUpload, optimizedUpload] = await Promise.all([
      storage.upload(originalPath, bytes, {
        contentType: image.contentType, cacheControl: "31536000", upsert: false,
      }),
      storage.upload(optimizedPath, optimized.bytes, {
        contentType: optimized.contentType, cacheControl: "31536000", upsert: false,
      }),
    ]);
    if (originalUpload.error || optimizedUpload.error) {
      console.error("[cms-assets] upload-failed", {
        requestId,
        originalCode: originalUpload.error?.name || null,
        optimizedCode: optimizedUpload.error?.name || null,
      });
      // 其中一份成功時清除孤立檔案，避免失敗重試累積無主檔案。
      const orphanedPaths = [
        !originalUpload.error && optimizedUpload.error ? originalPath : null,
        originalUpload.error && !optimizedUpload.error ? optimizedPath : null,
      ].filter((path): path is string => Boolean(path));
      if (orphanedPaths.length) await storage.remove(orphanedPaths);
      return reply({ error: "圖片保存失敗，未修改頁面。請稍後重試。" }, 503);
    }

    const { data: optimizedData } = storage.getPublicUrl(optimizedPath);
    const savedPercent = Math.round((1 - optimized.optimizedBytes / optimized.originalBytes) * 100);
    console.info("[cms-assets] completed", {
      requestId,
      collection,
      usage,
      originalBytes: optimized.originalBytes,
      optimizedBytes: optimized.optimizedBytes,
      uploadMs: Math.round(performance.now() - uploadStartedAt),
    });
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
  } catch (error) {
    console.error("[cms-assets] unexpected", { requestId, error: error instanceof Error ? error.message : "unknown" });
    return reply({ error: "圖片上傳服務暫時無法使用。" }, 503);
  }
}
