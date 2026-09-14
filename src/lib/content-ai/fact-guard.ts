import type { ContentAiOutput } from "./schema";

const SIGNAL_PATTERNS = [
  /https?:\/\/[^\s<>"']+/giu,
  /[\w.+-]+@[\w.-]+\.[a-z]{2,}/giu,
  /(?:NT\$|US\$|[$€¥£]|新台幣|美元)?\s*\d[\d,.]*(?:\s*(?:%|％|元|萬|億|年|月|日|小時|分鐘|人|家|件|次))?/gu,
];

function normalize(value: string) {
  return value.normalize("NFKC").replace(/\s+/g, "").toLocaleLowerCase("zh-TW");
}
export function extractFactSignals(value: string): string[] {
  const signals = SIGNAL_PATTERNS.flatMap((pattern) => value.match(pattern) || [])
    .map((signal) => signal.trim())
    .filter((signal) => signal.length > 1);
  return [...new Set(signals)];
}

export function findUnsupportedFactSignals(source: string, output: ContentAiOutput): string[] {
  const normalizedSource = normalize(source);
  const outputText = [
    output.article.title,
    output.article.excerpt,
    ...output.article.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    output.seo.title,
    output.seo.description,
    output.aeo.direct_answer,
    ...output.aeo.faq.flatMap((item) => [item.question, item.answer]),
  ].join("\n");
  return extractFactSignals(outputText).filter((signal) => !normalizedSource.includes(normalize(signal)));
}

export function buildDeterministicBlockers(source: string, output: ContentAiOutput): string[] {
  const unsupported = findUnsupportedFactSignals(source, output);
  const ledgerIssues = output.fact_ledger
    .filter((entry) => entry.status === "needs_review" || !normalize(source).includes(normalize(entry.source_quote)))
    .map((entry) => `事實需要確認：${entry.claim}`);
  return [
    ...unsupported.map((signal) => `AI 結果出現原始素材未找到的精確資料：${signal}`),
    ...ledgerIssues,
  ];
}
