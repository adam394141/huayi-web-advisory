import { verifyAdmin } from "@/lib/admin-auth";
import { detectAcceptedImage, IMAGE_UPLOAD_LIMIT, validAssetContext } from "@/lib/asset-upload";

export const dynamic = "force-dynamic";

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
    if (!(file instanceof File) || !validAssetContext(collection, itemId)) return reply({ error: "上傳資料不完整。" }, 400);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const image = detectAcceptedImage(bytes, file.type, file.size);
    if (!image) return reply({ error: "僅接受 4 MB 以下的 JPG、PNG 或 WebP 圖片。" }, 400);

    const table = collection as "works" | "blog_posts";
    const id = itemId as string;
    const { data: record, error: recordError } = await auth.client.from(table).select("id").eq("id", id).maybeSingle();
    if (recordError || !record) return reply({ error: "找不到要加入圖片的內容。" }, 404);

    const path = `cms/${auth.userId}/${table}/${id}/${crypto.randomUUID()}.${image.extension}`;
    const { error } = await auth.client.storage.from("published-assets").upload(path, bytes, {
      contentType: image.contentType, cacheControl: "31536000", upsert: false,
    });
    if (error) return reply({ error: "圖片上傳失敗，未修改內文。" }, 503);
    const { data } = auth.client.storage.from("published-assets").getPublicUrl(path);
    return reply({ url: data.publicUrl });
  } catch { return reply({ error: "圖片上傳服務暫時無法使用。" }, 503); }
}
