import type { Metadata } from "next";
import Link from "next/link";
import { partitionContent } from "@/app/blog/[slug]/partition-content";
import { cleanContent } from "@/lib/content-safety";
import styles from "@/app/blog/[slug]/editorial.module.css";
import editorialExtrasData from "@/app/blog/[slug]/editorial-extras.json";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "華翼獲2026勞動部微型創業楷模｜從創業走向創業輔導",
  description: "華翼國際行銷創辦人饒芝綺獲選2026年勞動部微型創業楷模。兩年一次的珍貴肯定，記錄華翼從品牌設計、企業顧問到AI應用的發展歷程。",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://huayi.tw/blog/startup-award-2026" },
};

interface EditorialExtra {
  insight?: string;
  relatedLinks?: Array<{ title: string; url: string; desc: string }>;
}
const EXTRAS = (editorialExtrasData as Record<string, EditorialExtra>)["startup-award-2026"];

const MOCK_POST = {
  title: "華翼獲選2026年勞動部微型創業楷模，這份肯定對我們意義重大",
  slug: "startup-award-2026",
  excerpt: "華翼國際行銷創辦人饒芝綺獲選2026年勞動部微型創業楷模。兩年一次的珍貴肯定，記錄華翼從品牌設計、企業顧問到AI應用的發展歷程，以及受邀投入創業顧問工作的下一步。",
  category: "華翼動態",
  author: "華翼品牌策略",
  cover_image: "/blog/startup-award-2026/award-group-cover-2026.webp",
  published_at: "2026-11-19T08:00:00+08:00",
  faq: [
    { question: "勞動部微型創業楷模多久舉辦一次？", answer: "勞動部微型創業楷模選拔每兩年舉辦一次。2026 年為第 13 屆，共有 115 位創業者參選，最後選出 10 位微型創業楷模。" },
    { question: "華翼這次獲獎的是誰？", answer: "2026 年勞動部微型創業楷模獲獎者為華翼國際行銷有限公司創辦人饒芝綺。勞動部新聞稿也介紹了華翼結合品牌策略與 AI 工具的發展方向。" },
    { question: "華翼的創業顧問主要能協助哪些事情？", answer: "華翼具備品牌策略、行銷、企業經營及 AI 應用等專業經驗，可依創業者的需求，協助分析目標市場、品牌定位、客戶開發與經營流程等問題。實際服務項目與合作方式，仍依個別需求及顧問邀約安排而定。" },
  ],
};

function getContent(): string {
  const filePath = join(process.cwd(), "public/blog/startup-award-2026/content.html");
  const raw = readFileSync(filePath, "utf-8");
  return cleanContent(raw);
}

export default function StartupAwardPreview() {
  const content = getContent();
  const article = partitionContent(content);
  const hasSections = article.sections.length > 0;

  const dateLabel = new Date(MOCK_POST.published_at).toLocaleDateString("zh-TW", {
    year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Taipei",
  });

  return (
    <div className={styles.page}>
      <div style={{ background: "#FEF3D9", color: "#71511B", padding: "11px 24px", textAlign: "center", fontSize: "13px", borderBottom: "1px solid #EBCB80" }}>
        草稿預覽 — 尚未發布，僅供 Adam 審核
      </div>
      <article>
        <header className={styles.hero}>
          <div className={styles["hero-inner"]}>
            <p className={styles.overline}>HUAYI / BUSINESS INSIGHTS</p>
            <h1>{MOCK_POST.title}</h1>
            <p className={styles.dek}>{MOCK_POST.excerpt}</p>
            <div className={styles.meta}>
              <span className={styles.pill}>{MOCK_POST.category}</span>
              <span>{dateLabel}</span>
              <span aria-hidden="true">／</span>
              <span>{MOCK_POST.author}</span>
            </div>
            {/* 封面用 3:2 原比例，不裁切成 16:9 */}
            <figure className={styles["hero-cover"]} style={{ aspectRatio: "auto" }}>
              <img
                src={MOCK_POST.cover_image}
                alt="2026年勞動部微型創業楷模頒獎典禮，獲獎創業者與與會嘉賓於舞台合影"
                loading="eager"
                decoding="async"
                style={{ aspectRatio: "auto", objectFit: "contain" }}
              />
            </figure>
            <p style={{ fontSize: "13px", color: "#878078", marginTop: "12px", paddingLeft: "12px", borderLeft: "2px solid #DFD8CA" }}>
              2026年11月18日，勞動部舉辦微型創業楷模頒獎典禮，華翼國際行銷創辦人饒芝綺獲選本屆微型創業楷模。
            </p>
          </div>
        </header>

        <div className={hasSections ? styles["body-grid"] : styles["body-single"]}>
          {hasSections && (
            <aside className={styles.rail} aria-label="文章章節導覽">
              <p className={styles["rail-label"]}>IN THIS ARTICLE</p>
              <nav>
                {article.sections.map((label, i) => (
                  <a key={i} href={`#section-${i + 1}`}>{label}</a>
                ))}
              </nav>
            </aside>
          )}

          <div className={styles.content}>
            <div className={styles["lead-rule"]} aria-hidden="true" />
            <div className={styles.intro} dangerouslySetInnerHTML={{ __html: article.intro }} />

            {EXTRAS?.insight && (
              <aside className={styles.insight} aria-label="本篇核心觀點">
                <p className={styles["insight-label"]}>本篇核心觀點</p>
                <p>{EXTRAS.insight}</p>
              </aside>
            )}

            <div className={styles.prose} dangerouslySetInnerHTML={{ __html: article.firstChapter }} />

            {article.laterChapters && (
              <div className={styles.prose} dangerouslySetInnerHTML={{ __html: article.laterChapters }} />
            )}

            {MOCK_POST.faq && MOCK_POST.faq.length > 0 && (
              <section className={styles.faq} aria-labelledby="faq-title">
                <h2 id="faq-title">常見問題</h2>
                {MOCK_POST.faq.map((item) => (
                  <details key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </section>
            )}

            {EXTRAS?.relatedLinks && EXTRAS.relatedLinks.length > 0 && (
              <section className={styles.related} aria-label="延伸閱讀">
                <p className={styles["related-label"]}>延伸閱讀｜華翼品牌策略</p>
                {EXTRAS.relatedLinks.map((link) => (
                  <Link key={link.url} href={link.url} className={styles["related-item"]}>
                    <span className={styles["related-title"]}>{link.title}</span>
                    <span className={styles["related-desc"]}>{link.desc}</span>
                  </Link>
                ))}
              </section>
            )}

            {article.ctaContent && (
              <section className={styles.cta} aria-label="聯絡華翼">
                <p className={styles["cta-label"]}>HUAYI / ADVISORY</p>
                <div dangerouslySetInnerHTML={{ __html: article.ctaContent }} />
              </section>
            )}

            <div className={styles.endline}>
              <Link href="/blog">← 返回觀點</Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
