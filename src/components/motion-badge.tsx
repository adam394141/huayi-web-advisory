"use client";

import { useState, useEffect } from "react";
import { isForceMode } from "@/lib/motion";

export function MotionBadge() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShow(isForceMode()), 0);
    return () => clearTimeout(id);
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 9000,
        padding: "6px 14px",
        borderRadius: "9999px",
        background: "rgba(26,26,26,0.8)",
        color: "#FFBF00",
        fontSize: "11px",
        letterSpacing: "0.1em",
        fontWeight: 500,
        pointerEvents: "none",
        backdropFilter: "blur(8px)",
      }}
    >
      Motion Preview
    </div>
  );
}
