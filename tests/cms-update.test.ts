import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCmsUpdate } from "../src/lib/cms-update";

const base = { collection: "works", id: "11111111-1111-4111-8111-111111111111", expected_updated_at: "2026-09-14T00:00:00Z" };

test("作品更新只接受明列欄位並清洗內容", () => {
  const value = parseCmsUpdate({ ...base, changes: { title: " 測試作品 ", content: '<p>保留</p><script>alert(1)</script>', show_on_homepage: true, sort_order: 2 } });
  assert.equal(value?.changes.title, "測試作品");
  assert.equal(value?.changes.content, "<p>保留</p>");
  assert.equal(value?.changes.show_on_homepage, true);
  assert.equal(value?.changes.sort_order, 2);
  assert.equal(parseCmsUpdate({ ...base, changes: { service_role: "x" } }), null);
});

test("作品與觀點欄位保持分離", () => {
  assert.equal(parseCmsUpdate({ ...base, changes: { author: "Adam" } }), null);
  assert.ok(parseCmsUpdate({ ...base, collection: "blog_posts", changes: { author: "Adam", excerpt: "摘要" } }));
  assert.equal(parseCmsUpdate({ ...base, collection: "blog_posts", changes: { client: "客戶" } }), null);
});

test("拒絕錯誤狀態、網址、版本與超量內容", () => {
  assert.equal(parseCmsUpdate({ ...base, changes: { status: "deleted" } }), null);
  assert.equal(parseCmsUpdate({ ...base, changes: { cover_image: "https://evil.example/x.jpg" } }), null);
  assert.equal(parseCmsUpdate({ ...base, expected_updated_at: "bad", changes: { title: "作品" } }), null);
  assert.equal(parseCmsUpdate({ ...base, changes: { content: "x".repeat(200_001) } }), null);
});
