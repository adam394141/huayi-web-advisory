import Image from "next/image";

/** 固定 4:3 容器，object-contain 完整顯示，不裁切、不加底框。 */
export function WorkCover({ src, title }: { src?: string; title: string }) {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)]">
      {src ? (
        <Image
          src={src}
          alt={title}
          width={1200}
          height={900}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          quality={82}
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="text-sm text-[var(--color-subtle)]">作品圖片待補</span>
        </div>
      )}
    </div>
  );
}
