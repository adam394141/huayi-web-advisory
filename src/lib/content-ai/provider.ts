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
  return process.env.CONTENT_AI_ENABLED === "true" && !!process.env.OPENAI_API_KEY && !!process.env.CONTENT_AI_MODEL;
}
