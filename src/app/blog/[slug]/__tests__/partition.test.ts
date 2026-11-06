import { partitionContent } from "../partition-content";

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`FAIL: ${msg}`);
  console.log(`  PASS: ${msg}`);
}

console.log("=== partitionContent tests (imports production module) ===");

// 1. CTA before sources
const r1 = partitionContent("<p>Main</p><h2>你的企業</h2><p>CTA</p><h3>參考資料</h3><p>Src</p>");
assert(r1.intro === "<p>Main</p>", "CTA前sources: intro只有正文");
assert(r1.ctaContent.includes("你的企業"), "CTA前sources: CTA包含標題");
assert(r1.sourcesContent.includes("參考資料"), "CTA前sources: sources包含標題");
assert(!r1.intro.includes("參考資料"), "CTA前sources: intro不包含sources");

// 2. Sources before CTA
const r2 = partitionContent("<p>Main</p><h3>參考資料</h3><p>Src</p><h2>你的企業</h2><p>CTA</p>");
assert(r2.intro === "<p>Main</p>", "Sources前CTA: intro只有正文");
assert(r2.sourcesContent.includes("參考資料"), "Sources前CTA: sources正確");
assert(r2.ctaContent.includes("你的企業"), "Sources前CTA: CTA正確");

// 3. Only CTA
const r3 = partitionContent("<p>Main</p><h2>你的企業</h2><p>CTA only</p>");
assert(r3.intro === "<p>Main</p>", "僅CTA: intro正確");
assert(r3.ctaContent.includes("你的企業"), "僅CTA: CTA正確");
assert(r3.sourcesContent === "", "僅CTA: 無sources");

// 4. Only sources
const r4 = partitionContent("<p>Main</p><h3>參考資料</h3><p>Src only</p>");
assert(r4.intro === "<p>Main</p>", "僅sources: intro正確");
assert(r4.ctaContent === "", "僅sources: 無CTA");
assert(r4.sourcesContent.includes("參考資料"), "僅sources: sources正確");

// 5. Neither
const r5 = partitionContent("<p>Just content</p>");
assert(r5.intro === "<p>Just content</p>", "無特殊區塊: 全部保留在intro");
assert(r5.ctaContent === "", "無特殊區塊: 無CTA");
assert(r5.sourcesContent === "", "無特殊區塊: 無sources");

// 6. H2 sections generate navigation
const r6 = partitionContent("<p>Intro</p><h2>Section A</h2><p>A</p><h2>Section B</h2><p>B</p>");
assert(r6.sections.length === 2, "H2: 2個section");
assert(r6.sections[0] === "Section A", "H2: 第一個section名稱");
assert(r6.firstChapter.includes("Section A"), "H2: firstChapter含第一章");
assert(r6.laterChapters.includes("Section B"), "H2: laterChapters含第二章");

// 7. No H2
const r7 = partitionContent("<p>No headings here</p>");
assert(r7.sections.length === 0, "無H2: sections為空");
assert(r7.firstChapter === "", "無H2: firstChapter為空");

console.log("\nAll 19 assertions passed.");
