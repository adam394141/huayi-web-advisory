import { verifyAdmin } from "@/lib/admin-auth";
import { parseCollection } from "@/lib/admin-policy";
import { parseCmsUpdate } from "@/lib/cms-update";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

function detailFields(collection: "works" | "blog_posts") {
  return collection === "works"
    ? "id,title,slug,description,content,category,cover_image,status,sort_order,show_on_homepage,updated_at,client,design_rationale,seo_title,seo_description"
    : "id,title,slug,excerpt,content,category,cover_image,status,sort_order,show_on_homepage,updated_at,author,seo_title,seo_description";
}

export async function GET(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.status !== 200) return reply({ error: auth.status === 503 ? "後台安全設定尚未完成，未開放資料存取。" : "請以獲授權的管理員帳號完成雙重驗證。" }, auth.status);
    if (process.env.CMS_READ_ENABLED !== "true") return reply({ error: "資料庫權限尚未驗收，讀取暫未開放。" }, 503);
    const search = new URL(request.url).searchParams;
    const collection = parseCollection(search.get("collection"));
    if (!collection) return reply({ error: "不支援的內容類型。" }, 400);
    const id = search.get("id");
    if (id) {
      if (!/^[0-9a-f-]{36}$/i.test(id)) return reply({ error: "內容編號無效。" }, 400);
      const { data, error } = await auth.client.from(collection).select(detailFields(collection)).eq("id", id).maybeSingle();
      if (error) return reply({ error: "暫時無法讀取內容。" }, 503);
      if (!data) return reply({ error: "找不到這筆內容。" }, 404);
      return reply({ item: data, writable: process.env.CMS_WRITE_ENABLED === "true" });
    }
    const page = Number(search.get("page") || "0");
    if (!Number.isSafeInteger(page) || page < 0 || page > 1000) return reply({ error: "頁碼無效。" }, 400);
    const { data, error, count } = await auth.client.from(collection)
      .select("id,title,slug,category,cover_image,status,sort_order,updated_at", { count: "exact" })
      .order("sort_order", { ascending: true }).order("id").range(page * 30, page * 30 + 29);
    if (error) return reply({ error: "暫時無法讀取，請聯絡管理者檢查設定。" }, 503);
    return reply({ items: data, total: count, page, writable: process.env.CMS_WRITE_ENABLED === "true" });
  } catch { return reply({ error: "服務暫時無法使用，請稍後重試。" }, 503); }
}

// 寫入尚未完成交易、稽核及 RLS 驗收，明確拒絕；不可返回假的儲存成功。
export async function POST() { return reply({ error: "安全寫入尚未啟用。" }, 503); }
export async function PATCH(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.status !== 200) return reply({ error: "請以獲授權的管理員帳號完成雙重驗證。" }, auth.status);
    if (process.env.CMS_WRITE_ENABLED !== "true") return reply({ error: "安全寫入尚未啟用。" }, 503);
    const declaredLength = Number(request.headers.get("content-length") || "0");
    if (declaredLength > 260_000) return reply({ error: "送出的內容過大。" }, 413);
    const raw = await request.text();
    if (raw.length > 260_000) return reply({ error: "送出的內容過大。" }, 413);
    let json: unknown;
    try { json = JSON.parse(raw); } catch { return reply({ error: "資料格式不正確。" }, 400); }
    const update = parseCmsUpdate(json);
    if (!update) return reply({ error: "欄位內容或格式不正確。" }, 400);
    const { data, error } = await auth.client.rpc("cms_update_content", {
      p_collection: update.collection,
      p_id: update.id,
      p_expected_updated_at: update.expectedUpdatedAt,
      p_changes: update.changes,
    });
    if (error) {
      if (error.code === "40001") return reply({ error: "這筆內容已被更新，請重新載入後再修改。" }, 409);
      if (error.code === "23505") return reply({ error: "網址代稱已被其他內容使用。" }, 409);
      return reply({ error: "儲存失敗，未變更任何資料。" }, 503);
    }
    const result = data as { old_slug?: string } | null;
    const { data: saved, error: readError } = await auth.client.from(update.collection)
      .select(detailFields(update.collection)).eq("id", update.id).single();
    if (readError || !saved) return reply({ error: "內容已儲存，但重新讀取失敗；請重新載入列表。" }, 503);
    const savedItem = saved as unknown as { slug: string } & Record<string, unknown>;
    revalidatePath(update.collection === "works" ? "/works" : "/blog");
    revalidatePath("/");
    if (result?.old_slug) revalidatePath(`/${update.collection === "works" ? "works" : "blog"}/${result.old_slug}`);
    if (savedItem.slug) revalidatePath(`/${update.collection === "works" ? "works" : "blog"}/${savedItem.slug}`);
    return reply({ item: savedItem });
  } catch { return reply({ error: "服務暫時無法使用，請稍後重試。" }, 503); }
}
export async function DELETE() { return reply({ error: "安全寫入尚未啟用。" }, 503); }
