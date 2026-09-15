import "server-only";
import { gateway, generateText, Output } from "ai";
import { contentAiOutputSchema } from "./schema";
import { getContentAiSettings } from "./provider";
import type { ContentAiProvider } from "./provider";

export const gatewayContentProvider: ContentAiProvider = {
  async generate({ system, prompt }) {
    const settings = getContentAiSettings();
    if (!settings || settings.provider !== "gateway") throw new Error("CONTENT_AI_NOT_CONFIGURED");

    const result = await generateText({
      model: gateway(settings.model),
      system,
      prompt,
      output: Output.object({ schema: contentAiOutputSchema }),
      abortSignal: AbortSignal.timeout(75_000),
      maxRetries: 0,
      providerOptions: {
        gateway: {
          tags: ["site:huayi-advisory", "feature:content-seo"],
        },
      },
    });

    return {
      output: result.output,
      model: settings.modelId,
      usage: {
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
        totalTokens: result.usage.totalTokens,
      },
    };
  },
};
