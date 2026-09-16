import { verifyAdmin } from "@/lib/admin-auth";
import { parseCmsListFilters, parseCollection } from "@/lib/admin-policy";
import { parseCmsCreate, parseCmsUpdate } from "@/lib/cms-update";
import { cleanContent } from "@/lib/content-safety";
import { mapCmsSaveError } from "@/lib/cms-save-error";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

function detailFields(collection: "works" | "blog_posts") {
  return collection === "works"
    ? "id,title,slug,description,content,category,cover_image,status,sort_order,show_on_homepage,updated_at,client,design_rationale,seo_title,seo_description"
    : "id,title,slug,excerpt,content,category,cover_image,status,sort_order,show_on_homepage,updated_at,author,seo_title,seo_description,tags,faq,ai_summary,og_image,published_at";
}

function listFields(collection: "works" | "blog_posts") {
  return collection === "works"
    ? "id,title,slug,category,cover_image,status,sort_order,updated_at,client"
    : "id,title,slug,category,cover_image,status,sort_order,updated_at,author,published_at";
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
      const detail = data as unknown as Record<string, unknown>;
      const content = typeof detail.content === "string" ? cleanContent(detail.content) : detail.content;
      const item = { ...detail, content };
      return reply({ item, writable: process.env.CMS_WRITE_ENABLED === "true" });
    }
    const page = Number(search.get("page") || "0");
    if (!Number.isSafeInteger(page) || page < 0 || page > 1000) return reply({ error: "頁碼無效。" }, 400);
    const filters = parseCmsListFilters(search);
    if (!filters) return reply({ error: "搜尋或篩選條件無效。" }, 400);
    let listQuery = auth.client.from(collection).select(listFields(collection), { count: "exact" });
    if (filters.query) listQuery = listQuery.ilike("title", `%${filters.query}%`);
    if (filters.category) listQuery = listQuery.eq("category", filters.category);
    if (filters.status) listQuery = listQuery.eq("status", filters.status);
    listQuery = filters.sort === "updated"
      ? listQuery.order("updated_at", { ascending: false }).order("id")
      : listQuery.order("sort_order", { ascending: true }).order("updated_at", { ascending: false }).order("id");
    const { data, error, count } = await listQuery.range(page * 30, page * 30 + 29);
    if (error) return reply({ error: "暫時無法讀取，請聯絡管理者檢查設定。" }, 503);
    return reply({ items: data, total: count, page, filters, writable: process.env.CMS_WRITE_ENABLED === "true" });
  } catch { return reply({ error: "服務暫時無法使用，請稍後重試。" }, 503); }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.status !== 200) return reply({ error: "請以獲授權的管理員帳號完成雙重驗證。" }, auth.status);
    if (process.env.CMS_WRITE_ENABLED !== "true") return reply({ error: "安全寫入尚未啟用。" }, 503);
    let json: unknown;
    try { json = await request.json(); } catch { return reply({ error: "資料格式不正確。" }, 400); }
    const input = parseCmsCreate(json);
    if (!input) return reply({ error: "新增草稿的欄位或網址格式不正確。" }, 400);
    const rpcRequest = input.collection === "works"
      ? auth.client.rpc("cms_create_work", {
        p_title: input.title, p_slug: input.slug, p_category: input.category, p_client: input.client,
      })
      : auth.client.rpc("cms_create_blog_post", {
        p_title: input.title, p_slug: input.slug, p_category: input.category, p_author: input.author,
      });
    const { data, error } = await rpcRequest;
    if (error || !data) {
      if (error?.code === "23505" || error?.message?.includes("DUPLICATE")) return reply({ error: "網址代稱已存在，請換一個英文網址。" }, 409);
      return reply({ error: "無法新增草稿，既有內容沒有被修改。" }, 503);
    }
    const item = data as Record<string, unknown>;
    if (typeof item.content === "string") item.content = cleanContent(item.content);
    return reply({ item }, 201);
  } catch { return reply({ error: "服務暫時無法使用，請稍後重試。" }, 503); }
}
export async function PATCH(request: Request) {
  const requestId = crypto.randomUUID();
  try {
    const auth = await verifyAdmin(request);
    if (auth.status !== 200) return reply({ error: "請以獲授權的管理員帳號完成雙重驗證。", request_id: requestId }, auth.status);
    if (process.env.CMS_WRITE_ENABLED !== "true") return reply({ error: "安全寫入尚未啟用。", request_id: requestId }, 503);
    const declaredLength = Number(request.headers.get("content-length") || "0");
    if (declaredLength > 260_000) return reply({ error: "送出的內容過大。", request_id: requestId }, 413);
    const raw = await request.text();
    if (raw.length > 260_000) return reply({ error: "送出的內容過大。", request_id: requestId }, 413);
    let json: unknown;
    try { json = JSON.parse(raw); } catch { return reply({ error: "資料格式不正確。", request_id: requestId }, 400); }
    const update = parseCmsUpdate(json);
    if (!update) return reply({ error: "欄位內容或格式不正確。", request_id: requestId }, 400);
    if (update.collection === "blog_posts" && update.changes.status === "published") {
      return reply({ error: "觀點文章請使用「檢查並發布」，不能略過發布檢查。", request_id: requestId }, 400);
    }
    console.info("[cms-save] validated", {
      requestId,
      collection: update.collection,
      itemId: update.id,
      changeKeys: Object.keys(update.changes).sort(),
    });
    console.info("[cms-save] rpc-start", { requestId });
    const { data, error } = await auth.client.rpc("cms_update_content", {
      p_collection: update.collection,
      p_id: update.id,
      p_expected_updated_at: update.expectedUpdatedAt,
      p_changes: update.changes,
    }).abortSignal(AbortSignal.timeout(15_000));
    if (error) {
      const mapped = mapCmsSaveError(error);
      console.error("[cms-save] rpc-error", { requestId, code: error.code || "aborted", kind: mapped.kind });
      return reply({ error: mapped.message, request_id: requestId }, mapped.status);
    }
    console.info("[cms-save] rpc-complete", { requestId });
    const result = data as { old_slug?: string } | null;
    console.info("[cms-save] reread-start", { requestId });
    const { data: saved, error: readError } = await auth.client.from(update.collection)
      .select(detailFields(update.collection)).eq("id", update.id)
      .abortSignal(AbortSignal.timeout(8_000)).single();
    if (readError || !saved) {
      console.error("[cms-save] reread-error", { requestId, code: readError?.code || "empty" });
      return reply({ error: "內容已儲存，但重新讀取失敗；請重新載入列表。", request_id: requestId }, 503);
    }
    console.info("[cms-save] reread-complete", { requestId });
    const savedDetail = saved as unknown as Record<string, unknown>;
    const savedContent = typeof savedDetail.content === "string" ? cleanContent(savedDetail.content) : savedDetail.content;
    const savedItem = { ...savedDetail, content: savedContent } as unknown as { slug: string } & Record<string, unknown>;
    try {
      revalidatePath(update.collection === "works" ? "/works" : "/blog");
      revalidatePath("/");
      if (result?.old_slug) revalidatePath(`/${update.collection === "works" ? "works" : "blog"}/${result.old_slug}`);
      if (savedItem.slug) revalidatePath(`/${update.collection === "works" ? "works" : "blog"}/${savedItem.slug}`);
    } catch (error) {
      // 資料已經成功寫入；快取更新失敗不應誤報成儲存失敗。
      console.warn("[cms-save] revalidate-error", { requestId, error: error instanceof Error ? error.name : "unknown" });
    }
    console.info("[cms-save] complete", { requestId });
    return reply({ item: savedItem, request_id: requestId });
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
    console.error("[cms-save] unexpected", { requestId, error: error instanceof Error ? error.name : "unknown" });
    return reply({ error: timedOut ? "儲存逾時，未完成的內容仍保留在畫面上，請稍候再試。" : "服務暫時無法使用，請稍後重試。", request_id: requestId }, timedOut ? 504 : 503);
  }
}
export async function DELETE() { return reply({ error: "安全寫入尚未啟用。" }, 503); }
