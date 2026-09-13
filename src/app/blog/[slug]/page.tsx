import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/content";
import { BlogContent } from "./blog-content";
import { safeJsonLd } from "@/lib/content-safety";

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

  return {
    title,
    description,
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
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo_description || post.excerpt || post.title,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      "@type": "Organization",
      name: post.author || "華翼品牌策略",
      url: "https://huayi.tw",
    },
    publisher: {
      "@type": "Organization",
      name: "華翼品牌策略",
      url: "https://huayi.tw",
    },
    mainEntityOfPage: `https://huayi.tw/blog/${slug}`,
    ...(post.og_image || post.cover_image
      ? { image: post.og_image || post.cover_image }
      : {}),
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
