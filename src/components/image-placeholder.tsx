"use client";

import { useState } from "react";
import Image from "next/image";

interface ImagePlaceholderProps {
  src?: string | null;
  alt: string;
  aspect?: string;
  rounded?: string;
  className?: string;
  contain?: boolean;
  priority?: boolean;
}

export function ImagePlaceholder({
  src,
  alt,
  aspect = "16/9",
  rounded = "var(--radius-card)",
  className = "",
  contain = false,
  priority = false,
}: ImagePlaceholderProps) {
  const [error, setError] = useState(false);
  const isPlaceholder = !src || error;

  if (isPlaceholder) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${className}`}
        style={{
          aspectRatio: aspect,
          borderRadius: rounded,
          background: "linear-gradient(135deg, #F2F0EB 0%, #E8E4DC 50%, #F2F0EB 100%)",
        }}
        role="img"
        aria-label={alt}
      >
        <div className="text-center px-4">
          <div className="mx-auto mb-2 h-8 w-8 rounded-full border-2 border-[var(--color-faint)] opacity-40" />
          <p className="text-[11px] tracking-wider text-[var(--color-subtle)] opacity-60">
            Placeholder
          </p>
          <p className="mt-1 max-w-[200px] text-[10px] leading-relaxed text-[var(--color-faint)]">
            {alt}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: aspect, borderRadius: rounded }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={contain ? "object-contain" : "object-cover"}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
        priority={priority}
        onError={() => setError(true)}
      />
    </div>
  );
}
