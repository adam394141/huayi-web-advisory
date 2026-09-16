import { test } from "node:test";
import assert from "node:assert/strict";
import { getBearer, isAdminId, parseCmsListFilters, parseCollection, parseMediaListFilters } from "../src/lib/admin-policy";

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
test("內容列表只接受白名單篩選與排序", () => {
  assert.deepEqual(parseCmsListFilters(new URLSearchParams("q=品牌&category=設計專案&status=published&sort=updated")), {
    query: "品牌", category: "設計專案", status: "published", sort: "updated",
  });
  assert.deepEqual(parseCmsListFilters(new URLSearchParams()), { query: "", category: "", status: "", sort: "site" });
  assert.equal(parseCmsListFilters(new URLSearchParams("status=deleted")), null);
  assert.equal(parseCmsListFilters(new URLSearchParams("sort=drop-table")), null);
  assert.equal(parseCmsListFilters(new URLSearchParams(`q=${"a".repeat(101)}`)), null);
});

test("媒體庫只接受安全的搜尋、類型、使用狀態與頁碼", () => {
  assert.deepEqual(parseMediaListFilters(new URLSearchParams("q=高大&collection=works&usage=cover&page=2")), {
    query: "高大", collection: "works", usage: "cover", page: 2,
  });
  assert.deepEqual(parseMediaListFilters(new URLSearchParams()), { query: "", collection: "", usage: "", page: 0 });
  assert.equal(parseMediaListFilters(new URLSearchParams("collection=users")), null);
  assert.equal(parseMediaListFilters(new URLSearchParams("usage=delete")), null);
  assert.equal(parseMediaListFilters(new URLSearchParams("page=-1")), null);
  assert.equal(parseMediaListFilters(new URLSearchParams(`q=${"a".repeat(101)}`)), null);
});
