"use client";

import { useState, useEffect } from "react";

export function LogoMotion() {
  const [phase, setPhase] = useState<"idle" | "reveal" | "done">("idle");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      const id = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(id);
    }
    const revealId = setTimeout(() => setPhase("reveal"), 16);
    const doneId = setTimeout(() => setPhase("done"), 1600);
    return () => { clearTimeout(revealId); clearTimeout(doneId); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-warm-white, #FDFCFA)",
        opacity: phase === "reveal" ? 1 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "12px",
          opacity: phase === "reveal" ? 1 : 0,
          transform: phase === "reveal" ? "translateY(0)" : "translateY(8px)",
          transition:
            "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-noto-serif-tc), serif",
            fontSize: "2.4rem",
            fontWeight: 600,
            color: "var(--color-fg, #1A1A1A)",
            letterSpacing: "0.05em",
          }}
        >
          華翼
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.3em",
            color: "var(--color-subtle, #999)",
          }}
        >
          HUAYI
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "40%",
          left: "50%",
          transform: "translateX(-50%)",
          width: phase === "reveal" ? "40px" : "0px",
          height: "2px",
          background: "var(--color-gold, #FFBF00)",
          transition: "width 0.8s cubic-bezier(0.23,1,0.32,1) 0.3s",
        }}
      />
    </div>
  );
}
