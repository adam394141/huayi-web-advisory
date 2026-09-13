import Image from "next/image";

/** 透明對齊區只保留列高；圓角套在原比例圖片上，不裁切、不加底框。 */
export function WorkCover({ src, title }: { src?: string; title: string }) {
  return (
    <div className="flex aspect-[4/3] w-full items-end justify-center">
      {src ? (
        <Image
          src={src}
          alt={title}
          width={600}
          height={450}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="block h-auto max-h-full w-auto max-w-full rounded-[var(--radius-card)]"
        />
      ) : (
        <span className="pb-4 text-sm text-[var(--color-subtle)]">作品圖片待補</span>
      )}
    </div>
  );
}
