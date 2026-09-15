import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCmsCreate, parseCmsPublishRequest, parseCmsUpdate } from "../src/lib/cms-update";
import { mapCmsSaveError } from "../src/lib/cms-save-error";

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

test("保留資料庫時間的微秒精度以避免誤判版本衝突", () => {
  const expectedUpdatedAt = "2026-09-15T07:41:14.123456+00:00";
  const parsed = parseCmsUpdate({
    collection: "blog_posts",
    id: "11111111-1111-4111-8111-111111111111",
    expected_updated_at: expectedUpdatedAt,
    changes: { title: "更新標題" },
  });
  assert.equal(parsed?.expectedUpdatedAt, expectedUpdatedAt);
});

test("發布請求保留資料庫時間的微秒精度", () => {
  const expectedUpdatedAt = "2026-09-15T07:41:14.123456+00:00";
  assert.equal(parseCmsPublishRequest({ expected_updated_at: expectedUpdatedAt })?.expectedUpdatedAt, expectedUpdatedAt);
  assert.equal(parseCmsPublishRequest({ expected_updated_at: "無效時間" }), null);
});

test("拒絕錯誤狀態、網址、版本與超量內容", () => {
  assert.equal(parseCmsUpdate({ ...base, changes: { status: "deleted" } }), null);
  assert.equal(parseCmsUpdate({ ...base, changes: { cover_image: "https://evil.example/x.jpg" } }), null);
  assert.equal(parseCmsUpdate({ ...base, expected_updated_at: "bad", changes: { title: "作品" } }), null);
  assert.equal(parseCmsUpdate({ ...base, changes: { content: "x".repeat(200_001) } }), null);
});

test("允許新增作品或觀點草稿，且欄位彼此分離、網址必須安全", () => {
  assert.deepEqual(parseCmsCreate({ collection:"blog_posts", title:"新文章", slug:"new-article", category:"品牌觀點", author:"華翼" }), {
    collection:"blog_posts", title:"新文章", slug:"new-article", category:"品牌觀點", author:"華翼",
  });
  assert.deepEqual(parseCmsCreate({ collection:"works", title:"作品", slug:"work", category:"設計專案", client:"客戶" }), {
    collection:"works", title:"作品", slug:"work", category:"設計專案", client:"客戶",
  });
  assert.equal(parseCmsCreate({ collection:"works", title:"作品", slug:"work", category:"設計", client:"x".repeat(181) }), null);
  assert.equal(parseCmsCreate({ collection:"blog_posts", title:"文章", slug:"中文", category:"觀點" }), null);
});

test("儲存錯誤可區分鎖定、逾時、衝突與未知錯誤", () => {
  assert.deepEqual(mapCmsSaveError({ code: "55P03" }), {
    message: "這筆內容正被另一個儲存操作占用，請稍候再試。", status: 423, kind: "locked",
  });
  assert.equal(mapCmsSaveError({ code: "57014" }).kind, "timeout");
  assert.equal(mapCmsSaveError({ message: "AbortError: request aborted" }).kind, "timeout");
  assert.equal(mapCmsSaveError({ code: "PT409", message: "CMS_CONFLICT" }).kind, "conflict");
  assert.equal(mapCmsSaveError({ code: "40001" }).kind, "conflict");
  assert.equal(mapCmsSaveError({ code: "23505" }).kind, "duplicate");
  assert.equal(mapCmsSaveError({ code: "XX000" }).kind, "unknown");
});
