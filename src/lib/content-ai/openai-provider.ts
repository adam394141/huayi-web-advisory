import "server-only";
import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { contentAiOutputSchema } from "./schema";
import type { ContentAiProvider } from "./provider";

export const openAiContentProvider: ContentAiProvider = {
  async generate({ system, prompt }) {
    const model = process.env.CONTENT_AI_MODEL;
    if (!model || !process.env.OPENAI_API_KEY) throw new Error("CONTENT_AI_NOT_CONFIGURED");
    const result = await generateText({
      model: openai(model),
      system,
      prompt,
      output: Output.object({ schema: contentAiOutputSchema }),
      abortSignal: AbortSignal.timeout(75_000),
      maxRetries: 0,
      providerOptions: { openai: { store: false } },
    });
    return {
      output: result.output,
      model,
      usage: {
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
        totalTokens: result.usage.totalTokens,
      },
    };
  },
};
