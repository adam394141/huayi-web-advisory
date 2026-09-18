const PRODUCTION_URL = "https://huayi.tw";

export function getCanonicalSiteUrl() {
  const configured = process.env.SITE_CANONICAL_URL;
  if (configured) {
    try { return new URL(configured).origin; } catch { /* 使用安全預設值 */ }
  }
  return PRODUCTION_URL;
}

export function isIndexableEnvironment() {
  return process.env.VERCEL_ENV === "production" || process.env.SITE_ALLOW_INDEXING === "true";
}
