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
    const level = section.heading_level === 3 || section.heading_level === 4 ? section.heading_level : 2;
    const heading = section.heading ? `<h${level}>${escapeHtml(section.heading)}</h${level}>` : "";
    const paragraphs = section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
    const bulletPoints = section.bullet_points || [];
    const numberedSteps = section.numbered_steps || [];
    const bullets = bulletPoints.length
      ? `<ul>${bulletPoints.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";
    const steps = numberedSteps.length
      ? `<ol>${numberedSteps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>` : "";
    return `${heading}${paragraphs}${bullets}${steps}`;
  }).join("");
  return cleanContent(html);
}
