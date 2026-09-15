import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "觀點｜華翼品牌策略",
  description: "華翼品牌策略的品牌觀點與 AI 趨勢分享。",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <section className="px-[var(--space-page-x)] pb-0 pt-20 md:pt-28">
        <div className="mx-auto max-w-[1280px]">
          <p className="text-[12px] tracking-[0.4em] text-[var(--color-subtle)]">
            BLOG
          </p>
          <h1 className="mt-4 font-serif text-[2rem] font-semibold leading-tight text-[var(--color-fg)] md:text-[3rem]">
            品牌觀點。
          </h1>
        </div>
      </section>

      <section className="px-[var(--space-page-x)] pb-20 pt-12">
        <div className="mx-auto max-w-[1280px]">
          {posts.length === 0 ? (
            <p className="py-20 text-center text-[var(--color-subtle)]">
              目前尚無文章
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <div className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface)]">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        width={600}
                        height={338}
                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="aspect-[16/9] w-full bg-[var(--color-surface-alt)]" />
                    )}
                  </div>

                  <div className="mt-5">
                    <span className="inline-block rounded-full bg-[var(--color-surface)] px-3 py-1 text-[12px] tracking-wider text-[var(--color-body)]">
                      {post.category}
                    </span>
                    <h3 className="mt-3 font-serif text-[17px] font-medium leading-snug text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-gold-dark)]">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-[var(--color-body)]">
                        {post.excerpt}
                      </p>
                    )}
                    {post.published_at && (
                      <p className="mt-3 text-[12px] text-[var(--color-subtle)]">
                        {formatDate(post.published_at)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
