import "server-only";
import { createGoogle } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { contentAiOutputSchema, googleContentAiOutputSchema } from "./schema";
import { getContentAiSettings, getGoogleApiKey } from "./provider";
import type { ContentAiProvider } from "./provider";

export const googleContentProvider: ContentAiProvider = {
  async generate({ system, prompt }) {
    const settings = getContentAiSettings();
    const apiKey = getGoogleApiKey();
    if (!settings || settings.provider !== "google" || !apiKey) {
      throw new Error("CONTENT_AI_NOT_CONFIGURED");
    }

    const google = createGoogle({ apiKey });
    const result = await generateText({
      model: google(settings.model),
      system,
      prompt,
      output: Output.object({ schema: googleContentAiOutputSchema }),
      abortSignal: AbortSignal.timeout(75_000),
      maxRetries: 0,
    });

    return {
      output: contentAiOutputSchema.parse(result.output),
      model: settings.modelId,
      usage: {
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
        totalTokens: result.usage.totalTokens,
      },
    };
  },
};
