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

const SOURCES_MARKER = "<h3>參考資料";
const CTA_MARKER = "<h2>你的企業";

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
    return `<h2 id="section-${index}">${title}</h2>`;
  });
  const h2Start = withAnchors.search(/<h2\b/i);
  const intro = h2Start >= 0 ? withAnchors.slice(0, h2Start) : withAnchors;
  const body = h2Start >= 0 ? withAnchors.slice(h2Start) : "";
  return { intro, body, ctaContent, sourcesContent, sections };
}

export function BlogContent({ post }: { post: BlogPost }) {
  const article = post.content ? partitionContent(post.content) : null;
  const dateLabel = post.published_at ? formatDate(post.published_at) : "";

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

        <div className={styles["body-grid"]}>
          {article && article.sections.length > 0 && (
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
                <div className={styles.prose} dangerouslySetInnerHTML={{ __html: article.body }} />
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

            {article?.sourcesContent && (
              <div className={styles.sources} dangerouslySetInnerHTML={{ __html: article.sourcesContent }} />
            )}

            {article?.ctaContent && (
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
