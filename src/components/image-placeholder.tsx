"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ImagePlaceholderProps {
  src?: string | null;
  alt: string;
  aspect?: string;
  rounded?: string;
  className?: string;
  contain?: boolean;
  priority?: boolean;
  caption?: string;
}

export function ImagePlaceholder({
  src,
  alt,
  aspect = "16/9",
  rounded = "var(--radius-card)",
  className = "",
  contain = false,
  priority = false,
  caption,
}: ImagePlaceholderProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const [originalSource, setOriginalSource] = useState<string | null>(null);
  const loaded = useRef(false);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    loaded.current = false;
    if (!src || !imageRef.current) return;
    let timeout: ReturnType<typeof setTimeout>;
    // 最佳化端點逾時時回退原圖；保留原始素材，不讓圖片永遠停在空框。
    const start = () => {
      timeout = setTimeout(() => {
        if (!loaded.current && !imageRef.current?.naturalWidth) setOriginalSource(src);
      }, 5000);
    };
    if (!("IntersectionObserver" in window)) { start(); return () => clearTimeout(timeout); }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { start(); observer.disconnect(); }
    }, { rootMargin: "300px" });
    observer.observe(imageRef.current);
    return () => { clearTimeout(timeout); observer.disconnect(); };
  }, [src]);
  const isPlaceholder = !src || src === failedSource;

  if (isPlaceholder) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${className}`}
        style={{
          aspectRatio: aspect,
          borderRadius: rounded,
          background: "var(--color-surface-alt)",
        }}
        role="img"
        aria-label={alt}
      >
        <div className="text-center px-4">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--color-gold-dark)] font-serif text-3xl text-[var(--color-body)]" aria-hidden="true">
            {alt.includes("Rosie") ? "R" : "HUAYI"}
          </div>
          <p className="text-[14px] tracking-wider text-[var(--color-body)]">
            {src ? "圖片暫時無法載入" : "正式肖像待補"}
          </p>
          <p className="mt-2 max-w-[240px] text-[13px] leading-relaxed text-[var(--color-body)]">
            {alt}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`image-frame relative overflow-hidden ${className}`}
      style={{ aspectRatio: aspect, borderRadius: rounded }}
    >
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill
        className={contain ? "object-contain" : "object-cover"}
        sizes={priority ? "(max-width: 1280px) 100vw, 1280px" : "(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 1280px"}
        priority={priority}
        unoptimized={originalSource === src}
        onLoad={() => { loaded.current = true; }}
        onError={() => {
          if (originalSource !== src) setOriginalSource(src);
          else setFailedSource(src);
        }}
      />
      {caption && <span className="image-caption">{caption}</span>}
    </div>
  );
}
