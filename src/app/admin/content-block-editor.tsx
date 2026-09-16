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
  const editorRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastEmittedValue = useRef<string | null>(null);

  useEffect(() => {
    // 自己編輯造成的 value 更新不重建區塊，避免游標跳動；AI 套用或版本還原則立即同步。
    if (lastEmittedValue.current === value) {
      lastEmittedValue.current = null;
      return;
    }
    const task = window.setTimeout(() => {
      setBlocks(parseContent(value));
      setSelected(0);
    }, 0);
    return () => window.clearTimeout(task);
  }, [itemId, value]);

  function commit(next: Block[]) {
    const html = serialize(next);
    setBlocks(next);
    lastEmittedValue.current = html;
    onChange(html);
  }
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
  function syncHtmlBlock(index: number) {
    const block = blocks[index];
    const editor = editorRefs.current[block?.id];
    if (!editor || !block || block.kind !== "html") return;
    const next = [...blocks];
    next[index] = { ...block, html: editor.innerHTML };
    commit(next);
  }
  function formatSelection(index: number, command: "bold" | "italic" | "createLink") {
    const editor = editorRefs.current[blocks[index]?.id];
    if (!editor) return;
    editor.focus();
    if (command === "createLink") {
      const url = window.prompt("請輸入連結網址（https://、mailto:、tel: 或站內 / 路徑）");
      if (!url) return;
      if (!/^(https:\/\/|mailto:|tel:|\/)/i.test(url.trim())) {
        setMessage("連結格式不安全，請使用 https://、mailto:、tel: 或站內 / 路徑。");
        return;
      }
      document.execCommand(command, false, url.trim());
    } else document.execCommand(command, false);
    syncHtmlBlock(index);
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
    <div><h3 className="font-semibold">圖文內文編輯器</h3><p className="mt-1 text-sm text-neutral-600">AI 可先自動排版；也可用下方工具補上標題、清單、引言、連結與表格。頁面主標題已是 H1，內文請從 H2 開始。</p></div>
    <div className="flex flex-wrap gap-2">
      <button type="button" className={small} onClick={() => insert({ id: id(), kind: "html", html: "<p>請輸入文字</p>" })}>＋ 段落</button>
      <button type="button" className={small} onClick={() => insert({ id: id(), kind: "html", html: "<h2>請輸入大標題</h2>" })}>＋ H2 大標題</button>
      <button type="button" className={small} onClick={() => insert({ id: id(), kind: "html", html: "<h3>請輸入中標題</h3>" })}>＋ H3 中標題</button>
      <button type="button" className={small} onClick={() => insert({ id: id(), kind: "html", html: "<h4>請輸入小標題</h4>" })}>＋ H4 小標題</button>
      <button type="button" className={small} onClick={() => insert({ id: id(), kind: "html", html: "<ol><li>第一項</li><li>第二項</li></ol>" })}>＋ 數字清單</button>
      <button type="button" className={small} onClick={() => insert({ id: id(), kind: "html", html: "<ul><li>第一項</li><li>第二項</li></ul>" })}>＋ 項目清單</button>
      <button type="button" className={small} onClick={() => insert({ id: id(), kind: "html", html: "<blockquote><p>請輸入重點引言</p></blockquote>" })}>＋ 引言</button>
      <button type="button" className={small} onClick={() => insert({ id: id(), kind: "html", html: "<table><thead><tr><th>欄位一</th><th>欄位二</th></tr></thead><tbody><tr><td>內容</td><td>內容</td></tr></tbody></table>" })}>＋ 簡易表格</button>
    </div>
    <div className="space-y-3">{blocks.map((block, index) => <div key={block.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); moveTo(Number(event.dataTransfer.getData("text/plain")), index); }} onClick={() => setSelected(index)} className={`rounded-2xl border p-3 ${selected === index ? "border-amber-500 bg-amber-50/40" : "border-neutral-200"}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><span draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", String(index))} className="cursor-grab text-xs text-neutral-500 active:cursor-grabbing">⠿ 拖曳・{block.kind === "image" ? "圖片" : "文字"}區塊 {index + 1}</span><div className="flex gap-2"><button type="button" className={small} disabled={index === 0} onClick={() => move(index, -1)}>上移</button><button type="button" className={small} disabled={index === blocks.length - 1} onClick={() => move(index, 1)}>下移</button><button type="button" className={small} onClick={() => remove(index)}>移除</button></div></div>
      {block.kind === "html" ? <div>
        <div className="mb-2 flex flex-wrap gap-2" aria-label="文字格式工具列">
          <button type="button" className={small} onMouseDown={(event) => { event.preventDefault(); formatSelection(index, "bold"); }}>粗體</button>
          <button type="button" className={small} onMouseDown={(event) => { event.preventDefault(); formatSelection(index, "italic"); }}>斜體</button>
          <button type="button" className={small} onMouseDown={(event) => { event.preventDefault(); formatSelection(index, "createLink"); }}>加入連結</button>
        </div>
        <div ref={(node) => { editorRefs.current[block.id] = node; }} className="min-h-20 rounded-xl bg-white p-4 leading-relaxed outline-none ring-amber-400 focus:ring-2 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-400 [&_blockquote]:pl-4 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:mb-2 [&_h4]:font-semibold [&_li]:mb-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_table]:my-3 [&_table]:w-full [&_td]:border [&_td]:border-neutral-300 [&_td]:p-2 [&_th]:border [&_th]:border-neutral-300 [&_th]:bg-neutral-100 [&_th]:p-2 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6" contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: block.html }} onPaste={(event) => { event.preventDefault(); document.execCommand("insertText", false, event.clipboardData.getData("text/plain")); }} onBlur={() => syncHtmlBlock(index)} />
      </div> : <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-xl bg-neutral-100"><NextImage unoptimized src={block.src} alt={block.alt} width={block.width || 1600} height={block.height || 1200} className="max-h-96 w-full object-contain" /></div>
        <div className="space-y-3"><label className="block text-sm">替代文字<input className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2" value={block.alt} onChange={(event) => { const next=[...blocks]; next[index]={...block,alt:event.target.value}; commit(next); }} /></label><label className="block text-sm">圖片說明<input className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2" value={block.caption} onChange={(event) => { const next=[...blocks]; next[index]={...block,caption:event.target.value}; commit(next); }} /></label><p className="text-sm text-neutral-500">網站顯示：{block.width && block.height ? `${block.width} × ${block.height} px` : "尺寸未記錄"}{block.optimizedBytes ? `・${formatBytes(block.optimizedBytes)}` : ""}</p>{block.originalWidth && block.originalHeight && <p className="text-sm text-neutral-500">保留原圖：{block.originalWidth} × {block.originalHeight} px・{formatBytes(block.originalBytes)}</p>}<p className="text-sm text-neutral-500">{block.optimizedBytes ? "WebP・" : ""}原比例顯示・不裁切</p></div>
      </div>}
    </div>)}</div>
    <div className="rounded-2xl bg-neutral-100 p-4">
      <h4 className="font-medium">新增內文圖片</h4>
      <p className="mt-1 text-sm text-neutral-600">先點選上方要放置圖片的文字區塊，再選擇圖片並上傳。圖片會插入該區塊後方，之後仍可拖曳、上移或下移。</p>
      <p className="mt-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">目前插入位置：{blocks[selected] ? `${blocks[selected].kind === "image" ? "圖片" : "文字"}區塊 ${selected + 1} 後方` : "文章最後方"}</p>
      <p className="mt-2 text-sm text-neutral-600">系統會保留原圖，另產生最寬 1600 px 的 WebP 網站版；不放大、不裁切。</p>
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
