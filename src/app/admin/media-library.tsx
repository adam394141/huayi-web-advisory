"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { fetchWebpDimensions } from "@/lib/webp-dimensions";

type MediaItem = {
  path: string; file_name: string; collection: "works" | "blog_posts"; item_id: string; item_title: string;
  bytes: number; mime_type: string; created_at: string; updated_at: string;
  used_as_cover: boolean; used_in_content: boolean; url: string;
};
type Filters = { query: string; collection: "" | "works" | "blog_posts"; usage: "" | "cover" | "content" | "unreferenced" };
const EMPTY_FILTERS: Filters = { query: "", collection: "", usage: "" };

function formatBytes(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "大小未記錄";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 102.4) / 10} KB`;
  return `${Math.round(value / 1024 / 102.4) / 10} MB`;
}

function usageLabels(item: MediaItem) {
  const labels = [];
  if (item.used_as_cover) labels.push("封面使用中");
  if (item.used_in_content) labels.push("內文使用中");
  return labels.length ? labels : ["未找到引用"];
}

export function MediaLibrary({ accessToken }: { accessToken: () => Promise<string> }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(EMPTY_FILTERS);
  const [dimensions, setDimensions] = useState<Record<string, string>>({});
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [copyNotice, setCopyNotice] = useState("");

  const load = useCallback(async (nextPage: number, nextFilters: Filters) => {
    setLoading(true); setMessage(""); setCopyNotice("");
    try {
      const token = await accessToken();
      const params = new URLSearchParams({ page: String(nextPage) });
      if (nextFilters.query.trim()) params.set("q", nextFilters.query.trim());
      if (nextFilters.collection) params.set("collection", nextFilters.collection);
      if (nextFilters.usage) params.set("usage", nextFilters.usage);
      const response = await fetch(`/api/cms/media?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const result = await response.json();
      if (!response.ok) { setItems([]); setTotal(0); setMessage(result.error || "媒體庫暫時無法讀取。"); return; }
      setItems(result.items || []); setTotal(result.total || 0); setPage(nextPage); setAppliedFilters(nextFilters);
    } catch { setItems([]); setTotal(0); setMessage("媒體庫連線失敗，請稍後重試。"); }
    finally { setLoading(false); }
  }, [accessToken]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(0, EMPTY_FILTERS); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    let active = true;
    void Promise.all(items.map(async (item) => {
      const size = await fetchWebpDimensions(item.url);
      return [item.path, size ? `${size.width} × ${size.height} px` : "尺寸未記錄"] as const;
    })).then((entries) => { if (active) setDimensions(Object.fromEntries(entries)); });
    return () => { active = false; };
  }, [items]);

  function submit(event: FormEvent) { event.preventDefault(); void load(0, filters); }
  function clear() { setFilters(EMPTY_FILTERS); void load(0, EMPTY_FILTERS); }
  async function copyUrl(item: MediaItem) {
    try { await navigator.clipboard.writeText(item.url); setCopyNotice(`已複製「${item.item_title}」圖片網址。`); }
    catch { setCopyNotice("瀏覽器無法自動複製，請開啟圖片後從網址列複製。"); }
  }

  const hasFilters = !!(appliedFilters.query || appliedFilters.collection || appliedFilters.usage);
  return <section className="mt-6">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-semibold">媒體庫</h2><p className="mt-2 text-sm text-neutral-600">集中查看後台上傳的網站版圖片；原圖不在此公開，也不提供直接刪除。</p></div><p className="text-sm text-neutral-500">共 {total} 張</p></div>
    <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 md:grid-cols-3">
      <label className="text-sm font-medium">搜尋內容或檔名<input className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base" maxLength={100} value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} /></label>
      <label className="text-sm font-medium">內容類型<select className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base" value={filters.collection} onChange={(event) => setFilters({ ...filters, collection: event.target.value as Filters["collection"] })}><option value="">全部</option><option value="works">作品</option><option value="blog_posts">觀點</option></select></label>
      <label className="text-sm font-medium">使用狀態<select className="mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base" value={filters.usage} onChange={(event) => setFilters({ ...filters, usage: event.target.value as Filters["usage"] })}><option value="">全部</option><option value="cover">封面使用中</option><option value="content">內文使用中</option><option value="unreferenced">未找到引用</option></select></label>
      <div className="flex flex-wrap gap-3 md:col-span-3"><button className="rounded-full bg-neutral-900 px-5 py-3 text-white disabled:opacity-40" disabled={loading}>{loading ? "讀取中…" : "套用篩選"}</button><button type="button" className="rounded-full border border-neutral-400 bg-white px-5 py-3 disabled:opacity-40" disabled={loading || !hasFilters} onClick={clear}>清除條件</button></div>
    </form>
    {message && <div role="alert" className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950"><strong>媒體庫尚未完成連線</strong><p className="mt-2">{message}</p></div>}
    {copyNotice && <p role="status" aria-live="polite" className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-900">{copyNotice}</p>}
    <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <li key={item.path} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="relative aspect-[4/3] bg-neutral-100"><Image src={item.url} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain" /></div>
      <div className="p-4"><div className="flex flex-wrap gap-2">{usageLabels(item).map((label) => <span key={label} className={`rounded-full border px-2.5 py-1 text-xs ${label === "未找到引用" ? "border-amber-300 bg-amber-50 text-amber-900" : "border-green-300 bg-green-50 text-green-800"}`}>{label}</span>)}</div>
        <h3 className="mt-3 font-semibold leading-snug">{item.item_title}</h3><p className="mt-1 text-sm text-neutral-600">{item.collection === "works" ? "作品" : "觀點"}</p>
        <p className="mt-3 text-xs leading-relaxed text-neutral-500">{dimensions[item.path] || "正在讀取像素…"}・{formatBytes(item.bytes)}<br />上傳：{new Date(item.created_at).toLocaleString("zh-TW")}</p><p className="mt-2 truncate text-xs text-neutral-400" title={item.file_name}>{item.file_name}</p>
        <div className="mt-4 flex flex-wrap gap-2"><button type="button" className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white" onClick={() => copyUrl(item)}>複製網址</button><a className="rounded-full border border-neutral-400 px-4 py-2 text-sm" href={item.url} target="_blank" rel="noreferrer">開啟圖片 ↗</a></div>
      </div>
    </li>)}</ul>
    {!message && !loading && !items.length && <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-neutral-600">{hasFilters ? "沒有符合目前條件的圖片。" : "目前尚無後台上傳的網站版圖片。"}</div>}
    <div className="mt-6 flex items-center gap-5"><button className="underline disabled:text-neutral-300" disabled={loading || page === 0} onClick={() => load(page - 1, appliedFilters)}>上一頁</button><span>第 {page + 1} 頁</span><button className="underline disabled:text-neutral-300" disabled={loading || (page + 1) * 24 >= total} onClick={() => load(page + 1, appliedFilters)}>下一頁</button></div>
    <div className="mt-6 rounded-2xl bg-neutral-100 p-5 text-sm text-neutral-700"><strong>刪除保護</strong><p className="mt-2">「未找到引用」只表示目前作品與觀點沒有直接使用，不代表一定可以刪除。第一版不提供刪除，避免造成前台破圖。</p></div>
  </section>;
}
