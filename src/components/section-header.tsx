"use client";

import { type ReactNode, useRef, useEffect, useState } from "react";

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  dark?: boolean;
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({
  label,
  title,
  description,
  dark = false,
  className,
  children,
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 60) {
      setTriggered(true);
      return;
    }

    setVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setTriggered(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-40px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const labelColor = dark ? "var(--color-gold)" : "var(--color-subtle)";
  const titleColor = dark ? "var(--color-ai-text)" : "var(--color-fg)";
  const descColor = dark ? "var(--color-ai-muted)" : "var(--color-body)";

  const show = visible || triggered;

  return (
    <div ref={ref} className={className}>
      <p
        className="text-[10px] tracking-[0.3em]"
        style={{
          color: labelColor,
          opacity: show ? 1 : 0,
          transition: show ? "opacity 0.5s cubic-bezier(0.23,1,0.32,1)" : "none",
        }}
      >
        {label}
      </p>
      <div
        className="mt-2 h-[2px]"
        style={{
          background: "var(--color-gold)",
          width: show ? "40px" : "0px",
          transition: show
            ? "width 0.6s cubic-bezier(0.23,1,0.32,1) 0.1s"
            : "none",
        }}
      />
      <h2
        className="mt-3 font-serif text-[1.6rem] font-semibold md:text-[2.2rem]"
        style={{
          color: titleColor,
          opacity: show ? 1 : 0,
          transform: show ? "none" : "translateY(12px)",
          transition: show
            ? "opacity 0.6s cubic-bezier(0.23,1,0.32,1) 0.2s, transform 0.6s cubic-bezier(0.23,1,0.32,1) 0.2s"
            : "none",
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="mt-4 max-w-[560px] text-[14px] leading-relaxed"
          style={{
            color: descColor,
            opacity: show ? 1 : 0,
            transition: show
              ? "opacity 0.6s cubic-bezier(0.23,1,0.32,1) 0.4s"
              : "none",
          }}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
