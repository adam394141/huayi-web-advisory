import { verifyAdmin } from "@/lib/admin-auth";
import { parseMediaListFilters } from "@/lib/admin-policy";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

type MediaRow = {
  path: string;
  file_name: string;
  collection: "works" | "blog_posts";
  item_id: string;
  item_title: string;
  bytes: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
  used_as_cover: boolean;
  used_in_content: boolean;
  total_count: number;
};

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

export async function GET(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.status !== 200) return reply({ error: "請以獲授權的管理員帳號完成雙重驗證。" }, auth.status);
    const filters = parseMediaListFilters(new URL(request.url).searchParams);
    if (!filters) return reply({ error: "媒體庫搜尋或篩選條件無效。" }, 400);
    const { data, error } = await auth.client.rpc("cms_admin_list_assets", {
      p_query: filters.query,
      p_collection: filters.collection,
      p_usage: filters.usage,
      p_limit: PAGE_SIZE,
      p_offset: filters.page * PAGE_SIZE,
    });
    if (error) {
      console.warn("[cms-media] list-failed", { code: error.code || "unknown" });
      return reply({ error: "媒體索引尚未啟用或暫時無法讀取；作品與觀點功能不受影響。" }, 503);
    }
    const rows = (data || []) as MediaRow[];
    const storage = auth.client.storage.from("published-assets");
    const items = rows.map((row) => ({
      path: row.path, file_name: row.file_name, collection: row.collection, item_id: row.item_id, item_title: row.item_title,
      bytes: row.bytes, mime_type: row.mime_type, created_at: row.created_at, updated_at: row.updated_at,
      used_as_cover: row.used_as_cover, used_in_content: row.used_in_content,
      url: storage.getPublicUrl(row.path).data.publicUrl,
    }));
    return reply({ items, total: rows[0]?.total_count || 0, page: filters.page, pageSize: PAGE_SIZE, filters });
  } catch {
    return reply({ error: "媒體庫暫時無法使用，請稍後重試。" }, 503);
  }
}
