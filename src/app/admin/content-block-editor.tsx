"use client";

import NextImage from "next/image";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

type Collection = "works" | "blog_posts";
type HtmlBlock = { id: string; kind: "html"; html: string };
type ImageBlock = {
  id: string;
  kind: "image";
  src: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
  originalWidth?: number;
  originalHeight?: number;
  originalBytes?: number;
  optimizedBytes?: number;
};
type Block = HtmlBlock | ImageBlock;

function id() { return crypto.randomUUID(); }
function escapeAttribute(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function optionalNumber(value: string | null) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
}
function formatBytes(bytes?: number) {
  if (!bytes) return "未記錄";
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${Math.round(bytes / 1024)} KB`;
}
function parseContent(html: string): Block[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${html || "<p>請輸入內文</p>"}</body>`, "text/html");
  const blocks: Block[] = [];
  for (const node of Array.from(doc.body.children)) {
    const image = node.tagName === "FIGURE" ? node.querySelector("img") : node.tagName === "IMG" ? node as HTMLImageElement : null;
    if (image) {
      const caption = node.tagName === "FIGURE" ? node.querySelector("figcaption")?.textContent || "" : "";
      blocks.push({
        id: id(), kind: "image", src: image.getAttribute("src") || "", alt: image.getAttribute("alt") || "", caption,
        width: optionalNumber(image.getAttribute("width")), height: optionalNumber(image.getAttribute("height")),
        originalWidth: optionalNumber(image.getAttribute("data-original-width")),
        originalHeight: optionalNumber(image.getAttribute("data-original-height")),
        originalBytes: optionalNumber(image.getAttribute("data-original-bytes")),
        optimizedBytes: optionalNumber(image.getAttribute("data-optimized-bytes")),
      });
    } else blocks.push({ id: id(), kind: "html", html: node.outerHTML });
  }
  return blocks.length ? blocks : [{ id: id(), kind: "html", html: "<p>請輸入內文</p>" }];
}
function serialize(blocks: Block[]) {
  return blocks.map((block) => block.kind === "html" ? block.html :
    `<figure><img src="${escapeAttribute(block.src)}" alt="${escapeAttribute(block.alt)}"${block.width ? ` width="${block.width}"` : ""}${block.height ? ` height="${block.height}"` : ""}${block.originalWidth ? ` data-original-width="${block.originalWidth}"` : ""}${block.originalHeight ? ` data-original-height="${block.originalHeight}"` : ""}${block.originalBytes ? ` data-original-bytes="${block.originalBytes}"` : ""}${block.optimizedBytes ? ` data-optimized-bytes="${block.optimizedBytes}"` : ""}><figcaption>${escapeAttribute(block.caption)}</figcaption></figure>`).join("\n");
}

