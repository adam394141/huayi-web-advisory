import sanitizeHtml from "sanitize-html";

export function isTrustedImageSource(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//") && !src.includes("\\")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && !url.username && !url.password &&
      ["huayi.tw", "rhkmzcyfzemlobznltyz.supabase.co"].includes(url.hostname);
  } catch { return false; }
}

/** 僅在伺服器資料出口使用：保留圖文，移除腳本、事件、表單及嵌入頁面。 */
export function cleanContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li", "blockquote", "a", "img", "figure", "figcaption", "hr", "table", "thead", "tbody", "tr", "th", "td", "div", "span"],
    allowedAttributes: { a: ["href", "title"], img: ["src", "alt", "width", "height"], th: ["colspan", "rowspan"], td: ["colspan", "rowspan"] },
    allowedSchemes: ["https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https"] },
    allowProtocolRelative: false,
    transformTags: { img: (_tag, attributes) => ({ tagName: "img", attribs: { ...attributes, loading: "lazy" } }) },
    exclusiveFilter: (frame) => {
      if (frame.tag !== "img") return false;
      const src = frame.attribs.src;
      if (!src) return true;
      return !isTrustedImageSource(src);
    },
  });
}

/** 防止標題等資料提前關閉 JSON-LD 的 script 標籤。 */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
