export type CmsCollection = "works" | "blog_posts";

const PUBLIC_SLUG = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

const STATUS_LABEL: Record<string, string> = {
  draft: "草稿",
  preview: "預覽",
  approved: "已核准",
  published: "已發布",
  archived: "封存",
};

export function getAdminPreview(collection: CmsCollection, status: string, slug: string) {
  const reasons: string[] = [];
  if (status !== "published") {
    reasons.push(`目前狀態為「${STATUS_LABEL[status] || status}」，公開前台不會顯示`);
  }
  if (!PUBLIC_SLUG.test(slug)) {
    reasons.push("網址代稱不是有效的英文網址");
  }
  if (reasons.length) {
    return {
      href: null,
      reason: `${reasons.join("；")}。修正並儲存後即可開啟。`,
    };
  }
  return {
    href: `/${collection === "works" ? "works" : "blog"}/${slug}`,
    reason: null,
  };
}
