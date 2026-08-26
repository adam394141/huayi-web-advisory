"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Work } from "@/lib/content";

export function WorkDetail({ work }: { work: Work }) {
  const heroSrc = work.hero_image || work.cover_image;

  return (
    <article className="px-[var(--space-page-x)] pb-20 pt-16 md:pt-24">
      <div className="mx-auto max-w-[1280px]">
        <Link
          href="/works"
          className="mb-10 inline-block text-[13px] text-[var(--color-subtle)] transition-colors hover:text-[var(--color-fg)]"
        >
          ← 返回作品列表
        </Link>

        {heroSrc && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden rounded-[var(--radius-module)] bg-[var(--color-surface)]"
          >
            <Image
              src={heroSrc}
              alt={work.title}
              width={1280}
              height={800}
              className="w-full object-contain"
              priority
            />
          </motion.div>
        )}

        <div className="mx-auto mt-12 max-w-[800px]">
          <span className="inline-block rounded-full bg-[var(--color-surface)] px-4 py-1.5 text-[11px] tracking-wider text-[var(--color-body)]">
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

          {work.content && (
            <div
              className="mt-8 text-[15px] leading-[1.9] text-[var(--color-body)] [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--color-fg)] [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-medium [&_h3]:text-[var(--color-fg)] [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: work.content }}
            />
          )}
        </div>

        {work.gallery && work.gallery.length > 0 && (
          <div className="mx-auto mt-16 max-w-[1280px] space-y-8">
            {work.gallery.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden rounded-[var(--radius-image)] bg-[var(--color-surface)]"
              >
                <Image
                  src={img.src}
                  alt={img.alt || work.title}
                  width={img.width || 1280}
                  height={img.height || 800}
                  className="w-full object-contain"
                />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mx-auto mt-16 max-w-[800px] border-t border-[var(--color-surface-alt)] pt-10">
          <Link
            href="/works"
            className="text-[13px] text-[var(--color-subtle)] transition-colors hover:text-[var(--color-fg)]"
          >
            ← 返回作品列表
          </Link>
        </div>
      </div>
    </article>
  );
}
