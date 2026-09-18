import assert from "node:assert/strict";
import test from "node:test";
import { mediaAltFromFileName } from "../src/lib/media-selection";

test("媒體檔名可轉為可讀的替代文字", () => {
  assert.equal(mediaAltFromFileName("gao-da_farm-cover.webp"), "gao da farm cover");
  assert.equal(mediaAltFromFileName("%E9%AB%98%E5%A4%A7%E7%89%A7%E5%A0%B4.webp"), "高大牧場");
});

test("無有效檔名時使用安全預設替代文字", () => {
  assert.equal(mediaAltFromFileName(".webp"), "文章圖片");
});

