"use client";

import { useRef, useEffect, useState } from "react";

interface AiSectionMotionProps {
  items: Array<{ title: string; desc: string }>;
}

const NODES = [
  { cx: "8%", cy: "15%", delay: "0s" },
  { cx: "25%", cy: "70%", delay: "1.2s" },
  { cx: "45%", cy: "25%", delay: "0.6s" },
  { cx: "62%", cy: "80%", delay: "1.8s" },
  { cx: "78%", cy: "35%", delay: "0.4s" },
  { cx: "92%", cy: "60%", delay: "1s" },
  { cx: "35%", cy: "50%", delay: "2s" },
];

const PATHS = [
  "M 8 15 Q 26 40 45 25",
  "M 45 25 Q 60 50 78 35",
  "M 25 70 Q 44 75 62 80",
  "M 78 35 L 92 60",
];

export function AiSectionMotion({ items }: AiSectionMotionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  const [pathActive, setPathActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 60) {
      setPathActive(true);
      return;
    }

    setVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setPathActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-60px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[var(--color-ai-bg)] px-[var(--space-page-x)] py-[var(--space-section-y)]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.3"
            strokeDasharray="4 8"
            strokeDashoffset={pathActive ? 0 : 200}
            style={{
              transition: pathActive
                ? `stroke-dashoffset 2s cubic-bezier(0.23,1,0.32,1) ${i * 0.3}s`
                : "none",
            }}
          />
        ))}
        {NODES.map((n, i) => (
          <circle
            key={i}
            cx={n.cx}
            cy={n.cy}
            r="0.6"
            fill="rgba(255,255,255,0.15)"
            style={{
              animation: pathActive
                ? `node-pulse 3s ease-in-out ${n.delay} infinite`
                : "none",
            }}
          />
        ))}
      </svg>

      <div
        className="pointer-events-none absolute left-[20%] top-[30%] h-2 w-2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,191,0,0.2) 0%, transparent 70%)",
          boxShadow: "0 0 20px 8px rgba(255,191,0,0.08)",
          animation: pathActive ? "glow-drift 8s ease-in-out infinite" : "none",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[25%] right-[15%] h-2 w-2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,191,0,0.15) 0%, transparent 70%)",
          boxShadow: "0 0 16px 6px rgba(255,191,0,0.06)",
          animation: pathActive ? "glow-drift 10s ease-in-out 2s infinite reverse" : "none",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px]">
        <p
          className="text-[10px] tracking-[0.3em] text-[var(--color-gold)]"
          style={{
            opacity: visible ? 1 : 0,
            transition: visible ? "opacity 0.5s cubic-bezier(0.23,1,0.32,1)" : "none",
          }}
        >
          AI INTEGRATION
        </p>
        <div
          className="mt-2 h-[2px]"
          style={{
            background: "var(--color-gold)",
            width: visible ? "40px" : "0px",
            transition: visible ? "width 0.6s cubic-bezier(0.23,1,0.32,1) 0.1s" : "none",
          }}
        />
        <h2
          className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-ai-text)] md:text-[2.2rem]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(12px)",
            transition: visible
              ? "opacity 0.6s cubic-bezier(0.23,1,0.32,1) 0.2s, transform 0.6s cubic-bezier(0.23,1,0.32,1) 0.2s"
              : "none",
          }}
        >
          AI 不只是工具，是策略的一部分
        </h2>
        <p
          className="mt-4 max-w-[560px] text-[14px] leading-relaxed text-[var(--color-ai-muted)]"
          style={{
            opacity: visible ? 1 : 0,
            transition: visible ? "opacity 0.6s cubic-bezier(0.23,1,0.32,1) 0.4s" : "none",
          }}
        >
          我們不賣 AI 工具，而是協助企業找到 AI
          真正能創造價值的切入點，從流程優化到內容產出，讓技術成為品牌成長的加速器。
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="rounded-[var(--radius-card)] border border-[var(--color-ai-accent)] bg-[var(--color-ai-surface)] p-8"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(16px)",
                transition: visible
                  ? `opacity 0.6s cubic-bezier(0.23,1,0.32,1) ${0.5 + i * 0.2}s, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${0.5 + i * 0.2}s`
                  : "none",
              }}
            >
              <div
                className="mb-4 h-px bg-[var(--color-gold)]"
                style={{
                  width: visible ? "32px" : "0px",
                  transition: visible
                    ? `width 0.6s cubic-bezier(0.23,1,0.32,1) ${0.6 + i * 0.2}s`
                    : "none",
                }}
              />
              <h3 className="font-serif text-[1rem] font-semibold text-[var(--color-ai-text)]">
                {item.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ai-muted)]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
