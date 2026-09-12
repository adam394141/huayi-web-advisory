"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Work } from "@/lib/content";

const CATEGORIES = ["設計專案", "品牌周邊", "AI 專案", "行銷專案"] as const;

export function WorksFilter({ works }: { works: Work[] }) {
  const [active, setActive] = useState<string>("設計專案");

  const filtered = works.filter((w) => w.category === active);

  return (
    <section className="px-[var(--space-page-x)] pb-20 pt-12">
      <div className="mx-auto max-w-[1280px]">
        <nav className="mb-12 flex flex-wrap gap-4 md:gap-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`relative border-b-2 pb-2 text-[15px] tracking-wider transition-colors ${
                active === cat
                  ? "border-[var(--color-gold)] text-[var(--color-fg)]"
                  : "border-transparent text-[var(--color-subtle)] hover:text-[var(--color-body)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.length === 0 ? (
              <p className="col-span-full py-20 text-center text-[var(--color-subtle)]">
                目前尚無此分類作品
              </p>
            ) : (
              filtered.map((work) => (
                <Link key={work.id} href={`/works/${work.slug}`} className="group">
                  <div className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface)]">
                    {work.cover_image ? (
                      <Image
                        src={work.cover_image}
                        alt={work.title}
                        width={600}
                        height={750}
                        className="aspect-[4/5] w-full object-contain"
                      />
                    ) : (
                      <div className="aspect-[4/5] w-full" />
                    )}
                  </div>
                  <h3 className="mt-4 font-sans text-[15px] font-medium text-[var(--color-fg)]">
                    {work.title}
                  </h3>
                  {work.description && (
                    <p className="mt-1.5 line-clamp-1 text-[12px] text-[var(--color-subtle)]">
                      {work.description}
                    </p>
                  )}
                </Link>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
