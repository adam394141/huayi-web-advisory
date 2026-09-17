import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWorkBySlug, getWorkStorageImages } from "@/lib/content";
import { WorkDetail } from "./work-detail";
import { safeJsonLd } from "@/lib/content-safety";
import { getCanonicalSiteUrl } from "@/lib/site-url";

export const revalidate = 60;

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

  const coverFilename = work.cover_image
    ? work.cover_image.split("/").pop()
    : null;
  const galleryUrls = storageImages
    .filter((img) => img.name !== coverFilename)
    .map((img) => img.url);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首頁", item: "https://huayi.tw" },
      { "@type": "ListItem", position: 2, name: "作品", item: "https://huayi.tw/works" },
      { "@type": "ListItem", position: 3, name: work.title },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }}
      />
      <WorkDetail work={work} galleryUrls={galleryUrls} />
    </>
  );
}
