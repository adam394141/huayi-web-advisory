"use client";

import { useState, useEffect } from "react";

const SESSION_KEY = "huayi-logo-played";

export function LogoMotion() {
  const [phase, setPhase] = useState<"idle" | "reveal" | "fade" | "done">("idle");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(id);
    }

    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        const id = setTimeout(() => setPhase("done"), 0);
        return () => clearTimeout(id);
      }
    } catch { /* SSR or private browsing */ }

    const t1 = setTimeout(() => setPhase("reveal"), 50);
    const t2 = setTimeout(() => setPhase("fade"), 900);
    const t3 = setTimeout(() => {
      setPhase("done");
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* */ }
    }, 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
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
        background: "#FDFCFA",
        opacity: phase === "fade" ? 0 : 1,
        transition: "opacity 0.3s ease",
        pointerEvents: "none",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: "10px",
            opacity: phase === "reveal" || phase === "fade" ? 1 : 0,
            transform: phase === "reveal" || phase === "fade" ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.5s cubic-bezier(0.23,1,0.32,1), transform 0.5s cubic-bezier(0.23,1,0.32,1)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-noto-serif-tc, serif)",
              fontSize: "2.2rem",
              fontWeight: 600,
              color: "#1A1A1A",
              letterSpacing: "0.05em",
            }}
          >
            華翼
          </span>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "#999" }}>
            HUAYI
          </span>
        </div>
        <div
          style={{
            margin: "12px auto 0",
            height: "2px",
            background: "#FFBF00",
            width: phase === "reveal" || phase === "fade" ? "36px" : "0px",
            transition: "width 0.6s cubic-bezier(0.23,1,0.32,1) 0.2s",
          }}
        />
      </div>
    </div>
  );
}
