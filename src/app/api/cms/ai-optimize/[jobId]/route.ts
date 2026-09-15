import { verifyAdmin } from "@/lib/admin-auth";
import { isUuid } from "@/lib/content-ai/request";

export const dynamic = "force-dynamic";

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

export async function GET(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const auth = await verifyAdmin(request);
  if (auth.status !== 200) return reply({ error: "請重新登入並完成雙重驗證。" }, auth.status);
  const { jobId } = await params;
  if (!isUuid(jobId)) return reply({ error: "任務編號無效。" }, 400);
  const { data, error } = await auth.client.from("content_ai_runs")
    .select("id,content_id,status,output_snapshot,error_code,error_message,model,created_at,started_at,completed_at")
    .eq("id", jobId).maybeSingle();
  if (error) return reply({ error: "暫時無法讀取 AI 任務。" }, 503);
  if (!data) return reply({ error: "找不到這筆 AI 任務。" }, 404);
  const created = Date.parse(data.started_at || data.created_at);
  const stale = ["pending","running"].includes(data.status) && Date.now() - created > 180_000;
  return reply({ job: { ...data, stale } });
}
