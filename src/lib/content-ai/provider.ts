import type { ContentAiOutput } from "./schema";

export type ContentAiGeneration = {
  output: ContentAiOutput;
  model: string;
  usage: { inputTokens?: number; outputTokens?: number; totalTokens?: number };
};

export interface ContentAiProvider {
  generate(input: { system: string; prompt: string }): Promise<ContentAiGeneration>;
}

export type ContentAiProviderName = "google" | "gateway";

export type ContentAiSettings = {
  provider: ContentAiProviderName;
  model: string;
  modelId: string;
};

type ContentAiEnvironment = Record<string, string | undefined>;

function hasGoogleAuth(env: ContentAiEnvironment) {
  return !!(
    env.GEMINI_API_KEY ||
    env.GOOGLE_API_KEY ||
    env.GOOGLE_GENERATIVE_AI_API_KEY
  );
}

function hasGatewayAuth(env: ContentAiEnvironment) {
  return !!env.AI_GATEWAY_API_KEY || !!env.VERCEL_OIDC_TOKEN || env.VERCEL === "1";
}

export function getGoogleApiKey(env: ContentAiEnvironment = process.env) {
  return env.GEMINI_API_KEY || env.GOOGLE_API_KEY || env.GOOGLE_GENERATIVE_AI_API_KEY || null;
}

export function getContentAiSettings(
  env: ContentAiEnvironment = process.env,
): ContentAiSettings | null {
  if (env.CONTENT_AI_ENABLED !== "true") return null;

  const requestedProvider = env.CONTENT_AI_PROVIDER?.trim().toLowerCase();
  if (requestedProvider && requestedProvider !== "google" && requestedProvider !== "gateway") {
    return null;
  }

  const provider: ContentAiProviderName = requestedProvider === "google"
    ? "google"
    : requestedProvider === "gateway"
      ? "gateway"
      : hasGoogleAuth(env)
        ? "google"
        : "gateway";
  const model = env.CONTENT_AI_MODEL?.trim() || "";

  if (provider === "google") {
    if (!hasGoogleAuth(env) || !/^gemini-[a-z0-9][a-z0-9.-]*$/i.test(model)) return null;
    return { provider, model, modelId: `google/${model}` };
  }

  if (!hasGatewayAuth(env) || !/^[a-z0-9-]+\/[a-z0-9][a-z0-9.-]*$/i.test(model)) return null;
  return { provider, model, modelId: model };
}

export function isContentAiConfigured(env: ContentAiEnvironment = process.env) {
  return getContentAiSettings(env) !== null;
}
