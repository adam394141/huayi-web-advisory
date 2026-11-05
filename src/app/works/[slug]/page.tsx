import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWorkBySlug, getWorkStorageImages, getPublishedWorks } from "@/lib/content";
import { WorkDetail } from "./work-detail";
import { safeJsonLd } from "@/lib/content-safety";
import { getCanonicalSiteUrl } from "@/lib/site-url";

export const revalidate = 60;

export async function generateStaticParams() {
  const works = await getPublishedWorks();
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return { title: "找不到作品" };

  const title = work.seo_title || `${work.title}｜華翼品牌策略`;
  const description = work.seo_description || work.description || "";
  const ogImg = work.og_image || work.cover_image;
  const canonical = `${getCanonicalSiteUrl()}/works/${work.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "華翼品牌策略",
      locale: "zh_TW",
      type: "article",
      images: ogImg ? [{ url: ogImg, width: 1200, height: 630, alt: work.title }] : [],
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [work, storageImages] = await Promise.all([
    getWorkBySlug(slug),
    getWorkStorageImages(slug),
  ]);
  if (!work) notFound();

  const coverRaw = work.cover_image ? work.cover_image.split("/").pop() : null;
  const coverBase = coverRaw ? coverRaw.replace(/\.[^.]+$/, "") : null;

  // 從內文 HTML 提取已使用的圖片檔名（去副檔名），避免底部圖片牆重複顯示
  const usedInContent = new Set<string>();
  if (work.content) {
    const srcRegex = /src=["']([^"']+)["']/g;
    let m;
    while ((m = srcRegex.exec(work.content)) !== null) {
      const filename = m[1].split("/").pop();
      if (filename) {
        usedInContent.add(filename);
        usedInContent.add(filename.replace(/\.[^.]+$/, ""));
      }
    }
  }

  const stripExt = (name: string) => name.replace(/\.[^.]+$/, "");
  const galleryUrls = storageImages
    .filter((img) => stripExt(img.name) !== coverBase && !usedInContent.has(img.name) && !usedInContent.has(stripExt(img.name)))
    .map((img) => img.url);

  const site = getCanonicalSiteUrl();
  const canonical = `${site}/works/${work.slug}`;
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首頁", item: site },
      { "@type": "ListItem", position: 2, name: "作品", item: `${site}/works` },
      { "@type": "ListItem", position: 3, name: work.title },
    ],
  };

  const creativeWorkLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.title,
    description: work.seo_description || work.description || "",
    url: canonical,
    ...(work.cover_image ? { image: work.cover_image } : {}),
    creator: {
      "@type": "Organization",
      name: "華翼品牌策略",
      url: site,
    },
    ...(work.client ? { about: { "@type": "Organization", name: work.client } } : {}),
  };

  const jsonLdScripts = [breadcrumbLd, creativeWorkLd];

  return (
    <>
      {jsonLdScripts.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(ld) }}
        />
      ))}
      <WorkDetail work={work} galleryUrls={galleryUrls} />
    </>
  );
}
