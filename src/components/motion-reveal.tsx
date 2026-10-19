"use client";

import { type ReactNode, useRef, useEffect, useState } from "react";
import { shouldAnimate } from "@/lib/motion";

type MotionType =
  | "mask-reveal"     // M-01: clip-path 從左到右擦出
  | "fade-up"         // M-02/M-03: opacity + translateY
  | "fade-left"       // M-08: opacity + translateX
  | "scale-up"        // M-07: scale + opacity
  | "gold-line"       // M-10: 金色頂線擦出
  | "tension-bg";     // M-09: 背景漸變

interface MotionRevealProps {
  children: ReactNode;
  type?: MotionType;
  delay?: number;
  duration?: number;
  className?: string;
  trigger?: "scroll" | "load";
  as?: "div" | "span" | "p";
}

const MOTION_STYLES: Record<MotionType, { hidden: React.CSSProperties; visible: React.CSSProperties }> = {
  "mask-reveal": {
    hidden: { clipPath: "inset(0 100% 0 0)", opacity: 1 },
    visible: { clipPath: "inset(0 0% 0 0)", opacity: 1 },
  },
  "fade-up": {
    hidden: { opacity: 0, transform: "translateY(16px)" },
    visible: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-left": {
    hidden: { opacity: 0, transform: "translateX(-10px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  "scale-up": {
    hidden: { opacity: 0, transform: "scale(0.85)" },
    visible: { opacity: 1, transform: "scale(1)" },
  },
  "gold-line": {
    hidden: { width: "0%" },
    visible: { width: "100%" },
  },
  "tension-bg": {
    hidden: { backgroundColor: "transparent" },
    visible: { backgroundColor: "rgba(0,0,0,0.02)" },
  },
};

const EASING: Record<MotionType, string> = {
  "mask-reveal": "cubic-bezier(0.77, 0, 0.175, 1)",
  "fade-up": "cubic-bezier(0.23, 1, 0.32, 1)",
  "fade-left": "cubic-bezier(0.23, 1, 0.32, 1)",
  "scale-up": "cubic-bezier(0.23, 1, 0.32, 1)",
  "gold-line": "cubic-bezier(0.23, 1, 0.32, 1)",
  "tension-bg": "ease",
};

export function MotionReveal({
  children,
  type = "fade-up",
  delay = 0,
  duration,
  className,
  trigger = "scroll",
  as: Tag = "div",
}: MotionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  const dur = duration || (type === "mask-reveal" ? 1200 : type === "gold-line" ? 800 : 700);

  useEffect(() => {
    if (!shouldAnimate()) {
      setActive(true);
      setReady(true);
      return;
    }

    setReady(true);

    if (trigger === "load") {
      const timer = setTimeout(() => setActive(true), delay * 1000);
      return () => clearTimeout(timer);
    }

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      const timer = setTimeout(() => setActive(true), delay * 1000);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setActive(true), delay * 1000);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, trigger]);

  const styles = MOTION_STYLES[type];
  const currentStyle = !ready
    ? styles.visible
    : active
      ? { ...styles.visible, transition: `all ${dur}ms ${EASING[type]}` }
      : styles.hidden;

  return (
    <Tag ref={ref as never} className={className} style={currentStyle}>
      {children}
    </Tag>
  );
}
