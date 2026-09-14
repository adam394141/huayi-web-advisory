const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export type AcceptedImage = { extension: "jpg" | "png" | "webp"; contentType: string };

export function detectAcceptedImage(bytes: Uint8Array, declaredType: string, size: number): AcceptedImage | null {
  if (size <= 0 || size > MAX_IMAGE_BYTES || bytes.length < 12) return null;
  const jpg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a;
  const webp = String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (jpg && declaredType === "image/jpeg") return { extension: "jpg", contentType: "image/jpeg" };
  if (png && declaredType === "image/png") return { extension: "png", contentType: "image/png" };
  if (webp && declaredType === "image/webp") return { extension: "webp", contentType: "image/webp" };
  return null;
}

export function validAssetContext(collection: unknown, itemId: unknown) {
  return (collection === "works" || collection === "blog_posts") &&
    typeof itemId === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(itemId);
}

export const IMAGE_UPLOAD_LIMIT = MAX_IMAGE_BYTES;
