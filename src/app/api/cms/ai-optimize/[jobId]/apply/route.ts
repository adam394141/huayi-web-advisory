import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/admin-auth";
import { isUuid, parseAiApplyRequest } from "@/lib/content-ai/request";
import { cleanContent } from "@/lib/content-safety";

export const dynamic = "force-dynamic";

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

export async function POST(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const auth = await verifyAdmin(request);
  if (auth.status !== 200) return reply({ error: "請重新登入並完成雙重驗證。" }, auth.status);
  if (process.env.CMS_WRITE_ENABLED !== "true") return reply({ error: "安全寫入尚未啟用。" }, 503);
  const { jobId } = await params;
  if (!isUuid(jobId)) return reply({ error: "任務編號無效。" }, 400);
  let json: unknown;
  try { json = await request.json(); } catch { return reply({ error: "資料格式不正確。" }, 400); }
  const input = parseAiApplyRequest(json);
  if (!input) return reply({ error: "請至少選擇一項有效的優化內容。" }, 400);
  const { data, error } = await auth.client.rpc("cms_apply_ai_result", {
    p_run_id: jobId,
    p_expected_updated_at: input.expectedUpdatedAt,
    p_fields: input.fields,
    p_confirm_blockers: input.confirmBlockers,
  });
  if (error || !data) {
    if (error?.message?.includes("CONFLICT")) return reply({ error: "文章已有新版本，請重新載入再套用。" }, 409);
    return reply({ error: "無法套用 AI 結果，原稿沒有被修改。" }, 503);
  }
  const item = data as Record<string, unknown>;
  if (typeof item.content === "string") item.content = cleanContent(item.content);
  revalidatePath("/blog"); revalidatePath("/");
  if (typeof item.slug === "string") revalidatePath(`/blog/${item.slug}`);
  return reply({ item });
}
