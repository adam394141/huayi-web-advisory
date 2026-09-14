import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/admin-auth";
import { isUuid } from "@/lib/content-ai/request";
import { cleanContent } from "@/lib/content-safety";
import { getPublishBlockers } from "@/lib/content-seo";

export const dynamic = "force-dynamic";

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdmin(request);
  if (auth.status !== 200) return reply({ error: "請重新登入並完成雙重驗證。" }, auth.status);
  if (process.env.CMS_WRITE_ENABLED !== "true") return reply({ error: "安全寫入尚未啟用。" }, 503);
  const { id } = await params;
  if (!isUuid(id)) return reply({ error: "文章編號無效。" }, 400);
  let body: unknown;
  try { body = await request.json(); } catch { return reply({ error: "資料格式不正確。" }, 400); }
  const expected = (body as Record<string, unknown>)?.expected_updated_at;
  if (typeof expected !== "string" || !Number.isFinite(Date.parse(expected))) return reply({ error: "文章版本無效。" }, 400);
  const { data: current, error: readError } = await auth.client.from("blog_posts")
    .select("title,slug,excerpt,content,cover_image,seo_title,seo_description").eq("id", id).maybeSingle();
  if (readError || !current) return reply({ error: "暫時無法執行發布檢查。" }, 503);
  const blockers = getPublishBlockers(current);
  if (blockers.length) return reply({ error: `發布前請修正：${blockers.join("、")}`, blockers }, 400);
  const { data, error } = await auth.client.rpc("cms_publish_blog_post", { p_id: id, p_expected_updated_at: new Date(expected).toISOString() });
  if (error || !data) {
    const message = error?.message || "";
    if (message.includes("CONFLICT")) return reply({ error: "文章已有新版本，請重新載入後再發布。" }, 409);
    if (message.includes("INCOMPLETE")) return reply({ error: "發布前請補齊標題、網址、摘要、正文、封面及 SEO 設定。" }, 400);
    if (message.includes("AI_BLOCKERS")) return reply({ error: "AI 檢查仍有待確認的事實，暫時不能發布。" }, 400);
    return reply({ error: "發布失敗，文章仍維持原狀態。" }, 503);
  }
  const item = data as Record<string, unknown>;
  if (typeof item.content === "string") item.content = cleanContent(item.content);
  revalidatePath("/"); revalidatePath("/blog");
  if (typeof item.slug === "string") revalidatePath(`/blog/${item.slug}`);
  return reply({ item });
}
