import { test } from "node:test";
import assert from "node:assert/strict";
import { getBearer, isAdminId, parseCollection } from "../src/lib/admin-policy";

test("管理員必須是明確設定的 UUID，不接受 email 或未設定狀態", () => {
  const id = "11111111-1111-4111-8111-111111111111";
  assert.equal(isAdminId(id, id), true);
  assert.equal(isAdminId(id, undefined), false);
  assert.equal(isAdminId(id, "22222222-2222-4222-8222-222222222222"), false);
  assert.equal(isAdminId("admin@example.com", "admin@example.com"), false);
});
test("不接受原密碼 Bearer、缺少 token 或超長 token", () => {
  assert.equal(getBearer(null), null);
  assert.equal(getBearer("Bearer password"), null);
  assert.equal(getBearer("Bearer a.b.c"), "a.b.c");
  assert.equal(getBearer(`Bearer ${"a".repeat(8193)}.b.c`), null);
});
test("只能選作品與觀點，不接受任意資料表", () => {
  assert.equal(parseCollection("works"), "works");
  assert.equal(parseCollection("blog_posts"), "blog_posts");
  for (const input of [null, "users", "content_revisions", "works;delete", "ADS"]) assert.equal(parseCollection(input), null);
});
