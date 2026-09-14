"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { Work } from "@/lib/content";

export function WorkDetail({
  work,
  galleryUrls,
}: {
  work: Work;
  galleryUrls: string[];
}) {
  const heroSrc = work.hero_image || work.cover_image;

  return (
    <article className="px-[var(--space-page-x)] pb-20 pt-16 md:pt-24">
      <div className="mx-auto max-w-[1280px]">
        <Link
          href="/works"
          className="mb-10 inline-block text-[15px] text-[var(--color-subtle)] transition-colors hover:text-[var(--color-fg)]"
        >
          ← 返回作品列表
        </Link>

        {heroSrc && (
          <div className="overflow-hidden rounded-[var(--radius-module)] bg-[var(--color-surface)]">
            <Image
              src={heroSrc}
              alt={work.title}
              width={1280}
              height={800}
              className="w-full object-contain"
              priority
            />
          </div>
        )}

        <div className="mx-auto mt-12 max-w-[800px]">
          <span className="inline-block rounded-full bg-[var(--color-surface)] px-4 py-1.5 text-[12px] tracking-wider text-[var(--color-body)]">
            {work.category}
          </span>

          <h1 className="mt-6 font-serif text-[1.8rem] font-semibold leading-tight text-[var(--color-fg)] md:text-[2.4rem]">
            {work.title}
          </h1>

          {work.description && (
            <p className="mt-6 text-[15px] leading-relaxed text-[var(--color-body)]">
              {work.description}
            </p>
          )}

        </div>

        {work.content && (
          <div
            className="mt-8 text-[15px] leading-[1.9] text-[var(--color-body)] [&_a]:underline [&_figcaption]:mx-auto [&_figcaption]:mt-3 [&_figcaption]:max-w-[800px] [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-[var(--color-subtle)] [&_figure]:my-10 [&_figure]:overflow-hidden [&_figure]:rounded-[var(--radius-image)] [&_figure_img]:h-auto [&_figure_img]:w-full [&_figure_img]:object-contain [&_h2]:mx-auto [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:max-w-[800px] [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--color-fg)] [&_h3]:mx-auto [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:max-w-[800px] [&_h3]:font-medium [&_h3]:text-[var(--color-fg)] [&_li]:mx-auto [&_li]:max-w-[760px] [&_p]:mx-auto [&_p]:mb-4 [&_p]:max-w-[800px] [&_ul]:mx-auto [&_ul]:mb-4 [&_ul]:max-w-[800px] [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: work.content }}
          />
        )}

        {galleryUrls.length > 0 && (
          <div className="mt-16 space-y-6">
            {galleryUrls.map((url, i) => (
              <ScrollReveal key={url} delay={0}>
                <GalleryImage url={url} alt={`${work.title} - ${i + 1}`} />
              </ScrollReveal>
            ))}
          </div>
        )}

        <div className="mx-auto mt-16 max-w-[800px] border-t border-[var(--color-surface-alt)] pt-10">
          <Link
            href="/works"
            className="text-[15px] text-[var(--color-subtle)] transition-colors hover:text-[var(--color-fg)]"
          >
            ← 返回作品列表
          </Link>
        </div>
      </div>
    </article>
  );
}

function GalleryImage({ url, alt }: { url: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex h-40 items-center justify-center rounded-[var(--radius-image)] bg-[var(--color-surface)] text-[15px] text-[var(--color-subtle)]">
        圖片載入失敗
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-image)] bg-[var(--color-surface)]">
      <Image
        src={url}
        alt={alt}
        width={1280}
        height={800}
        className="w-full object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
}
