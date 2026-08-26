"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Compass, Bot, TrendingUp, Palette } from "lucide-react";
import { shouldAnimate } from "@/lib/motion";

const ICON_MAP: Record<string, React.ElementType> = { Compass, Bot, TrendingUp, Palette };

interface ServiceItem {
  num: string;
  iconName: string;
  title: string;
  desc: string;
  href: string;
  deliverables: string[];
}

interface ServicesMotionProps {
  services: ServiceItem[];
}

export function ServicesMotion({ services }: ServicesMotionProps) {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(true);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animate = shouldAnimate();
    const isMobile = window.innerWidth < 768;

    if (animate && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.top >= window.innerHeight + 60) {
        setRevealed(false);
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setRevealed(true);
              obs.disconnect();
            }
          },
          { rootMargin: "-60px" },
        );
        obs.observe(containerRef.current);
      }
    }

    if (isMobile) return;

    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div ref={containerRef}>
      {/* Header */}
      <div
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "none" : "translateY(20px)",
          transition: revealed
            ? "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)"
            : "none",
        }}
      >
        <p className="text-[10px] tracking-[0.3em] text-[var(--color-subtle)]">SERVICES</p>
        <h2 className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2.2rem]">
          四大服務
        </h2>
      </div>

      {/* Desktop: sticky sidebar + scrolling content */}
      <div className="mt-12 hidden gap-12 md:flex">
        {/* Left sidebar */}
        <div className="w-[260px] shrink-0">
          <div className="sticky top-[100px] space-y-1">
            {services.map((s, i) => (
              <button
                key={s.num}
                onClick={() => {
                  sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-300"
                style={{
                  borderLeft: active === i ? "3px solid var(--color-gold)" : "3px solid transparent",
                  color: active === i ? "var(--color-fg)" : "var(--color-subtle)",
                  background: active === i ? "var(--color-surface)" : "transparent",
                }}
              >
                <span className="text-[13px] font-medium tabular-nums text-[var(--color-faint)]">
                  {s.num}
                </span>
                <span className="text-[14px] font-medium">{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right content */}
        <div className="min-w-0 flex-1 space-y-24">
          {services.map((s, i) => (
            <div
              key={s.num}
              ref={(el) => { sectionRefs.current[i] = el; }}
              className="rounded-[var(--radius-card)] border border-[var(--color-faint)]/20 p-10"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "none" : "translateY(30px)",
                transition: revealed
                  ? `opacity 0.6s cubic-bezier(0.23,1,0.32,1) ${i * 0.1 + 0.2}s, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${i * 0.1 + 0.2}s`
                  : "none",
              }}
            >
              <div className="flex items-start gap-4">
                <span className="text-[2.4rem] font-light leading-none text-[var(--color-faint)]/30">
                  {s.num}
                </span>
                {(() => { const Icon = ICON_MAP[s.iconName]; return Icon ? <Icon className="mt-2 h-7 w-7 text-[var(--color-gold-dark)]" strokeWidth={1.5} /> : null; })()}
              </div>
              <h3 className="mt-6 font-serif text-[1.4rem] font-semibold text-[var(--color-fg)]">
                {s.title}
              </h3>
              <p className="mt-4 text-[14px] leading-[1.9] text-[var(--color-body)]">{s.desc}</p>
              <div className="mt-8 rounded-[var(--radius-card)] bg-[var(--color-surface)] p-6">
                <p className="text-[11px] tracking-[0.15em] text-[var(--color-subtle)]">主要交付項目</p>
                <ul className="mt-4 space-y-2.5">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-[14px] text-[var(--color-body)]">
                      <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold)]" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={s.href}
                className="mt-6 inline-block text-[12px] tracking-wider text-[var(--color-fg)] transition-colors hover:text-[var(--color-gold-dark)]"
              >
                了解更多 →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="mt-12 space-y-6 md:hidden">
        {services.map((s, i) => (
          <MobileCard key={s.num} service={s} index={i} />
        ))}
      </div>
    </div>
  );
}

function MobileCard({ service: s, index }: { service: ServicesMotionProps["services"][number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(true);

  useEffect(() => {
    if (!shouldAnimate()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 60) return;
    setVis(false);
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); obs.disconnect(); } },
      { rootMargin: "-40px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-[var(--radius-card)] bg-[var(--color-warm-white)] p-8"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(24px)",
        transition: vis
          ? `opacity 0.6s cubic-bezier(0.23,1,0.32,1) ${index * 0.06}s, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${index * 0.06}s`
          : "none",
      }}
    >
      {(() => { const Icon = ICON_MAP[s.iconName]; return Icon ? <Icon className="h-7 w-7 text-[var(--color-gold-dark)]" strokeWidth={1.5} /> : null; })()}
      <h3 className="mt-5 font-serif text-[1.1rem] font-semibold text-[var(--color-fg)]">{s.title}</h3>
      <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-body)]">{s.desc}</p>
      <ul className="mt-5 space-y-2">
        {s.deliverables.map((d) => (
          <li key={d} className="flex items-start gap-2 text-[13px] text-[var(--color-body)]">
            <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-[var(--color-gold)]" />
            {d}
          </li>
        ))}
      </ul>
      <Link
        href={s.href}
        className="mt-5 inline-block text-[12px] tracking-wider text-[var(--color-fg)] transition-colors hover:text-[var(--color-gold-dark)]"
      >
        了解更多 →
      </Link>
    </div>
  );
}
