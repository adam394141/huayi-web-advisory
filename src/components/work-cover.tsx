import Image from "next/image";

/** 圖片與文字同寬；同列圖片區伸展並靠底對齊，不裁切、不加底框。 */
export function WorkCover({ src, title }: { src?: string; title: string }) {
  return (
    <div className="w-full overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface)]">
      {src ? (
        <Image
          src={src}
          alt={title}
          width={600}
          height={450}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          quality={82}
          className="aspect-[4/3] w-full object-contain"
        />
      ) : (
        <span className="pb-4 text-sm text-[var(--color-subtle)]">作品圖片待補</span>
      )}
    </div>
  );
}
