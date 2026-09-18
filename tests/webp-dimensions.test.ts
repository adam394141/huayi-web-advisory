import test from "node:test";
import assert from "node:assert/strict";
import { fetchWebpDimensions, parseWebpDimensions } from "../src/lib/webp-dimensions";

function header(chunk: "VP8X" | "VP8L" | "VP8 ") {
  const bytes = new Uint8Array(32);
  bytes.set(Buffer.from("RIFF"), 0);
  bytes.set(Buffer.from("WEBP"), 8);
  bytes.set(Buffer.from(chunk), 12);
  return bytes;
}

test("解析 VP8X WebP 的實際像素", () => {
  const bytes = header("VP8X");
  const width = 1200 - 1;
  const height = 900 - 1;
  bytes.set([width & 255, (width >>> 8) & 255, (width >>> 16) & 255], 24);
  bytes.set([height & 255, (height >>> 8) & 255, (height >>> 16) & 255], 27);
  assert.deepEqual(parseWebpDimensions(bytes), { width: 1200, height: 900 });
});

test("解析 VP8L WebP 的實際像素", () => {
  const bytes = header("VP8L");
  const bits = ((800 - 1) | ((600 - 1) << 14)) >>> 0;
  bytes[20] = 0x2f;
  bytes.set([bits & 255, (bits >>> 8) & 255, (bits >>> 16) & 255, (bits >>> 24) & 255], 21);
  assert.deepEqual(parseWebpDimensions(bytes), { width: 800, height: 600 });
});

test("拒絕不是 WebP 或不支援的檔頭", () => {
  assert.equal(parseWebpDimensions(new Uint8Array(32)), null);
});

test("Content-Range 未開放給瀏覽器時仍可解析 206 回應", async () => {
  const bytes = header("VP8X");
  const width = 1600 - 1;
  const height = 1200 - 1;
  bytes.set([width & 255, (width >>> 8) & 255, (width >>> 16) & 255], 24);
  bytes.set([height & 255, (height >>> 8) & 255, (height >>> 16) & 255], 27);

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(bytes, { status: 206 });
  try {
    assert.deepEqual(await fetchWebpDimensions("https://example.com/image.webp"), {
      width: 1600,
      height: 1200,
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
