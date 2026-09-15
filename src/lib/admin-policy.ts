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
