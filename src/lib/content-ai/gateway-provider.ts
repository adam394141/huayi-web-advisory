import "server-only";
import { gateway, generateText, Output } from "ai";
import { contentAiOutputSchema } from "./schema";
import type { ContentAiProvider } from "./provider";

export const gatewayContentProvider: ContentAiProvider = {
  async generate({ system, prompt }) {
    const model = process.env.CONTENT_AI_MODEL;
    const hasGatewayAuth =
      !!process.env.AI_GATEWAY_API_KEY ||
      !!process.env.VERCEL_OIDC_TOKEN ||
      process.env.VERCEL === "1";

    if (!model || !hasGatewayAuth) throw new Error("CONTENT_AI_NOT_CONFIGURED");

    const result = await generateText({
      model: gateway(model),
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
      model,
      usage: {
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
        totalTokens: result.usage.totalTokens,
      },
    };
  },
};
