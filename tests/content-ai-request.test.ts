import test from "node:test";
import assert from "node:assert/strict";
import { isUuid, parseAiApplyRequest, parseAiStartRequest } from "../src/lib/content-ai/request";

const id = "11111111-1111-4111-8111-111111111111";
test("AI 任務只接受 UUID、有效版本與有限素材", () => {
  assert.ok(parseAiStartRequest({ article_id:id, expected_updated_at:"2026-09-15T00:00:00Z", source_material:"素材" }));
  assert.equal(parseAiStartRequest({ article_id:"bad", expected_updated_at:"now", source_material:"素材" }), null);
  assert.equal(parseAiStartRequest({ article_id:id, expected_updated_at:"2026-09-15T00:00:00Z", source_material:"a".repeat(50_001) }), null);
  assert.equal(isUuid(id), true);
});

test("AI 任務保留資料庫時間的微秒精度", () => {
  const expectedUpdatedAt = "2026-09-15T07:41:14.123456+00:00";
  const parsed = parseAiStartRequest({ article_id:id, expected_updated_at:expectedUpdatedAt, source_material:"素材" });
  assert.equal(parsed?.expectedUpdatedAt, expectedUpdatedAt);
});

test("套用結果只接受白名單欄位並去除重複", () => {
  const parsed = parseAiApplyRequest({ expected_updated_at:"2026-09-15T00:00:00Z", fields:["title","title","faq"], confirm_blockers:true });
  assert.deepEqual(parsed?.fields, ["title","faq"]);
  assert.equal(parsed?.confirmBlockers, true);
  assert.equal(parseAiApplyRequest({ expected_updated_at:"2026-09-15T00:00:00Z", fields:["status"] }), null);
  assert.equal(parseAiApplyRequest({ expected_updated_at:"2026-09-15T00:00:00Z", fields:[] }), null);
});
