import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildContentOptimizationPrompt } from "./prompt";
import { buildDeterministicBlockers } from "./fact-guard";
import { renderArticleSections } from "./render-safe-html";
import { gatewayContentProvider } from "./gateway-provider";
import type { StoredAiResult } from "./schema";

type RunSnapshot = {
  article: { title: string; excerpt?: string | null; content?: string | null; category: string; author?: string | null };
  source_material?: string;
  known_internal_paths?: string[];
};

export async function processContentAiRun(client: SupabaseClient, runId: string) {
  try {
    const { data, error } = await client.rpc("cms_claim_ai_run", { p_run_id: runId });
    if (error || !data) throw new Error("CLAIM_FAILED");
    const run = data as { input_snapshot: RunSnapshot };
    const snapshot = run.input_snapshot;
    const prompt = buildContentOptimizationPrompt({
      article: snapshot.article,
      sourceMaterial: snapshot.source_material || "",
      knownInternalPaths: snapshot.known_internal_paths || [],
    });
    const generation = await gatewayContentProvider.generate(prompt);
    const deterministicBlockers = buildDeterministicBlockers(prompt.source, generation.output);
    const stored: StoredAiResult = {
      ...generation.output,
      article: { ...generation.output.article, content_html: renderArticleSections(generation.output.article.sections) },
      deterministic_blockers: deterministicBlockers,
    };
    const { error: completeError } = await client.rpc("cms_complete_ai_run", {
      p_run_id: runId,
      p_output: stored,
      p_fact_ledger: generation.output.fact_ledger,
      p_status: "needs_review",
      p_input_tokens: generation.usage.inputTokens ?? null,
      p_output_tokens: generation.usage.outputTokens ?? null,
      p_total_tokens: generation.usage.totalTokens ?? null,
    });
    if (completeError) throw new Error("COMPLETE_FAILED");
  } catch (error) {
    const code = error instanceof Error ? error.message.slice(0, 80) : "UNKNOWN";
    await client.rpc("cms_fail_ai_run", { p_run_id: runId, p_error_code: code, p_error_message: "AI 處理未完成，文章原稿沒有被修改。" });
    console.error("[content-ai] job failed", { runId, code });
  }
}
