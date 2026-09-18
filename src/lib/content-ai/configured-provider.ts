import "server-only";
import { gatewayContentProvider } from "./gateway-provider";
import { googleContentProvider } from "./google-provider";
import { getContentAiSettings } from "./provider";

export function getConfiguredContentAiProvider() {
  const settings = getContentAiSettings();
  if (!settings) throw new Error("CONTENT_AI_NOT_CONFIGURED");
  return settings.provider === "google" ? googleContentProvider : gatewayContentProvider;
}
