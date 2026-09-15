import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanContent, safeJsonLd } from "../src/lib/content-safety";

test("圖文保留標題、段落、連結與可信原圖", () => {
  const result = cleanContent('<h2>華翼</h2><p>策略<strong>顧問</strong></p><img src="https://huayi.tw/upload/a.jpg" alt="作品"><a href="https://huayi.tw">連結</a>');
  assert.match(result, /<h2>華翼<\/h2>/);
  assert.match(result, /upload\/a.jpg/);
  assert.match(result, /<strong>顧問<\/strong>/);
});
test("保留後台產生的圖片最佳化資訊", () => {
  const html = '<figure><img src="https://rhkmzcyfzemlobznltyz.supabase.co/storage/v1/object/public/published-assets/cms/a/optimized/x.webp" alt="作品" width="1600" height="900" data-original-width="2400" data-original-height="1350" data-original-bytes="2000000" data-optimized-bytes="320000"><figcaption>說明</figcaption></figure>';
  const result = cleanContent(html);
  assert.match(result, /data-original-width="2400"/);
  assert.match(result, /data-optimized-bytes="320000"/);
  assert.match(result, /loading="lazy"/);
});
test("移除腳本、事件、樣式及嵌入頁面", () => {
  const result = cleanContent('<script>alert(1)</script><p onclick="bad()" style="position:fixed">正常</p><iframe src="https://evil.example"></iframe><svg onload="bad()"></svg><form>test</form>');
  assert.doesNotMatch(result, /script|onclick|style=|iframe|svg|form|alert/);
  assert.match(result, /正常/);
});
test("拒絕 javascript、data、協定相對與外站圖片", () => {
  for (const src of ["javascript:alert(1)", "data:image/svg+xml,bad", "//evil.example/a.png", "https://evil.example/a.png", "https://huayi.tw.evil.example/a.png", "https://huayi.tw@evil.example/a.png"]) {
    assert.doesNotMatch(cleanContent(`<img src="${src}" onerror="bad()">`), /<img/);
  }
  assert.doesNotMatch(cleanContent('<a href="jav&#x61;script:alert(1)">文字</a>'), /href/);
});
test("JSON-LD 不可跳出 script 且資料往返不變", () => {
  const value = { title: '</script><img src=x onerror=alert(1)>\u2028' };
  const output = safeJsonLd(value);
  assert.doesNotMatch(output, /</);
  assert.deepEqual(JSON.parse(output), value);
});
