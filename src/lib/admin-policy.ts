export function isAdminId(userId: string, configuredIds: string | undefined): boolean {
  const ids = (configuredIds || "").split(",").map((id) => id.trim()).filter(Boolean);
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId) && ids.includes(userId);
}

export function getBearer(header: string | null): string | null {
  const match = header?.match(/^Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/);
  return match && match[1].length <= 8192 ? match[1] : null;
}

export function parseCollection(value: string | null): "works" | "blog_posts" | null {
  return value === "works" || value === "blog_posts" ? value : null;
}

const CMS_STATUSES = new Set(["draft", "preview", "approved", "published", "archived"]);

export type CmsListFilters = {
  query: string;
  category: string;
  status: string;
  sort: "site" | "updated";
};

export function parseCmsListFilters(search: URLSearchParams): CmsListFilters | null {
  const query = (search.get("q") || "").trim();
  const category = (search.get("category") || "").trim();
  const status = (search.get("status") || "").trim();
  const sort = (search.get("sort") || "site").trim();
  if (query.length > 100 || category.length > 80) return null;
  if (status && !CMS_STATUSES.has(status)) return null;
  if (sort !== "site" && sort !== "updated") return null;
  return { query, category, status, sort };
}
