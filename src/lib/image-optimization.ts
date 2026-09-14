import sharp from "sharp";

export type ImageUsage = "cover" | "content";

const MAX_INPUT_PIXELS = 40_000_000;
const MAX_WIDTH: Record<ImageUsage, number> = {
  cover: 1200,
  content: 1600,
};

export type OptimizedImage = {
  bytes: Uint8Array;
  contentType: "image/webp";
  extension: "webp";
  originalWidth: number;
  originalHeight: number;
  optimizedWidth: number;
  optimizedHeight: number;
  originalBytes: number;
  optimizedBytes: number;
};

/**
 * 將管理員上傳的圖片轉成網站版。只縮小、不放大、不裁切，並移除 EXIF 等非必要資料。
 * 40MP 上限可避免超大解壓縮圖片耗盡 Serverless 記憶體。
 */
export async function optimizeImageForWeb(input: Uint8Array, usage: ImageUsage): Promise<OptimizedImage> {
  const pipeline = sharp(input, {
    autoOrient: true,
    failOn: "warning",
    limitInputPixels: MAX_INPUT_PIXELS,
  });
  const metadata = await pipeline.metadata();

  if (!metadata.autoOrient.width || !metadata.autoOrient.height) {
    throw new Error("IMAGE_DIMENSIONS_UNAVAILABLE");
  }
  if ((metadata.pages || 1) > 1) {
    throw new Error("ANIMATED_IMAGE_UNSUPPORTED");
  }

  const { data, info } = await pipeline
    .resize({ width: MAX_WIDTH[usage], withoutEnlargement: true, fit: "inside" })
    .webp({
      quality: metadata.format === "png" ? 86 : 82,
      alphaQuality: 90,
      effort: 4,
      nearLossless: metadata.format === "png",
      smartSubsample: true,
    })
    .toBuffer({ resolveWithObject: true });

  return {
    bytes: data,
    contentType: "image/webp",
    extension: "webp",
    originalWidth: metadata.autoOrient.width,
    originalHeight: metadata.autoOrient.height,
    optimizedWidth: info.width,
    optimizedHeight: info.height,
    originalBytes: input.byteLength,
    optimizedBytes: info.size,
  };
}

export function parseImageUsage(value: FormDataEntryValue | null): ImageUsage | null {
  return value === "cover" || value === "content" ? value : null;
}
