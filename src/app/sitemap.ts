import type { MetadataRoute } from "next";
import { getPublishedPosts, getPublishedWorks } from "@/lib/content";
import { getCanonicalSiteUrl, isIndexableEnvironment } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexableEnvironment()) return [];
  const site = getCanonicalSiteUrl();
  const [posts, works] = await Promise.all([getPublishedPosts(), getPublishedWorks()]);
  const staticPages = ["", "/about", "/services", "/works", "/blog", "/contact"].map((path) => ({ url: `${site}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.7 }));
  return [
    ...staticPages,
    ...works.map((work) => ({ url: `${site}/works/${work.slug}`, lastModified: new Date(work.updated_at), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((post) => ({ url: `${site}/blog/${post.slug}`, lastModified: new Date(post.updated_at), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
