export interface PartitionResult {
  intro: string;
  firstChapter: string;
  laterChapters: string;
  ctaContent: string;
  sourcesContent: string;
  sections: string[];
}

export function partitionContent(content: string): PartitionResult {
  const ctaPatterns = ["<h2>你的企業", "<h2>你的餐廳"];
  const sourcesPatterns = ["<h3>參考資料", "<h3>資料來源"];

  let ctaIndex = -1;
  for (const p of ctaPatterns) {
    const i = content.indexOf(p);
    if (i >= 0 && (ctaIndex < 0 || i < ctaIndex)) ctaIndex = i;
  }
  let sourcesIndex = -1;
  for (const p of sourcesPatterns) {
    const i = content.indexOf(p);
    if (i >= 0 && (sourcesIndex < 0 || i < sourcesIndex)) sourcesIndex = i;
  }

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

  const sections: string[] = [];
  const withAnchors = mainContent.replace(
    /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi,
    (_, title: string) => {
      const index = sections.push(title.replace(/<[^>]+>/g, ""));
      return `<h2 id="section-${index}">${title}</h2>`;
    },
  );

  const h2Start = withAnchors.search(/<h2\b/i);
  const intro = h2Start >= 0 ? withAnchors.slice(0, h2Start) : withAnchors;
  const body = h2Start >= 0 ? withAnchors.slice(h2Start) : "";
  const secondH2 = body.indexOf("<h2", 4);
  const firstChapter = secondH2 >= 0 ? body.slice(0, secondH2) : body;
  const laterChapters = secondH2 >= 0 ? body.slice(secondH2) : "";

  return { intro, firstChapter, laterChapters, ctaContent, sourcesContent, sections };
}
