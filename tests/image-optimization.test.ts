import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { optimizeImageForWeb, parseImageUsage } from "../src/lib/image-optimization";

test("內文圖片縮至最寬 1600 px 且不裁切", async () => {
  const input = await sharp({ create: { width: 2400, height: 1200, channels: 3, background: "#d9a900" } }).jpeg({ quality: 95 }).toBuffer();
  const result = await optimizeImageForWeb(input, "content");
  assert.equal(result.optimizedWidth, 1600);
  assert.equal(result.optimizedHeight, 800);
  assert.equal(result.originalWidth, 2400);
  assert.equal(result.originalHeight, 1200);
  assert.equal(result.contentType, "image/webp");
  assert.equal(String.fromCharCode(...result.bytes.slice(8, 12)), "WEBP");
});

test("封面小圖不放大並保留原比例", async () => {
  const input = await sharp({ create: { width: 800, height: 500, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0 } } }).png().toBuffer();
  const result = await optimizeImageForWeb(input, "cover");
  assert.equal(result.optimizedWidth, 800);
  assert.equal(result.optimizedHeight, 500);
});

test("只接受明確的圖片用途", () => {
  assert.equal(parseImageUsage("cover"), "cover");
  assert.equal(parseImageUsage("content"), "content");
  assert.equal(parseImageUsage("avatar"), null);
  assert.equal(parseImageUsage(null), null);
});
