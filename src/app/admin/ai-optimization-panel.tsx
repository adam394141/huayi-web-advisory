"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AiResult = {
  fact_ledger: Array<{ claim: string; source_quote: string; status: "supported" | "needs_review" }>;
  article: { title: string; excerpt: string; content_html: string };
  seo: { title: string; description: string; focus_keyword: string; related_keywords: string[] };
  aeo: { direct_answer: string; faq: Array<{ question: string; answer: string }> };
  geo: { entities: Array<{ name: string; type: string }>; source_gaps: string[] };
  tags: string[];
  internal_links: Array<{ path: string; anchor_text: string; reason: string }>;
  image_alt_suggestions: Array<{ image_url: string; alt: string }>;
  human_review_notes: string[];
  blocking_issues: string[];
  deterministic_blockers: string[];
};

type Job = { id: string; status: string; stale?: boolean; output_snapshot?: AiResult | null; error_message?: string | null };

const fieldOptions = [
  ["title", "文章標題"], ["excerpt", "文章摘要"], ["content", "完整正文"],
  ["seo_title", "SEO 標題"], ["seo_description", "SEO 說明"], ["tags", "標籤"],
  ["faq", "常見問題"], ["ai_summary", "直接答案摘要"],
] as const;

export function AiOptimizationPanel({ articleId, updatedAt, configured, accessToken, onApplied }: {
  articleId: string;
  updatedAt: string;
  configured: boolean;
  accessToken: () => Promise<string>;
  onApplied: (item: Record<string, unknown>) => void;
}) {
  const [source, setSource] = useState("");
  const [job, setJob] = useState<Job | null>(null);
  const [selected, setSelected] = useState<string[]>(["title","excerpt","content","seo_title","seo_description","tags","faq","ai_summary"]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmedBlockers, setConfirmedBlockers] = useState(false);
  const pollCount = useRef(0);
  const loadedArticle = useRef("");
  const result = job?.output_snapshot || null;
  const blockers = useMemo(() => [...(result?.blocking_issues || []), ...(result?.deterministic_blockers || [])], [result]);

  useEffect(() => {
    if (!configured || loadedArticle.current === articleId) return;
    loadedArticle.current = articleId; setJob(null); setMessage(""); setConfirmedBlockers(false); pollCount.current = 0;
    let cancelled = false;
    void (async () => {
      try {
        const token = await accessToken();
        const response = await fetch(`/api/cms/ai-optimize?article_id=${encodeURIComponent(articleId)}`, { headers:{ Authorization:`Bearer ${token}` }, cache:"no-store" });
        const data = await response.json();
        if (!cancelled && response.ok && data.job) setJob(data.job);
      } catch { /* 一般編輯不應被 AI 歷史讀取失敗阻擋 */ }
    })();
    return () => { cancelled = true; };
  }, [articleId, configured, accessToken]);

  useEffect(() => {
    if (!job || !["pending", "running"].includes(job.status) || job.stale) return;
    let cancelled = false;
    const delay = pollCount.current < 5 ? 2_000 : Math.min(10_000, 2_000 + pollCount.current * 500);
    const timer = window.setTimeout(async () => {
      if (document.visibilityState === "hidden") { setJob((current) => current ? { ...current } : current); return; }
      try {
        const token = await accessToken();
        const response = await fetch(`/api/cms/ai-optimize/${job.id}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        const data = await response.json();
        if (!cancelled && response.ok) { pollCount.current += 1; setJob(data.job); }
        else if (!cancelled) setMessage(data.error || "暫時無法讀取 AI 狀態。");
      } catch { if (!cancelled) setMessage("AI 狀態連線中斷，文章原稿沒有被修改。"); }
    }, delay);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [job, accessToken]);

  async function start() {
    setBusy(true); setMessage(""); pollCount.current = 0;
    try {
      const token = await accessToken();
      const response = await fetch("/api/cms/ai-optimize", {
        method: "POST", cache: "no-store", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ article_id: articleId, expected_updated_at: updatedAt, source_material: source }),
      });
      const data = await response.json();
      if (!response.ok) { setMessage(data.error || "無法開始 AI 優化。"); return; }
      setJob(data.job); setMessage("AI 正在整理文章。原稿不會被覆蓋。");
    } catch { setMessage("無法開始 AI 優化，文章原稿沒有被修改。"); }
    finally { setBusy(false); }
  }

  async function retry() {
    if (!job) return;
    setBusy(true); setMessage(""); pollCount.current = 0;
    try {
      const token = await accessToken();
      const response = await fetch(`/api/cms/ai-optimize/${job.id}/retry`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const data = await response.json();
      if (!response.ok) { setMessage(data.error || "目前不能重試。"); return; }
      setJob(data.job); setMessage("已重新開始；不會重複儲存舊結果。");
    } catch { setMessage("重試連線失敗。"); }
    finally { setBusy(false); }
  }

  async function apply() {
    if (!job || !result || !selected.length) return;
    setBusy(true); setMessage("");
    try {
      const token = await accessToken();
      const response = await fetch(`/api/cms/ai-optimize/${job.id}/apply`, {
        method: "POST", cache: "no-store", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ expected_updated_at: updatedAt, fields: selected, confirm_blockers: confirmedBlockers }),
      });
      const data = await response.json();
      if (!response.ok) { setMessage(data.error || "無法套用 AI 結果。"); return; }
      onApplied(data.item); setMessage("已套用為草稿並保存修改前版本；仍需人工發布。");
    } catch { setMessage("套用失敗，文章原稿沒有被修改。"); }
    finally { setBusy(false); }
  }

  return <section className="rounded-2xl border border-amber-300 bg-amber-50/50 p-5">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-semibold">AI SEO／AEO／GEO 優化</h2><p className="mt-1 text-sm text-neutral-600">AI 可重新整理文章，但不能新增原始素材沒有的事實。</p></div><span className="rounded-full bg-white px-3 py-1 text-xs">人工審核後發布</span></div>
    {!configured ? <p className="mt-4 rounded-xl bg-white p-3 text-sm text-amber-900">AI 尚未設定。一般文章編輯與儲存不受影響。</p> : <><label className="mt-5 block text-sm font-medium">補充真實素材（訪談筆記、資料、原文）<textarea className="mt-2 min-h-36 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base" maxLength={50_000} value={source} onChange={(event) => setSource(event.target.value)} placeholder="只放確定為真的內容；沒有補充資料也可以直接用目前文章。" /></label><button type="button" className="mt-4 rounded-full bg-neutral-900 px-5 py-2.5 text-white disabled:opacity-40" disabled={busy || !!(job && ["pending","running"].includes(job.status) && !job.stale)} onClick={start}>{busy ? "處理中…" : "開始 AI 優化"}</button></>}
    {message && <p role="status" className="mt-4 text-sm text-neutral-700">{message}</p>}
    {job && <div className="mt-5 rounded-xl bg-white p-4"><p className="text-sm">任務狀態：{job.stale ? "已逾時" : job.status === "pending" ? "排隊中" : job.status === "running" ? "整理中" : job.status === "failed" ? "失敗" : "等待審核"}</p>{(job.stale || job.status === "failed") && <button type="button" className="mt-3 underline" disabled={busy} onClick={retry}>安全重試</button>}{job.error_message && <p className="mt-2 text-sm text-red-700">{job.error_message}</p>}</div>}
    {result && <div className="mt-5 space-y-5">
      {blockers.length > 0 && <div className="rounded-xl border border-red-300 bg-red-50 p-4"><h3 className="font-semibold text-red-800">必須確認的事實</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-800">{blockers.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>}
      <div className="rounded-xl bg-white p-4"><h3 className="font-semibold">文章預覽</h3><h4 className="mt-3 text-lg font-semibold">{result.article.title}</h4><p className="mt-2 text-sm text-neutral-600">{result.article.excerpt}</p><div className="mt-3 max-h-72 overflow-auto border-t pt-3 text-sm leading-7" dangerouslySetInnerHTML={{ __html: result.article.content_html }} /></div>
      <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-white p-4"><h3 className="font-semibold">SEO</h3><p className="mt-2">{result.seo.title}</p><p className="mt-1 text-sm text-neutral-600">{result.seo.description}</p><p className="mt-2 text-xs">主題：{result.seo.focus_keyword}</p></div><div className="rounded-xl bg-white p-4"><h3 className="font-semibold">AEO／GEO</h3><p className="mt-2 text-sm">{result.aeo.direct_answer}</p><p className="mt-2 text-xs text-neutral-600">FAQ {result.aeo.faq.length} 題・實體 {result.geo.entities.length} 項・來源缺口 {result.geo.source_gaps.length} 項</p></div></div>
      <details className="rounded-xl bg-white p-4"><summary className="cursor-pointer font-semibold">標籤、站內連結與圖片文字建議</summary><div className="mt-3 space-y-4 text-sm"><p><span className="font-medium">標籤：</span>{result.tags.join("、") || "無"}</p><div><p className="font-medium">站內連結</p><ul className="mt-1 list-disc space-y-1 pl-5">{result.internal_links.map((item,index)=><li key={`${item.path}-${index}`}><code>{item.path}</code>：{item.anchor_text}（{item.reason}）</li>)}{result.internal_links.length===0&&<li>無</li>}</ul></div><div><p className="font-medium">圖片替代文字</p><ul className="mt-1 list-disc space-y-1 pl-5">{result.image_alt_suggestions.map((item,index)=><li key={`${item.image_url}-${index}`}><span className="break-all">{item.image_url}</span>：{item.alt}</li>)}{result.image_alt_suggestions.length===0&&<li>無</li>}</ul></div></div></details>
      <details className="rounded-xl bg-white p-4"><summary className="cursor-pointer font-semibold">事實來源核對表</summary><ul className="mt-3 space-y-3 text-sm">{result.fact_ledger.map((item,index)=><li key={`${item.claim}-${index}`}><p className="font-medium">{item.status === "supported" ? "已找到來源" : "需人工確認"}：{item.claim}</p><p className="mt-1 text-neutral-600">原始素材：{item.source_quote || "未提供"}</p></li>)}{result.fact_ledger.length===0&&<li>沒有可列出的事實。</li>}</ul></details>
      {(result.human_review_notes.length > 0 || result.geo.source_gaps.length > 0) && <details className="rounded-xl bg-white p-4"><summary className="cursor-pointer font-semibold">人工檢查備註</summary><ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{[...result.human_review_notes,...result.geo.source_gaps].map((item,index)=><li key={`${item}-${index}`}>{item}</li>)}</ul></details>}
      <fieldset className="rounded-xl bg-white p-4"><legend className="font-semibold">選擇要套用的項目</legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{fieldOptions.map(([value,label]) => <label key={value} className="flex items-center gap-2"><input type="checkbox" checked={selected.includes(value)} onChange={(event) => setSelected((current) => event.target.checked ? [...new Set([...current,value])] : current.filter((item)=>item!==value))} />{label}</label>)}</div></fieldset>
      {blockers.length > 0 && <label className="flex items-start gap-2 rounded-xl border border-red-200 bg-white p-4 text-sm"><input className="mt-1" type="checkbox" checked={confirmedBlockers} onChange={(event)=>setConfirmedBlockers(event.target.checked)} /><span>我已逐項核對上述事實；確認後系統才允許套用與後續發布。</span></label>}
      <button type="button" className="rounded-full bg-neutral-900 px-5 py-2.5 text-white disabled:opacity-40" disabled={busy || !selected.length || (blockers.length > 0 && !confirmedBlockers)} onClick={apply}>套用選取項目為草稿</button>
    </div>}
  </section>;
}
