import type { ContentAiOutput } from "./schema";

export type ContentAiGeneration = {
  output: ContentAiOutput;
  model: string;
  usage: { inputTokens?: number; outputTokens?: number; totalTokens?: number };
};

export interface ContentAiProvider {
  generate(input: { system: string; prompt: string }): Promise<ContentAiGeneration>;
}
export function isContentAiConfigured() {
  const hasGatewayAuth =
    !!process.env.AI_GATEWAY_API_KEY ||
    !!process.env.VERCEL_OIDC_TOKEN ||
    process.env.VERCEL === "1";

  return process.env.CONTENT_AI_ENABLED === "true" && hasGatewayAuth && !!process.env.CONTENT_AI_MODEL;
}
