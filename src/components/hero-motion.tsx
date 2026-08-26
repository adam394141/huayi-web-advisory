"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { shouldAnimate } from "@/lib/motion";

const CAPABILITIES = [
  "BRAND STRATEGY",
  "AI TRANSFORMATION",
  "GROWTH MARKETING",
  "BRAND EXPERIENCE",
];

export function HeroMotion() {
  const [stage, setStage] = useState<"ssr" | "ready" | "animate">("ssr");
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!shouldAnimate()) return;
    const t1 = setTimeout(() => setStage("ready"), 0);
    const t2 = setTimeout(() => setStage("animate"), 50);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const t = (delay: string) =>
    stage === "ssr"
      ? undefined
      : `opacity 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}, clip-path 0.7s cubic-bezier(0.23,1,0.32,1) ${delay}`;

  const vis = stage !== "ready";
  const clipVis = vis ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)";

  return (
    <section ref={ref} className="relative overflow-hidden px-[var(--space-page-x)] pb-0 pt-20 md:pt-28">
      {/* AI node/path background */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ zIndex: 0 }}
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 700"
      >
        <circle cx="1100" cy="120" r="2.5" fill="#CCCCCC" opacity="0.1" />
        <circle cx="1250" cy="280" r="2" fill="#CCCCCC" opacity="0.08" />
        <circle cx="900" cy="400" r="3" fill="#CCCCCC" opacity="0.09" />
        <circle cx="1320" cy="500" r="2" fill="#CCCCCC" opacity="0.1" />
        <circle cx="1050" cy="600" r="2.5" fill="#CCCCCC" opacity="0.08" />
        <circle cx="750" cy="200" r="2" fill="#CCCCCC" opacity="0.07" />
        <line x1="1100" y1="120" x2="1250" y2="280" stroke="#CCCCCC" strokeWidth="1" opacity="0.06" />
        <line x1="1250" y1="280" x2="1320" y2="500" stroke="#CCCCCC" strokeWidth="1" opacity="0.05" />
        <line x1="900" y1="400" x2="1050" y2="600" stroke="#CCCCCC" strokeWidth="1" opacity="0.06" />
        <circle cx="1150" cy="200" r="20" fill="url(#hg1)" style={{ animation: "glow-drift 20s ease-in-out infinite" }} />
        <circle cx="950" cy="500" r="16" fill="url(#hg2)" style={{ animation: "glow-drift 25s ease-in-out infinite reverse" }} />
        <defs>
          <radialGradient id="hg1"><stop offset="0%" stopColor="#FFBF00" stopOpacity="0.08" /><stop offset="100%" stopColor="#FFBF00" stopOpacity="0" /></radialGradient>
          <radialGradient id="hg2"><stop offset="0%" stopColor="#CCCCCC" stopOpacity="0.06" /><stop offset="100%" stopColor="#CCCCCC" stopOpacity="0" /></radialGradient>
        </defs>
      </svg>

      <div className="relative z-10 mx-auto max-w-[1280px]">
        <p
          className="text-[10px] tracking-[0.4em] text-[var(--color-gold-dark)]"
          style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(8px)", transition: t("0.3s") }}
        >
          HUAYI BRAND STRATEGY
        </p>

        <h1 className="mt-6 font-serif text-[2rem] font-semibold leading-[1.5] text-[var(--color-fg)] md:text-[3rem] lg:text-[3.8rem]">
          <span className="block" style={{ clipPath: stage === "ready" ? "inset(0 100% 0 0)" : clipVis, transition: t("0.5s") }}>
            品牌決定企業方向，
          </span>
          <span className="block" style={{ clipPath: stage === "ready" ? "inset(0 100% 0 0)" : clipVis, transition: t("0.8s") }}>
            AI 決定企業速度。
          </span>
        </h1>

        <div
          className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(16px)", transition: t("1.1s") }}
        >
          <div>
            <p className="text-[14px] font-medium tracking-wider text-[var(--color-gold-dark)]">
              診斷 × 定位 × 策略 = 企業差異化資產
            </p>
            <p className="mt-5">
              <Link
                href="/contact"
                className="inline-block rounded-[var(--radius-button)] bg-[var(--color-fg)] px-8 py-3.5 text-[13px] tracking-wider text-white transition-colors hover:bg-[var(--color-gold-dark)]"
              >
                合作洽詢 →
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap gap-6 md:gap-10" style={{ opacity: vis ? 1 : 0, transition: t("1.3s") }}>
            {CAPABILITIES.map((cap) => (
              <span key={cap} className="text-[10px] tracking-[0.2em] text-[var(--color-faint)]">
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
