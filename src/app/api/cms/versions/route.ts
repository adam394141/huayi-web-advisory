import { verifyAdmin } from "@/lib/admin-auth";
import { isUuid } from "@/lib/content-ai/request";

export const dynamic = "force-dynamic";

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

export async function GET(request: Request) {
  const auth = await verifyAdmin(request);
  if (auth.status !== 200) return reply({ error: "請重新登入並完成雙重驗證。" }, auth.status);
  const id = new URL(request.url).searchParams.get("article_id") || "";
  if (!isUuid(id)) return reply({ error: "文章編號無效。" }, 400);
  const { data, error } = await auth.client.from("content_versions")
    .select("id,revision,reason,created_at,ai_run_id,snapshot")
    .eq("content_type", "article").eq("content_id", id).order("revision", { ascending: false }).limit(20);
  if (error) return reply({ error: "暫時無法讀取版本紀錄。" }, 503);
  const versions = (data || []).map((version) => ({
    id: version.id, revision: version.revision, reason: version.reason, created_at: version.created_at, ai_run_id: version.ai_run_id,
    summary: { title: (version.snapshot as Record<string, unknown>)?.title, slug: (version.snapshot as Record<string, unknown>)?.slug, status: (version.snapshot as Record<string, unknown>)?.status },
  }));
  return reply({ versions });
}
