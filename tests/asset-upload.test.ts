import test from "node:test";
import assert from "node:assert/strict";
import { detectAcceptedImage, validAssetContext } from "../src/lib/asset-upload";

test("只接受真實簽章與相符 MIME 的 JPG、PNG、WebP", () => {
  assert.deepEqual(detectAcceptedImage(new Uint8Array([0xff,0xd8,0xff,0,0,0,0,0,0,0,0,0]), "image/jpeg", 12), { extension: "jpg", contentType: "image/jpeg" });
  assert.deepEqual(detectAcceptedImage(new Uint8Array([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,0,0,0,0]), "image/png", 12), { extension: "png", contentType: "image/png" });
  assert.deepEqual(detectAcceptedImage(new Uint8Array([82,73,70,70,0,0,0,0,87,69,66,80]), "image/webp", 12), { extension: "webp", contentType: "image/webp" });
  assert.equal(detectAcceptedImage(new Uint8Array([0xff,0xd8,0xff,0,0,0,0,0,0,0,0,0]), "text/html", 12), null);
});

test("拒絕超量、空檔及錯誤內容識別", () => {
  const jpg = new Uint8Array([0xff,0xd8,0xff,0,0,0,0,0,0,0,0,0]);
  assert.equal(detectAcceptedImage(jpg, "image/jpeg", 4 * 1024 * 1024 + 1), null);
  assert.equal(detectAcceptedImage(jpg, "image/jpeg", 0), null);
  assert.equal(detectAcceptedImage(new Uint8Array(12), "image/png", 12), null);
});

test("上傳位置只接受兩種內容與 UUID", () => {
  const id = "123e4567-e89b-42d3-a456-426614174000";
  assert.equal(validAssetContext("works", id), true);
  assert.equal(validAssetContext("blog_posts", id), true);
  assert.equal(validAssetContext("users", id), false);
  assert.equal(validAssetContext("works", "../etc"), false);
});
