"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/content";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--color-surface-alt)]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 font-medium text-[var(--color-fg)]">{question}</span>
        <span className="shrink-0 text-[var(--color-subtle)] transition-transform" style={{ transform: open ? "rotate(45deg)" : "rotate(0)" }}>
          +
        </span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden pb-5 text-[14px] leading-relaxed text-[var(--color-body)]"
        >
          {answer}
        </motion.div>
      )}
    </div>
  );
}

export function BlogContent({ post }: { post: BlogPost }) {
  return (
    <article className="px-[var(--space-page-x)] pb-20 pt-16 md:pt-24">
      <div className="mx-auto max-w-[800px]">
        <Link
          href="/blog"
          className="mb-10 inline-block text-[13px] text-[var(--color-subtle)] transition-colors hover:text-[var(--color-fg)]"
        >
          ← 返回觀點
        </Link>

        {post.cover_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden rounded-[var(--radius-module)]"
          >
            <Image
              src={post.cover_image}
              alt={post.title}
              width={800}
              height={450}
              className="w-full object-cover"
              priority
            />
          </motion.div>
        )}

        <div className="mt-10 flex items-center gap-4">
          <span className="inline-block rounded-full bg-[var(--color-surface)] px-4 py-1.5 text-[11px] tracking-wider text-[var(--color-body)]">
            {post.category}
          </span>
          {post.published_at && (
            <span className="text-[12px] text-[var(--color-subtle)]">
              {formatDate(post.published_at)}
            </span>
          )}
        </div>

        <h1 className="mt-6 font-serif text-[1.8rem] font-semibold leading-tight text-[var(--color-fg)] md:text-[2.4rem]">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-6 text-[17px] leading-relaxed text-[var(--color-body)]">
            {post.excerpt}
          </p>
        )}

        {post.content && (
          <div
            className="mt-10 text-[15px] leading-[1.9] text-[var(--color-body)] [&_a]:text-[var(--color-gold-dark)] [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-gold)] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-[var(--color-subtle)] [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--color-fg)] [&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:font-medium [&_h3]:text-[var(--color-fg)] [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}

        {post.faq && post.faq.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-serif text-xl font-semibold text-[var(--color-fg)]">
              常見問題
            </h2>
            <div className="divide-y-0">
              {post.faq.map((item, i) => (
                <FaqItem key={i} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 border-t border-[var(--color-surface-alt)] pt-10">
          <Link
            href="/blog"
            className="text-[13px] text-[var(--color-subtle)] transition-colors hover:text-[var(--color-fg)]"
          >
            ← 返回觀點
          </Link>
        </div>
      </div>
    </article>
  );
}
