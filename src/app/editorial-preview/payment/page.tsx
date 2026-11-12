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
  title: "HUAYI Editorial 2.0｜金流選擇文章預覽",
  description: "替客戶挑選金流，我為什麼最後選擇統一金流？ — 草稿預覽",
  robots: { index: false, follow: false },
};

interface EditorialExtra {
  insight?: string;
  relatedLinks?: Array<{ title: string; url: string; desc: string }>;
}
const EXTRAS = (editorialExtrasData as Record<string, EditorialExtra>)["payment"];

const MOCK_POST = {
  title: "替客戶挑選金流，我為什麼最後選擇統一金流？",
  slug: "payment",
  excerpt: "選擇金流沒有適合所有企業的答案。本文從一次匿名客戶案例出發，分享華翼如何比較申請經驗、撥款、物流與管理成本，做出符合現階段需求的主觀選擇。",
  category: "品牌經營／電商實務",
  author: "華翼品牌策略",
  cover_image: "/blog/payment/payment-gateway-cover.webp",
  published_at: "2026-11-12T08:00:00+08:00",
};

function getContent(): string {
  const filePath = join(process.cwd(), "public/blog/payment/content.html");
  const raw = readFileSync(filePath, "utf-8");
  return cleanContent(raw);
}

export default function PaymentPreview() {
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
            <figure className={styles["hero-cover"]}>
              <img src={MOCK_POST.cover_image} alt="企業規劃電商金流與出貨流程的工作桌" loading="eager" decoding="async" />
            </figure>
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
