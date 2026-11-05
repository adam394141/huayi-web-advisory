"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { Work } from "@/lib/content";

const SUPABASE_HOST = "rhkmzcyfzemlobznltyz.supabase.co";

function optimizeContentImages(html: string): string {
  return html.replace(
    /(<img\b[^>]*)\ssrc="(https:\/\/rhkmzcyfzemlobznltyz\.supabase\.co\/storage\/v1\/object\/public\/[^"]+)"/g,
    (_match, prefix, url) => {
      const optimized = `/_next/image?url=${encodeURIComponent(url)}&w=828&q=82`;
      return `${prefix} src="${optimized}" data-original="${url}"`;
    },
  );
}

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
              sizes="(max-width: 1312px) 100vw, 1280px"
              quality={82}
              className="w-full h-auto"
              preload
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
            className="work-prose mt-10"
            dangerouslySetInnerHTML={{ __html: optimizeContentImages(work.content) }}
          />
        )}

        {galleryUrls.length > 0 && (
          <div className="mx-auto mt-16 max-w-[800px] space-y-6">
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
  return (
    <div className="overflow-hidden rounded-[var(--radius-image)] bg-[var(--color-surface)]">
      <img
        src={url}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-auto"
      />
    </div>
  );
}
