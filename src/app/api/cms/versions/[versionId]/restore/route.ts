import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/admin-auth";
import { isUuid } from "@/lib/content-ai/request";
import { cleanContent } from "@/lib/content-safety";
import { parseCmsPublishRequest } from "@/lib/cms-update";

export const dynamic = "force-dynamic";

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

export async function POST(request: Request, { params }: { params: Promise<{ versionId: string }> }) {
  const auth = await verifyAdmin(request);
  if (auth.status !== 200) return reply({ error: "請重新登入並完成雙重驗證。" }, auth.status);
  const { versionId } = await params;
  if (!isUuid(versionId)) return reply({ error: "版本編號無效。" }, 400);
  let body: unknown;
  try { body = await request.json(); } catch { return reply({ error: "資料格式不正確。" }, 400); }
  const input = parseCmsPublishRequest(body);
  if (!input) return reply({ error: "文章版本無效。" }, 400);
  const { data, error } = await auth.client.rpc("cms_restore_content_version", { p_version_id: versionId, p_expected_updated_at: input.expectedUpdatedAt });
  if (error || !data) {
    if (error?.message?.includes("CONFLICT")) return reply({ error: "文章已有新版本，請重新載入後再還原。" }, 409);
    return reply({ error: "版本還原失敗，文章沒有被修改。" }, 503);
  }
  const item = data as Record<string, unknown>;
  if (typeof item.content === "string") item.content = cleanContent(item.content);
  revalidatePath("/"); revalidatePath("/blog");
  if (typeof item.slug === "string") revalidatePath(`/blog/${item.slug}`);
  return reply({ item });
}
