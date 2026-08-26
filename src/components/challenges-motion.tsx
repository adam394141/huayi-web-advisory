"use client";

import { useRef, useEffect, useState } from "react";

interface ChallengesMotionProps {
  items: Array<{ title: string; desc: string }>;
}

export function ChallengesMotion({ items }: ChallengesMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(true);
  const [headerRevealed, setHeaderRevealed] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    if (rect.top < window.innerHeight + 60) return;

    setRevealed(false);
    setHeaderRevealed(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderRevealed(true);
          setTimeout(() => setRevealed(true), 200);
          observer.disconnect();
        }
      },
      { rootMargin: "-60px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {/* Section header */}
      <div
        style={{
          opacity: headerRevealed ? 1 : 0,
          transform: headerRevealed ? "none" : "translateY(20px)",
          transition: headerRevealed
            ? "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)"
            : "none",
        }}
      >
        <p className="text-[10px] tracking-[0.3em] text-[var(--color-subtle)]">CHALLENGES</p>
        <h2 className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2.2rem]">
          企業經營的真實挑戰
        </h2>
      </div>

      {/* Cards */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {items.map((p, i) => (
          <div
            key={p.title}
            className="rounded-[var(--radius-card)] bg-[var(--color-surface)] p-8 md:p-10"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "none" : "translateY(40px)",
              transition: revealed
                ? `opacity 0.6s cubic-bezier(0.23,1,0.32,1) ${i * 0.12}s, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${i * 0.12}s`
                : "none",
            }}
          >
            <h3 className="font-serif text-[1.1rem] font-semibold text-[var(--color-fg)]">
              {p.title}
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-body)]">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
