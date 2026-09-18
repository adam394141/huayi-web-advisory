"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { shouldAnimate } from "@/lib/motion";

interface WorkItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  cover_image?: string;
}

export function WorksMotion({ works }: { works: WorkItem[] }) {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {works.map((work, i) => (
        <WorkCard key={work.id} work={work} index={i} />
      ))}
    </div>
  );
}

function WorkCard({ work, index }: { work: WorkItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(true);
  const [parallax, setParallax] = useState(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animate = shouldAnimate();
    reducedRef.current = !animate;
    if (!animate) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 60) return;

    setRevealed(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-40px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleScroll = useCallback(() => {
    if (reducedRef.current) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const viewCenter = window.innerHeight / 2;
    const offset = (center - viewCenter) * 0.04;
    setParallax(Math.max(-15, Math.min(15, offset)));
  }, []);

  useEffect(() => {
    if (reducedRef.current) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const delay = index * 0.1;

  return (
    <div ref={ref}>
      <Link href={`/works/${work.slug}`} className="group block">
        <div
          style={{
            transform: `translateY(${parallax}px)`,
            transition: "transform 0.1s linear",
          }}
        >
          <div
            className="overflow-hidden rounded-[var(--radius-image)] bg-[var(--color-surface)]"
            style={{
              clipPath: revealed ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              transition: revealed
                ? `clip-path 0.7s cubic-bezier(0.23,1,0.32,1) ${delay}s`
                : "none",
            }}
          >
            {work.cover_image ? (
              <Image
                src={work.cover_image}
                alt={work.title}
                width={600}
                height={750}
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                quality={82}
                className="aspect-[4/5] w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="aspect-[4/5] w-full" />
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1">
          <h3
            className="text-[14px] font-medium text-[var(--color-fg)] transition-transform duration-300 group-hover:translate-x-1"
          >
            {work.title}
          </h3>
          <span className="text-[12px] text-[var(--color-subtle)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            →
          </span>
        </div>
        {work.description && (
          <p className="mt-1 line-clamp-1 text-[12px] text-[var(--color-subtle)]">
            {work.description}
          </p>
        )}
      </Link>
    </div>
  );
}
