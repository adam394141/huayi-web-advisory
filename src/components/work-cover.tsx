/** 固定 4:3 容器，object-cover 統一填滿，不加底框。 */
export function WorkCover({ src, title }: { src?: string; title: string }) {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)]">
      {src ? (
        <img
          src={src}
          alt={title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="text-sm text-[var(--color-subtle)]">作品圖片待補</span>
        </div>
      )}
    </div>
  );
}
