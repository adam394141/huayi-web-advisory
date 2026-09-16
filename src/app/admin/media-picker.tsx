"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { mediaAltFromFileName, type MediaSelection } from "@/lib/media-selection";
import { fetchWebpDimensions } from "@/lib/webp-dimensions";

type MediaItem = {
  path: string;
  file_name: string;
  collection: "works" | "blog_posts";
  item_title: string;
  bytes: number;
  used_as_cover: boolean;
  used_in_content: boolean;
  url: string;
};

type Dimensions = { width: number; height: number };

function formatBytes(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "大小未記錄";
  if (value < 1024 * 1024) return `${Math.round(value / 102.4) / 10} KB`;
  return `${Math.round(value / 1024 / 102.4) / 10} MB`;
}

function usageLabel(item: MediaItem) {
  if (item.used_as_cover && item.used_in_content) return "封面、內文使用中";
  if (item.used_as_cover) return "封面使用中";
  if (item.used_in_content) return "內文使用中";
  return "未找到引用";
}

export function MediaPicker({ open, title, accessToken, onClose, onSelect }: {
  open: boolean;
  title: string;
  accessToken: () => Promise<string>;
  onClose: () => void;
  onSelect: (selection: MediaSelection) => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [collection, setCollection] = useState<"" | "works" | "blog_posts">("");
  const [appliedCollection, setAppliedCollection] = useState<"" | "works" | "blog_posts">("");
  const [dimensions, setDimensions] = useState<Record<string, Dimensions>>({});
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [choosing, setChoosing] = useState("");
  const [message, setMessage] = useState("");

  async function load(nextPage: number, nextQuery: string, nextCollection: "" | "works" | "blog_posts") {
    setLoading(true);
    setMessage("");
    try {
      const token = await accessToken();
      if (!token) {
        setMessage("登入狀態已過期，請重新登入後再選圖。");
        return;
      }
      const params = new URLSearchParams({ page: String(nextPage) });
      if (nextQuery.trim()) params.set("q", nextQuery.trim());
      if (nextCollection) params.set("collection", nextCollection);
      const response = await fetch(`/api/cms/media?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) {
        setItems([]);
        setTotal(0);
        setMessage(result.error || "媒體庫暫時無法讀取。");
        return;
      }
      setItems(result.items || []);
      setTotal(result.total || 0);
      setPage(nextPage);
      setAppliedQuery(nextQuery);
      setAppliedCollection(nextCollection);
    } catch {
      setItems([]);
      setTotal(0);
      setMessage("媒體庫連線失敗，請稍後重試。");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => { void load(0, "", ""); }, 0);
    return () => window.clearTimeout(timer);
    // 每次重新開啟選圖視窗時載入最新媒體資料。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open || !items.length) return;
    let active = true;
    void Promise.all(items.map(async (item) => [item.path, await fetchWebpDimensions(item.url)] as const))
      .then((entries) => {
        if (!active) return;
        const next: Record<string, Dimensions> = {};
        for (const [path, size] of entries) if (size) next[path] = size;
        setDimensions((current) => ({ ...current, ...next }));
      });
    return () => { active = false; };
  }, [items, open]);

  useEffect(() => {
    if (!open) return;
    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [onClose, open]);

  if (!open) return null;

  function submit(event: FormEvent) {
    event.preventDefault();
    void load(0, query, collection);
  }

  async function choose(item: MediaItem) {
    setChoosing(item.path);
    const size = dimensions[item.path] || await fetchWebpDimensions(item.url) || undefined;
    onSelect({
      url: item.url,
      path: item.path,
      fileName: item.file_name,
      alt: item.item_title.trim() || mediaAltFromFileName(item.file_name),
      width: size?.width,
      height: size?.height,
      bytes: item.bytes,
    });
    setChoosing("");
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 md:p-8" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="media-picker-title" className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
      <header className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4 md:px-7">
        <div><h2 id="media-picker-title" className="text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-neutral-600">直接引用既有網站版圖片，不會重新上傳或增加儲存空間。</p></div>
        <button type="button" className="rounded-full border border-neutral-300 px-4 py-2 text-sm" onClick={onClose}>關閉</button>
      </header>
      <form onSubmit={submit} className="grid gap-3 border-b border-neutral-200 bg-neutral-50 px-5 py-4 md:grid-cols-[1fr_12rem_auto] md:px-7">
        <label className="text-sm font-medium">搜尋內容或檔名<input autoFocus className="mt-1 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-base" maxLength={100} value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <label className="text-sm font-medium">內容類型<select className="mt-1 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-base" value={collection} onChange={(event) => setCollection(event.target.value as typeof collection)}><option value="">全部</option><option value="works">作品</option><option value="blog_posts">觀點</option></select></label>
        <button className="self-end rounded-full bg-neutral-900 px-5 py-2.5 text-white disabled:opacity-40" disabled={loading}>{loading ? "讀取中…" : "搜尋"}</button>
      </form>
      <div className="overflow-y-auto px-5 py-5 md:px-7">
        {message && <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-amber-950">{message}</p>}
        {!message && !loading && !items.length && <p className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-neutral-600">沒有符合條件的圖片。</p>}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map((item) => {
          const size = dimensions[item.path];
          return <li key={item.path} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="relative aspect-[4/3] bg-neutral-100"><Image src={item.url} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-contain" /></div>
            <div className="p-4"><p className="text-xs text-neutral-500">{item.collection === "works" ? "作品" : "觀點"}・{usageLabel(item)}</p><h3 className="mt-1 line-clamp-2 font-medium">{item.item_title}</h3><p className="mt-2 text-xs text-neutral-500">{size ? `${size.width} × ${size.height} px` : "讀取像素中…"}・{formatBytes(item.bytes)}</p><button type="button" className="mt-3 w-full rounded-full bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-40" disabled={!!choosing} onClick={() => void choose(item)}>{choosing === item.path ? "正在選取…" : "使用這張圖片"}</button></div>
          </li>;
        })}</ul>
      </div>
      <footer className="flex items-center justify-between gap-4 border-t border-neutral-200 px-5 py-4 text-sm md:px-7"><span>共 {total} 張・第 {page + 1} 頁</span><div className="flex gap-4"><button type="button" className="underline disabled:text-neutral-300" disabled={loading || page === 0} onClick={() => void load(page - 1, appliedQuery, appliedCollection)}>上一頁</button><button type="button" className="underline disabled:text-neutral-300" disabled={loading || (page + 1) * 24 >= total} onClick={() => void load(page + 1, appliedQuery, appliedCollection)}>下一頁</button></div></footer>
    </section>
  </div>;
}