export function ContentBlockEditor({ value, onChange, collection, itemId, accessToken }: {
  value: string; onChange: (html: string) => void; collection: Collection; itemId: string;
  accessToken: () => Promise<string>;
}) {
  const [blocks, setBlocks] = useState<Block[]>([{ id: "initial", kind: "html", html: value || "<p>請輸入內文</p>" }]);
  const [selected, setSelected] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const initialValue = useRef(value);

  useEffect(() => {
    const task = window.setTimeout(() => setBlocks(parseContent(initialValue.current)), 0);
    return () => window.clearTimeout(task);
  }, []);

  function commit(next: Block[]) { setBlocks(next); onChange(serialize(next)); }
  function insert(block: Block) {
    const next = [...blocks]; const index = Math.min(selected + 1, next.length);
    next.splice(index, 0, block); setSelected(index); commit(next);
  }
  function move(index: number, direction: -1 | 1) {
    const target = index + direction; if (target < 0 || target >= blocks.length) return;
    const next = [...blocks]; [next[index], next[target]] = [next[target], next[index]]; setSelected(target); commit(next);
  }
  function moveTo(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= blocks.length || to >= blocks.length) return;
    const next = [...blocks]; const [block] = next.splice(from, 1); next.splice(to, 0, block); setSelected(to); commit(next);
  }
  function remove(index: number) {
    if (!window.confirm("確定從內文移除這個區塊？尚未按下整頁儲存前，可以重新載入復原。")) return;
    const next = blocks.filter((_, i) => i !== index); setSelected(Math.max(0, Math.min(index, next.length - 1)));
    commit(next.length ? next : [{ id: id(), kind: "html", html: "<p>請輸入內文</p>" }]);
  }
  async function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] || null; setFile(next); setMessage(""); setDimensions(null);
    if (!next) return;
    const acceptedMime = ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(next.type);
    const acceptedName = /\.(jpe?g|png|webp)$/i.test(next.name);
    if ((!acceptedMime && !(next.type === "" && acceptedName)) || next.size > 4 * 1024 * 1024) {
      setMessage("僅接受 4 MB 以下的 JPG、PNG 或 WebP。"); setFile(null); return;
    }
    const url = URL.createObjectURL(next); const image = new Image();
    image.onload = () => { setDimensions({ width: image.naturalWidth, height: image.naturalHeight }); URL.revokeObjectURL(url); };
    image.onerror = () => { setMessage("無法讀取圖片內容。"); setFile(null); URL.revokeObjectURL(url); };
    image.src = url; setAlt(next.name.replace(/\.[^.]+$/, ""));
  }
  async function upload() {
    if (!file) { setMessage("請先選擇一張圖片。"); return; }
    setUploading(true); setMessage("正在最佳化並上傳圖片，請勿關閉頁面…");
    try {
      const token = await accessToken();
      if (!token) { setMessage("登入狀態已過期，請重新登入後再上傳。"); return; }
      const form = new FormData();
      form.append("file", file); form.append("collection", collection); form.append("itemId", itemId); form.append("usage", "content");
      const response = await fetch("/api/cms/assets", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error || "圖片上傳失敗。"); return; }
      insert({
        id: id(), kind: "image", src: result.url, alt: alt.trim() || "作品圖片", caption: caption.trim(),
        width: result.width, height: result.height,
        originalWidth: result.originalWidth, originalHeight: result.originalHeight,
        originalBytes: result.originalBytes, optimizedBytes: result.optimizedBytes,
      });
      setFile(null); setAlt(""); setCaption(""); setDimensions(null); if (fileInput.current) fileInput.current.value = "";
      const saving = result.savedPercent > 0 ? `縮小 ${result.savedPercent}%` : "已完成網站格式轉換";
      setMessage(`圖片已插入內文：${formatBytes(result.originalBytes)} → ${formatBytes(result.optimizedBytes)}（${saving}）。請記得按下頁面底部的「儲存修改」。`);
    } catch { setMessage("圖片上傳失敗，未修改內文。請檢查網路後再試一次。"); }
    finally { setUploading(false); }
  }

  const small = "rounded-full border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-30";
  return <section className="space-y-4 rounded-2xl border border-neutral-200 p-4">
    <div><h3 className="font-semibold">圖文內文編輯器</h3><p className="mt-1 text-sm text-neutral-600">點選區塊後新增內容；可直接拖曳，或用上下按鈕調整順序。</p></div>
    <div className="flex flex-wrap gap-2"><button type="button" className={small} onClick={() => insert({ id: id(), kind: "html", html: "<p>請輸入文字</p>" })}>＋ 文字</button><button type="button" className={small} onClick={() => insert({ id: id(), kind: "html", html: "<h2>請輸入標題</h2>" })}>＋ 標題</button></div>
    <div className="space-y-3">{blocks.map((block, index) => <div key={block.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); moveTo(Number(event.dataTransfer.getData("text/plain")), index); }} onClick={() => setSelected(index)} className={`rounded-2xl border p-3 ${selected === index ? "border-amber-500 bg-amber-50/40" : "border-neutral-200"}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><span draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", String(index))} className="cursor-grab text-xs text-neutral-500 active:cursor-grabbing">⠿ 拖曳・{block.kind === "image" ? "圖片" : "文字"}區塊 {index + 1}</span><div className="flex gap-2"><button type="button" className={small} disabled={index === 0} onClick={() => move(index, -1)}>上移</button><button type="button" className={small} disabled={index === blocks.length - 1} onClick={() => move(index, 1)}>下移</button><button type="button" className={small} onClick={() => remove(index)}>移除</button></div></div>
      {block.kind === "html" ? <div className="min-h-20 rounded-xl bg-white p-4 leading-relaxed outline-none ring-amber-400 focus:ring-2 [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:mb-3" contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: block.html }} onPaste={(event) => { event.preventDefault(); document.execCommand("insertText", false, event.clipboardData.getData("text/plain")); }} onBlur={(event) => { const next = [...blocks]; next[index] = { ...block, html: event.currentTarget.innerHTML }; commit(next); }} /> : <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-xl bg-neutral-100"><NextImage unoptimized src={block.src} alt={block.alt} width={block.width || 1600} height={block.height || 1200} className="max-h-96 w-full object-contain" /></div>
        <div className="space-y-3"><label className="block text-sm">替代文字<input className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2" value={block.alt} onChange={(event) => { const next=[...blocks]; next[index]={...block,alt:event.target.value}; commit(next); }} /></label><label className="block text-sm">圖片說明<input className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2" value={block.caption} onChange={(event) => { const next=[...blocks]; next[index]={...block,caption:event.target.value}; commit(next); }} /></label><p className="text-sm text-neutral-500">網站顯示：{block.width && block.height ? `${block.width} × ${block.height} px` : "尺寸未記錄"}{block.optimizedBytes ? `・${formatBytes(block.optimizedBytes)}` : ""}</p>{block.originalWidth && block.originalHeight && <p className="text-sm text-neutral-500">保留原圖：{block.originalWidth} × {block.originalHeight} px・{formatBytes(block.originalBytes)}</p>}<p className="text-sm text-neutral-500">{block.optimizedBytes ? "WebP・" : ""}原比例顯示・不裁切</p></div>
      </div>}
    </div>)}</div>
    <div className="rounded-2xl bg-neutral-100 p-4">
      <h4 className="font-medium">新增內文圖片</h4>
      <p className="mt-1 text-sm text-neutral-600">依序選擇圖片、填寫說明，再按上傳。系統會保留原圖，另產生最寬 1600 px 的 WebP 網站版；不放大、不裁切。</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="flex cursor-pointer items-center justify-center rounded-full border border-neutral-900 bg-white px-5 py-2 font-medium">
          1. 選擇圖片
          <input ref={fileInput} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={chooseFile} />
        </label>
        <input className="rounded-xl border border-neutral-300 px-3 py-2" placeholder="2. 替代文字（描述圖片內容）" value={alt} onChange={(event) => setAlt(event.target.value)} />
        <input className="rounded-xl border border-neutral-300 px-3 py-2" placeholder="圖片說明（可留白）" value={caption} onChange={(event) => setCaption(event.target.value)} />
        <button type="button" className="rounded-full bg-neutral-900 px-5 py-2 text-white disabled:opacity-40" disabled={!file || uploading} onClick={upload}>{uploading ? "正在最佳化並上傳…" : "3. 上傳並插入文章"}</button>
      </div>
      {file && <p className="mt-3 text-sm">已選擇：{file.name}・{formatBytes(file.size)}{dimensions ? `・${dimensions.width} × ${dimensions.height} px。${dimensions.width < 1600 ? "寬度低於內頁建議的 1600 px；可上傳，但放大可能模糊。" : "符合內頁建議寬度。"}` : "・正在讀取圖片尺寸…"}</p>}
      {message && <p role="status" aria-live="polite" className={`mt-3 rounded-xl px-3 py-2 text-sm ${uploading ? "bg-blue-50 text-blue-900" : "bg-amber-50 text-amber-900"}`}>{message}</p>}
    </div>
  </section>;
}
