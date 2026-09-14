import { after } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { isContentAiConfigured } from "@/lib/content-ai/provider";
import { isUuid } from "@/lib/content-ai/request";
import { processContentAiRun } from "@/lib/content-ai/job-processor";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

export async function POST(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const auth = await verifyAdmin(request);
  if (auth.status !== 200) return reply({ error: "請重新登入並完成雙重驗證。" }, auth.status);
  if (!isContentAiConfigured()) return reply({ error: "AI 優化尚未啟用。" }, 503);
  const { jobId } = await params;
  if (!isUuid(jobId)) return reply({ error: "任務編號無效。" }, 400);
  const { data, error } = await auth.client.rpc("cms_retry_ai_run", { p_run_id: jobId });
  if (error || !data) return reply({ error: "這筆任務目前不能重試；若文章已更新，請建立新的 AI 優化。" }, 409);
  const job = data as { id: string; status: string; created_at: string };
  after(() => processContentAiRun(auth.client, job.id));
  return reply({ job }, 202);
}
