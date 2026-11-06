/**
 * 檔案目標：src/app/editorial-preview/starbucks/page.tsx
 * HUAYI Editorial 2.0 只讀 POC；正式文章不變，Production 一律 404。
 * 同層放置 editorial.module.css。
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/content";
import styles from "./editorial.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "HUAYI Editorial 2.0｜星巴克文章預覽",
  description: "華翼企業經營觀點文章的編輯設計 POC。此為獨立預覽頁，並非正式文章版本。",
  robots: { index: false, follow: false },
  alternates: { canonical: "/blog/starbucks-promotion-brand-pricing-strategy" },
};

const SLUG = "starbucks-promotion-brand-pricing-strategy";
const CTA_MARKER = "<h2>你的企業";
const SOURCES_MARKER = "<h3>參考資料";

/** 只整理已經由 getPostBySlug/cleanContent 清理過的 HTML；不改寫文章與資料庫。 */
function partitionContent(content: string) {
  const ctaIndex = content.indexOf(CTA_MARKER);
  const sourcesIndex = content.indexOf(SOURCES_MARKER);
  const mainEnd = ctaIndex >= 0 ? ctaIndex : (sourcesIndex >= 0 ? sourcesIndex : content.length);
  const mainContent = content.slice(0, mainEnd);
  const ctaContent = ctaIndex >= 0
    ? content.slice(ctaIndex, sourcesIndex > ctaIndex ? sourcesIndex : content.length)
    : "";
  const sourcesContent = sourcesIndex >= 0 ? content.slice(sourcesIndex) : "";

  const sections: string[] = [];
  const withAnchors = mainContent.replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (_, title: string) => {
    const index = sections.push(title.replace(/<[^>]+>/g, ""));
    return `<h2 id="editorial-section-${index}">${title}</h2>`;
  });
  const h2Start = withAnchors.search(/<h2\b/i);
  const intro = h2Start >= 0 ? withAnchors.slice(0, h2Start) : withAnchors;
  const chapters = h2Start >= 0 ? withAnchors.slice(h2Start) : "";
  const secondH2 = chapters.indexOf("<h2", 4);
  return {
    intro,
    firstChapter: secondH2 >= 0 ? chapters.slice(0, secondH2) : chapters,
    laterChapters: secondH2 >= 0 ? chapters.slice(secondH2) : "",
    ctaContent,
    sourcesContent,
    sections,
  };
}

export default async function StarbucksEditorialPreview() {
  // 防止測試頁在生產環境被存取；部署 Preview 才能查看。
  if (process.env.VERCEL_ENV === "production") notFound();
  const post = await getPostBySlug(SLUG);
  if (!post || !post.content) notFound();

  const article = partitionContent(post.content);
  const dateLabel = post.published_at
    ? new Date(post.published_at).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Taipei" })
    : "";

  return (
    <div className={styles.page}>
      {/* preview-note 只在開發時顯示，正式驗收不需要 */}
      <article>
        <header className={styles.hero}>
          <div className={styles["hero-inner"]}>
            <p className={styles.overline}>HUAYI / BUSINESS INSIGHTS</p>
            <h1>{post.title}</h1>
            {post.excerpt && <p className={styles.dek}>{post.excerpt}</p>}
            <div className={styles.meta}>
              <span className={styles.pill}>{post.category}</span>
              {dateLabel && <span>{dateLabel}</span>}
              <span aria-hidden="true">／</span>
              <span>{post.author || "華翼品牌策略"}</span>
            </div>
            {post.cover_image && (
              <figure className={styles["hero-cover"]}>
                {/* 使用既有文章圖片，不觸發已知的 Vercel Image 402 方案問題 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.cover_image} alt={post.title} width={1600} height={900} loading="eager" decoding="async" />
              </figure>
            )}
          </div>
        </header>
        <div className={styles["body-grid"]}>
          <aside className={styles.rail} aria-label="文章章節導覽">
            <p className={styles["rail-label"]}>IN THIS ARTICLE</p>
            <nav>
              {article.sections.map((label, i) => (
                <a key={i} href={`#editorial-section-${i + 1}`}>{label}</a>
              ))}
            </nav>
            {/* 側欄備註移除 */}
          </aside>
          <div className={styles.content}>
            <div className={styles["lead-rule"]} aria-hidden="true" />
            <div className={styles.intro} dangerouslySetInnerHTML={{ __html: article.intro }} />
            <aside className={styles.insight} aria-label="本篇核心觀點">
              <p className={styles["insight-label"]}>本篇核心觀點</p>
              <p>如果顧客只願意等折扣，企業就應該重新檢查原價的吸引力。</p>
            </aside>
            <div className={styles.prose} dangerouslySetInnerHTML={{ __html: article.firstChapter }} />
            <aside className={styles.compare} aria-label="優惠與收費的差異">
              <p className={styles["compare-title"]}>同一品牌，兩種價格訊號</p>
              <div className={styles["compare-grid"]}>
                <div className={styles["compare-item"]}>
                  <p className={styles.mark}>促銷優惠</p>
                  <h3>「這次買得划算」</h3>
                  <p>提供購買誘因，適合用於特定日期、會員及產品活動。</p>
                </div>
                <div className={styles["compare-item"]}>
                  <p className={styles.mark}>客製化收費</p>
                  <h3>「以前不是免費嗎？」</h3>
                  <p>反映額外成本，也需要處理原有顧客的服務期待。</p>
                </div>
              </div>
            </aside>
            <div className={styles.prose} dangerouslySetInnerHTML={{ __html: article.laterChapters }} />
            {post.faq && post.faq.length > 0 && (
              <section className={styles.faq} aria-labelledby="preview-faq-title">
                <h2 id="preview-faq-title">常見問題</h2>
                {post.faq.map((item) => (
                  <details key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </section>
            )}
            {/* 參考資料已移除 */}
            {article.ctaContent && (
              <section className={styles.cta} aria-label="聯絡華翼">
                <p className={styles["cta-label"]}>HUAYI / ADVISORY</p>
                <div dangerouslySetInnerHTML={{ __html: article.ctaContent }} />
              </section>
            )}
            {/* 底部備註連結移除 */}
          </div>
        </div>
      </article>
    </div>
  );
}
