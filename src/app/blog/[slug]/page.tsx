import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/content";
import { BlogContent } from "./blog-content";
import { safeJsonLd } from "@/lib/content-safety";
import { getCanonicalSiteUrl } from "@/lib/site-url";
import { getContentRedirect } from "@/lib/content-redirect";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "文章不存在" };

  const title = post.seo_title || `${post.title}｜華翼品牌策略`;
  const description = post.seo_description || post.excerpt || post.title;
  const ogImg = post.og_image || post.cover_image;
  const canonical = `${getCanonicalSiteUrl()}/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: post.tags,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      siteName: "華翼品牌策略",
      locale: "zh_TW",
      images: ogImg
        ? [{ url: ogImg, width: 1200, height: 630, alt: post.title }]
        : [],
      url: canonical,
    },
    twitter: { card: "summary_large_image", title, description, images: ogImg ? [ogImg] : [] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    const destination = await getContentRedirect(`/blog/${slug}`);
    if (destination) permanentRedirect(destination);
    notFound();
  }

  const site = getCanonicalSiteUrl();

  const articleLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${site}/#organization`, name: "華翼品牌策略", url: site },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "首頁", item: site },
        { "@type": "ListItem", position: 2, name: "觀點", item: `${site}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: `${site}/blog/${slug}` },
      ] },
      { "@type": "Article", headline: post.title, description: post.seo_description || post.excerpt || post.title,
        ...(post.ai_summary ? { abstract: post.ai_summary } : {}),
        datePublished: post.published_at, dateModified: post.updated_at || post.published_at,
        author: { "@type": post.author && post.author !== "華翼品牌策略" ? "Person" : "Organization", name: post.author || "華翼品牌策略" },
        publisher: { "@id": `${site}/#organization` }, mainEntityOfPage: `${site}/blog/${slug}`,
        ...(post.og_image || post.cover_image ? { image: post.og_image || post.cover_image } : {}) },
      ...(post.faq?.length ? [{ "@type": "FAQPage", mainEntity: post.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }] : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLd) }}
      />
      <BlogContent post={post} />
    </>
  );
}
