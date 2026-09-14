export type PublishableArticle = {
  title?: string | null; slug?: string | null; excerpt?: string | null; content?: string | null;
  cover_image?: string | null; seo_title?: string | null; seo_description?: string | null;
};

export function getPublishBlockers(article: PublishableArticle): string[] {
  const blockers: string[] = [];
  const required: Array<[keyof PublishableArticle, string]> = [
    ["title","文章標題"],["slug","英文網址"],["excerpt","文章摘要"],["content","完整正文"],
    ["cover_image","封面圖片"],["seo_title","SEO 標題"],["seo_description","SEO 說明"],
  ];
  for (const [key,label] of required) if (!String(article[key] || "").trim()) blockers.push(`缺少${label}`);
  if (article.slug && !/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(article.slug)) blockers.push("英文網址格式不正確");
  const seoTitleLength = [...String(article.seo_title || "").trim()].length;
  if (seoTitleLength && (seoTitleLength < 5 || seoTitleLength > 70)) blockers.push("SEO 標題建議維持 5–70 個字元");
  const seoDescriptionLength = [...String(article.seo_description || "").trim()].length;
  if (seoDescriptionLength && (seoDescriptionLength < 20 || seoDescriptionLength > 180)) blockers.push("SEO 說明建議維持 20–180 個字元");
  const images = String(article.content || "").match(/<img\b[^>]*>/gi) || [];
  if (images.some((image) => !/\balt=(?:"[^"]+"|'[^']+')/i.test(image))) blockers.push("內文圖片仍有缺少替代文字的項目");
  return blockers;
}
