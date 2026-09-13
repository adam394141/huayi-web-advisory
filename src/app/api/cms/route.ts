import { verifyAdmin } from "@/lib/admin-auth";
import { parseCollection } from "@/lib/admin-policy";

export const dynamic = "force-dynamic";

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

export async function GET(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.status !== 200) return reply({ error: auth.status === 503 ? "後台安全設定尚未完成，未開放資料存取。" : "請以獲授權的管理員帳號完成雙重驗證。" }, auth.status);
    if (process.env.CMS_READ_ENABLED !== "true") return reply({ error: "資料庫權限尚未驗收，讀取暫未開放。" }, 503);
    const search = new URL(request.url).searchParams;
    const collection = parseCollection(search.get("collection"));
    if (!collection) return reply({ error: "不支援的內容類型。" }, 400);
    const page = Number(search.get("page") || "0");
    if (!Number.isSafeInteger(page) || page < 0 || page > 1000) return reply({ error: "頁碼無效。" }, 400);
    const { data, error, count } = await auth.client.from(collection)
      .select("id,title,slug,category,cover_image,status,sort_order,updated_at", { count: "exact" })
      .order("sort_order", { ascending: true }).order("id").range(page * 30, page * 30 + 29);
    if (error) return reply({ error: "暫時無法讀取，請聯絡管理者檢查設定。" }, 503);
    return reply({ items: data, total: count, page, writable: false });
  } catch { return reply({ error: "服務暫時無法使用，請稍後重試。" }, 503); }
}

// 寫入尚未完成交易、稽核及 RLS 驗收，明確拒絕；不可返回假的儲存成功。
export async function POST() { return reply({ error: "安全寫入尚未啟用。" }, 503); }
export async function PATCH() { return reply({ error: "安全寫入尚未啟用。" }, 503); }
export async function DELETE() { return reply({ error: "安全寫入尚未啟用。" }, 503); }
