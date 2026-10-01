'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'

export function PhotoGallery({ photos }: { photos: string[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const close = useCallback(() => setLightbox(null), [])
  const prev = useCallback(
    () => setLightbox((i) => (i !== null && i > 0 ? i - 1 : photos.length - 1)),
    [photos.length],
  )
  const next = useCallback(
    () => setLightbox((i) => (i !== null && i < photos.length - 1 ? i + 1 : 0)),
    [photos.length],
  )

  useEffect(() => {
    if (lightbox === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, close, prev, next])

  return (
    <>
      <div className="columns-1 gap-3 sm:columns-2 md:columns-3 lg:columns-4">
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setLightbox(i)}
            className="mb-3 block w-full overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-adam-gold"
          >
            <Image
              src={src}
              alt={`Adam 授課現場 ${i + 1}`}
              width={600}
              height={400}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="照片放大檢視"
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-4 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-adam-gold"
            aria-label="上一張"
          >
            ‹
          </button>

          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[lightbox]}
              alt={`Adam 授課現場 ${lightbox + 1}`}
              width={1200}
              height={800}
              sizes="90vw"
              className="max-h-[90vh] w-auto rounded-lg object-contain"
              priority
            />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-4 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-adam-gold"
            aria-label="下一張"
          >
            ›
          </button>

          <button
            onClick={close}
            className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-adam-gold"
            aria-label="關閉"
          >
            ✕
          </button>

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[14px] text-white/50">
            {lightbox + 1} / {photos.length}
          </p>
        </div>
      )}
    </>
  )
}
