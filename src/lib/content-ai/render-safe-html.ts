import { cleanContent } from "@/lib/content-safety";
import type { ArticleSection } from "./schema";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
/** AI 只提供結構化文字；HTML 一律由伺服器產生並再次清洗。 */
export function renderArticleSections(sections: ArticleSection[]): string {
  const html = sections.map((section) => {
    const heading = section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : "";
    const paragraphs = section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
    return `${heading}${paragraphs}`;
  }).join("");
  return cleanContent(html);
}
