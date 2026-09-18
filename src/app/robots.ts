import type { MetadataRoute } from "next";
import { getCanonicalSiteUrl, isIndexableEnvironment } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const site = getCanonicalSiteUrl();
  if (!isIndexableEnvironment()) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/admin/" }, sitemap: `${site}/sitemap.xml`, host: site };
}
