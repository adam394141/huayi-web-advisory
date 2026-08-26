"use client";

import { type ReactNode, useRef, useEffect, useState } from "react";
import { shouldAnimate } from "@/lib/motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!shouldAnimate()) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 60) return;

    setVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-60px" },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transition: visible
          ? `opacity 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}s, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}s`
          : "none",
      }}
    >
      {children}
    </div>
  );
}
