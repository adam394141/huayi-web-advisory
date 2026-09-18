import test from "node:test";
import assert from "node:assert/strict";
import { getAdminPreview } from "../src/lib/admin-preview";

test("只有已發布且網址有效的內容能開啟公開前台", () => {
  assert.deepEqual(getAdminPreview("works", "published", "fangyun-chilu-home"), {
    href: "/works/fangyun-chilu-home",
    reason: null,
  });
  assert.deepEqual(getAdminPreview("blog_posts", "published", "brand-strategy"), {
    href: "/blog/brand-strategy",
    reason: null,
  });
});

test("封存或中文網址不再產生 404 預覽連結", () => {
  assert.equal(getAdminPreview("works", "archived", "芳雲夫人牛肉麵").href, null);
  assert.match(getAdminPreview("works", "archived", "芳雲夫人牛肉麵").reason || "", /封存/);
  assert.match(getAdminPreview("works", "archived", "芳雲夫人牛肉麵").reason || "", /英文網址/);
  assert.equal(getAdminPreview("works", "published", "芳雲夫人牛肉麵").href, null);
  assert.match(getAdminPreview("works", "published", "芳雲夫人牛肉麵").reason || "", /英文網址/);
});
