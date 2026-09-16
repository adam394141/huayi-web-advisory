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

export type MediaListFilters = {
  query: string;
  collection: "" | "works" | "blog_posts";
  usage: "" | "cover" | "content" | "unreferenced";
  page: number;
};

export function parseMediaListFilters(search: URLSearchParams): MediaListFilters | null {
  const query = (search.get("q") || "").trim();
  const collection = (search.get("collection") || "").trim();
  const usage = (search.get("usage") || "").trim();
  const page = Number(search.get("page") || "0");
  if (query.length > 100) return null;
  if (!["", "works", "blog_posts"].includes(collection)) return null;
  if (!["", "cover", "content", "unreferenced"].includes(usage)) return null;
  if (!Number.isSafeInteger(page) || page < 0 || page > 1000) return null;
  return {
    query,
    collection: collection as MediaListFilters["collection"],
    usage: usage as MediaListFilters["usage"],
    page,
  };
}
