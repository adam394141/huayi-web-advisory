export type ImageDimensions = { width: number; height: number };

function ascii(bytes: Uint8Array, start: number, length: number) {
  return String.fromCharCode(...bytes.slice(start, start + length));
}

function uint24le(bytes: Uint8Array, start: number) {
  return bytes[start] | (bytes[start + 1] << 8) | (bytes[start + 2] << 16);
}

/** 只解析 WebP 檔頭，不需要下載完整圖片。 */
export function parseWebpDimensions(bytes: Uint8Array): ImageDimensions | null {
  if (bytes.length < 30 || ascii(bytes, 0, 4) !== "RIFF" || ascii(bytes, 8, 4) !== "WEBP") return null;
  const chunk = ascii(bytes, 12, 4);
  if (chunk === "VP8X") {
    return { width: uint24le(bytes, 24) + 1, height: uint24le(bytes, 27) + 1 };
  }
  if (chunk === "VP8L" && bytes[20] === 0x2f) {
    const bits = (bytes[21] | (bytes[22] << 8) | (bytes[23] << 16) | (bytes[24] << 24)) >>> 0;
    return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8 " && bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a) {
    return {
      width: (bytes[26] | (bytes[27] << 8)) & 0x3fff,
      height: (bytes[28] | (bytes[29] << 8)) & 0x3fff,
    };
  }
  return null;
}

export async function fetchWebpDimensions(url: string): Promise<ImageDimensions | null> {
  try {
    const response = await fetch(url, { headers: { Range: "bytes=0-31" }, cache: "force-cache" });
    if (response.status !== 206 || !response.headers.get("content-range")?.startsWith("bytes 0-31/")) return null;
    return parseWebpDimensions(new Uint8Array(await response.arrayBuffer()));
  } catch {
    return null;
  }
}
