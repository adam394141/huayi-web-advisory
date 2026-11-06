import Link from "next/link";
import type { BlogPost } from "@/lib/content";
import styles from "./editorial.module.css";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Taipei",
  });
}

import editorialExtrasData from "./editorial-extras.json";

interface EditorialExtra {
  insight?: string;
  compare?: {
    title: string;
    items: Array<{ mark: string; heading: string; desc: string }>;
  };
}

const EDITORIAL_EXTRAS = editorialExtrasData as Record<string, EditorialExtra>;

function partitionContent(content: string) {
  const ctaPatterns = ["<h2>你的企業", "<h2>你的餐廳"];
  const sourcesPatterns = ["<h3>參考資料", "<h3>資料來源"];

  let ctaIndex = -1;
  for (const p of ctaPatterns) { const i = content.indexOf(p); if (i >= 0 && (ctaIndex < 0 || i < ctaIndex)) ctaIndex = i; }
  let sourcesIndex = -1;
  for (const p of sourcesPatterns) { const i = content.indexOf(p); if (i >= 0 && (sourcesIndex < 0 || i < sourcesIndex)) sourcesIndex = i; }

  const validIndexes = [ctaIndex, sourcesIndex].filter((i) => i >= 0);
  const mainEnd = validIndexes.length > 0 ? Math.min(...validIndexes) : content.length;
  const mainContent = content.slice(0, mainEnd);

  let ctaContent = "";
  let sourcesContent = "";
  if (ctaIndex >= 0 && sourcesIndex >= 0) {
    if (sourcesIndex < ctaIndex) {
      sourcesContent = content.slice(sourcesIndex, ctaIndex);
      ctaContent = content.slice(ctaIndex);
    } else {
      ctaContent = content.slice(ctaIndex, sourcesIndex);
      sourcesContent = content.slice(sourcesIndex);
    }
  } else if (ctaIndex >= 0) {
    ctaContent = content.slice(ctaIndex);
  } else if (sourcesIndex >= 0) {
    sourcesContent = content.slice(sourcesIndex);
  }

  const sections: string[] = [];
  const withAnchors = mainContent.replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (_, title: string) => {
    const index = sections.push(title.replace(/<[^>]+>/g, ""));
    return `<h2 id="section-${index}">${title}</h2>`;
  });

  const h2Start = withAnchors.search(/<h2\b/i);
  const intro = h2Start >= 0 ? withAnchors.slice(0, h2Start) : withAnchors;
  const body = h2Start >= 0 ? withAnchors.slice(h2Start) : "";

  const secondH2 = body.indexOf("<h2", 4);
  const firstChapter = secondH2 >= 0 ? body.slice(0, secondH2) : body;
  const laterChapters = secondH2 >= 0 ? body.slice(secondH2) : "";

  return { intro, firstChapter, laterChapters, ctaContent, sourcesContent, sections };
}

export function BlogContent({ post }: { post: BlogPost }) {
  const article = post.content ? partitionContent(post.content) : null;
  const dateLabel = post.published_at ? formatDate(post.published_at) : "";
  const extras = EDITORIAL_EXTRAS[post.slug];
  const hasSections = article ? article.sections.length > 0 : false;

  return (
    <div className={styles.page}>
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
                <img src={post.cover_image} alt={post.title} loading="eager" decoding="async" />
              </figure>
            )}
          </div>
        </header>

        <div className={hasSections ? styles["body-grid"] : styles["body-single"]}>
          {hasSections && article && (
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
            {article && (
              <>
                <div className={styles["lead-rule"]} aria-hidden="true" />
                <div className={styles.intro} dangerouslySetInnerHTML={{ __html: article.intro }} />

                {extras?.insight && (
                  <aside className={styles.insight} aria-label="本篇核心觀點">
                    <p className={styles["insight-label"]}>本篇核心觀點</p>
                    <p>{extras.insight}</p>
                  </aside>
                )}

                <div className={styles.prose} dangerouslySetInnerHTML={{ __html: article.firstChapter }} />

                {extras?.compare && (
                  <aside className={styles.compare} aria-label={extras.compare.title}>
                    <p className={styles["compare-title"]}>{extras.compare.title}</p>
                    <div className={styles["compare-grid"]}>
                      {extras.compare.items.map((item) => (
                        <div key={item.mark} className={styles["compare-item"]}>
                          <p className={styles.mark}>{item.mark}</p>
                          <h3>{item.heading}</h3>
                          <p>{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </aside>
                )}

                {article.laterChapters && (
                  <div className={styles.prose} dangerouslySetInnerHTML={{ __html: article.laterChapters }} />
                )}
              </>
            )}

            {post.faq && post.faq.length > 0 && (
              <section className={styles.faq} aria-labelledby="faq-title">
                <h2 id="faq-title">常見問題</h2>
                {post.faq.map((item) => (
                  <details key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </section>
            )}

            {post.sources && post.sources.length > 0 ? (
              <div className={styles.sources}>
                <h3>參考資料</h3>
                <ol>
                  {post.sources.map((s) => (
                    <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a></li>
                  ))}
                </ol>
              </div>
            ) : article?.sourcesContent ? (
              <div className={styles.sources} dangerouslySetInnerHTML={{ __html: article.sourcesContent }} />
            ) : null}

            {article?.ctaContent ? (
              <section className={styles.cta} aria-label="聯絡華翼">
                <p className={styles["cta-label"]}>HUAYI / ADVISORY</p>
                <div dangerouslySetInnerHTML={{ __html: article.ctaContent }} />
              </section>
            ) : null}

            <div className={styles.endline}>
              <Link href="/blog">← 返回觀點</Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
