import { cleanContent, isTrustedImageSource } from "./content-safety";

export type CmsCollection = "works" | "blog_posts";
export type CmsChanges = Record<string, string | number | boolean | null>;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
const STATUSES = new Set(["draft", "preview", "approved", "published", "archived"]);
const COMMON = new Set(["title", "slug", "category", "content", "cover_image", "status", "show_on_homepage", "sort_order", "seo_title", "seo_description"]);
const FIELDS: Record<CmsCollection, Set<string>> = {
  works: new Set([...COMMON, "description", "client", "design_rationale"]),
  blog_posts: new Set([...COMMON, "excerpt", "author"]),
};
const LIMITS: Record<string, number> = {
  title: 180, slug: 140, category: 80, content: 200_000, cover_image: 2_048,
  description: 5_000, excerpt: 5_000, client: 180, author: 180,
  design_rationale: 20_000, seo_title: 180, seo_description: 500,
};

export type ParsedCmsUpdate = {
  collection: CmsCollection;
  id: string;
  expectedUpdatedAt: string;
  changes: CmsChanges;
};

export type ParsedCmsCreate = {
  collection: "blog_posts";
  title: string;
  slug: string;
  category: string;
  author: string | null;
};

export function parseCmsCreate(value: unknown): ParsedCmsCreate | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  if (body.collection !== "blog_posts") return null;
  for (const key of ["title", "slug", "category"]) if (typeof body[key] !== "string" || !(body[key] as string).trim()) return null;
  if (typeof body.author !== "string" && body.author != null) return null;
  const title = (body.title as string).trim();
  const slug = (body.slug as string).trim();
  const category = (body.category as string).trim();
  const author = typeof body.author === "string" ? body.author.trim() : "";
  if (title.length > LIMITS.title || slug.length > LIMITS.slug || category.length > LIMITS.category || author.length > LIMITS.author) return null;
  if (!SLUG.test(slug)) return null;
  return { collection: "blog_posts", title, slug, category, author: author || null };
}

export function parseCmsUpdate(value: unknown): ParsedCmsUpdate | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  const collection = body.collection;
  if (collection !== "works" && collection !== "blog_posts") return null;
  if (typeof body.id !== "string" || !UUID.test(body.id)) return null;
  if (typeof body.expected_updated_at !== "string" || !Number.isFinite(Date.parse(body.expected_updated_at))) return null;
  if (!body.changes || typeof body.changes !== "object" || Array.isArray(body.changes)) return null;

  const input = body.changes as Record<string, unknown>;
  const keys = Object.keys(input);
  if (!keys.length || keys.some((key) => !FIELDS[collection].has(key))) return null;
  const changes: CmsChanges = {};
  for (const key of keys) {
    const raw = input[key];
    if (key === "show_on_homepage") {
      if (typeof raw !== "boolean") return null;
      changes[key] = raw;
      continue;
    }
    if (key === "sort_order") {
      if (!Number.isSafeInteger(raw) || (raw as number) < -100_000 || (raw as number) > 100_000) return null;
      changes[key] = raw as number;
      continue;
    }
    if (typeof raw !== "string") return null;
    const text = raw.trim();
    if (text.length > LIMITS[key]) return null;
    if (["title", "slug", "category"].includes(key) && !text) return null;
    if (key === "slug" && !SLUG.test(text)) return null;
    if (key === "status" && !STATUSES.has(text)) return null;
    if (key === "cover_image" && text && !isTrustedImageSource(text)) return null;
    changes[key] = key === "content" ? cleanContent(raw) : (text || null);
  }
  // 保留 PostgreSQL 回傳的微秒精度。轉成 JavaScript Date 再序列化會只剩毫秒，
  // 導致資料庫的樂觀鎖誤判為版本衝突。
  return { collection, id: body.id, expectedUpdatedAt: body.expected_updated_at, changes };
}
