import { createHash } from "node:crypto";
import { after } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { CONTENT_AI_PROMPT_VERSION } from "@/lib/content-ai/prompt";
import { isContentAiConfigured } from "@/lib/content-ai/provider";
import { isUuid, parseAiStartRequest } from "@/lib/content-ai/request";
import { processContentAiRun } from "@/lib/content-ai/job-processor";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

export async function GET(request: Request) {
  const auth = await verifyAdmin(request);
  if (auth.status !== 200) return reply({ error: "請重新登入並完成雙重驗證。" }, auth.status);
  const articleId = new URL(request.url).searchParams.get("article_id") || "";
  if (!isUuid(articleId)) return reply({ error: "文章編號無效。" }, 400);
  const { data, error } = await auth.client.from("content_ai_runs")
    .select("id,content_id,status,output_snapshot,error_code,error_message,model,created_at,started_at,completed_at")
    .eq("content_id", articleId).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (error) return reply({ error: "暫時無法讀取 AI 任務。" }, 503);
  if (!data) return reply({ job: null });
  const created = Date.parse(data.started_at || data.created_at);
  const stale = ["pending","running"].includes(data.status) && Date.now() - created > 180_000;
  return reply({ job: { ...data, stale } });
}

export async function POST(request: Request) {
  const auth = await verifyAdmin(request);
  if (auth.status !== 200) return reply({ error: "請以獲授權的管理員帳號完成雙重驗證。" }, auth.status);
  if (!isContentAiConfigured()) return reply({ error: "AI 優化尚未啟用，文章仍可照常編輯。" }, 503);
  if (process.env.CMS_WRITE_ENABLED !== "true") return reply({ error: "安全寫入尚未啟用。" }, 503);
  const declaredLength = Number(request.headers.get("content-length") || "0");
  if (declaredLength > 60_000) return reply({ error: "素材過大，請縮短後再試。" }, 413);
  let json: unknown;
  try { json = await request.json(); } catch { return reply({ error: "資料格式不正確。" }, 400); }
  const input = parseAiStartRequest(json);
  if (!input) return reply({ error: "文章或素材格式不正確。" }, 400);
  const inputHash = createHash("sha256").update(`${input.articleId}\n${input.expectedUpdatedAt}\n${input.sourceMaterial}`).digest("hex");
  const model = process.env.CONTENT_AI_MODEL!;
  const { data, error } = await auth.client.rpc("cms_start_ai_run", {
    p_content_id: input.articleId,
    p_expected_updated_at: input.expectedUpdatedAt,
    p_source_material: input.sourceMaterial,
    p_input_hash: inputHash,
    p_prompt_version: CONTENT_AI_PROMPT_VERSION,
    p_model: model,
  });
  if (error || !data) {
    const message = error?.message || "";
    if (message.includes("RATE_LIMIT")) return reply({ error: "今天的 AI 使用次數已達安全上限，請稍後再試。" }, 429);
    if (message.includes("ALREADY_RUNNING")) return reply({ error: "這篇文章已有 AI 任務進行中。" }, 409);
    if (message.includes("CONFLICT")) return reply({ error: "文章已被更新，請重新載入後再執行 AI。" }, 409);
    return reply({ error: "無法建立 AI 任務，文章沒有被修改。" }, 503);
  }
  const job = data as { id: string; status: string; created_at: string; reused?: boolean };
  if (!job.reused) after(() => processContentAiRun(auth.client, job.id));
  return reply({ job }, 202);
}
