// @ts-nocheck — lightweight unit test for partitionContent logic
// Run: npx tsx src/app/blog/\[slug\]/__tests__/partition.test.ts

function partitionContent(content: string) {
  const ctaPatterns = ["<h2>你的企業", "<h2>你的餐廳"];
  const sourcesPatterns = ["<h3>參考資料", "<h3>資料來源"];

  let ctaIndex = -1;
  for (const p of ctaPatterns) { const i = content.indexOf(p); if (i >= 0 && (ctaIndex < 0 || i < ctaIndex)) ctaIndex = i; }
  let sourcesIndex = -1;
  for (const p of sourcesPatterns) { const i = content.indexOf(p); if (i >= 0 && (sourcesIndex < 0 || i < sourcesIndex)) sourcesIndex = i; }

  const validIndexes = [ctaIndex, sourcesIndex].filter((i) => i >= 0);
  const mainEnd = validIndexes.length > 0 ? Math.min(...validIndexes) : content.length;
  const mainContent = content.slice(0, mainEnd);

  let ctaContent = "";
  let sourcesContent = "";
  if (ctaIndex >= 0 && sourcesIndex >= 0) {
    if (sourcesIndex < ctaIndex) {
      sourcesContent = content.slice(sourcesIndex, ctaIndex);
      ctaContent = content.slice(ctaIndex);
    } else {
      ctaContent = content.slice(ctaIndex, sourcesIndex);
      sourcesContent = content.slice(sourcesIndex);
    }
  } else if (ctaIndex >= 0) {
    ctaContent = content.slice(ctaIndex);
  } else if (sourcesIndex >= 0) {
    sourcesContent = content.slice(sourcesIndex);
  }

  return { mainContent, ctaContent, sourcesContent };
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`FAIL: ${msg}`);
  console.log(`  PASS: ${msg}`);
}

console.log("=== partitionContent tests ===");

// 1. CTA before sources
const r1 = partitionContent("<p>Main</p><h2>你的企業</h2><p>CTA</p><h3>參考資料</h3><p>Src</p>");
assert(r1.mainContent === "<p>Main</p>", "CTA前sources: main只有正文");
assert(r1.ctaContent.includes("你的企業"), "CTA前sources: CTA包含標題");
assert(r1.sourcesContent.includes("參考資料"), "CTA前sources: sources包含標題");
assert(!r1.mainContent.includes("參考資料"), "CTA前sources: main不包含sources");

// 2. Sources before CTA
const r2 = partitionContent("<p>Main</p><h3>參考資料</h3><p>Src</p><h2>你的企業</h2><p>CTA</p>");
assert(r2.mainContent === "<p>Main</p>", "Sources前CTA: main只有正文");
assert(r2.sourcesContent.includes("參考資料"), "Sources前CTA: sources正確");
assert(r2.ctaContent.includes("你的企業"), "Sources前CTA: CTA正確");
assert(!r2.mainContent.includes("參考資料"), "Sources前CTA: main不包含sources");

// 3. Only CTA
const r3 = partitionContent("<p>Main</p><h2>你的企業</h2><p>CTA only</p>");
assert(r3.mainContent === "<p>Main</p>", "僅CTA: main正確");
assert(r3.ctaContent.includes("你的企業"), "僅CTA: CTA正確");
assert(r3.sourcesContent === "", "僅CTA: 無sources");

// 4. Only sources
const r4 = partitionContent("<p>Main</p><h3>參考資料</h3><p>Src only</p>");
assert(r4.mainContent === "<p>Main</p>", "僅sources: main正確");
assert(r4.ctaContent === "", "僅sources: 無CTA");
assert(r4.sourcesContent.includes("參考資料"), "僅sources: sources正確");

// 5. Neither
const r5 = partitionContent("<p>Just content</p><h2>Section</h2><p>More</p>");
assert(r5.mainContent === "<p>Just content</p><h2>Section</h2><p>More</p>", "無特殊區塊: 全部保留");
assert(r5.ctaContent === "", "無特殊區塊: 無CTA");
assert(r5.sourcesContent === "", "無特殊區塊: 無sources");

console.log("\nAll tests passed.");
