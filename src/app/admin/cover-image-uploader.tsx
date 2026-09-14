"use client";

import { useRef, useState, type ChangeEvent } from "react";

type Collection = "works" | "blog_posts";
type Dimensions = { width: number; height: number };

function formatBytes(bytes?: number) {
  if (!bytes) return "未記錄";
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export function CoverImageUploader({ value, onChange, collection, itemId, accessToken, fieldClass }: {
  value: string;
  onChange: (url: string) => void;
  collection: Collection;
  itemId: string;
  accessToken: () => Promise<string>;
  fieldClass: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [sourceDimensions, setSourceDimensions] = useState<Dimensions | null>(null);
  const [displayDimensions, setDisplayDimensions] = useState<Dimensions | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] || null;
    setFile(next); setSourceDimensions(null); setMessage("");
    if (!next) return;
    const acceptedMime = ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(next.type);
    const acceptedName = /\.(jpe?g|png|webp)$/i.test(next.name);
    if ((!acceptedMime && !(next.type === "" && acceptedName)) || next.size > 4 * 1024 * 1024) {
      setMessage("僅接受 4 MB 以下的 JPG、PNG 或 WebP。"); setFile(null); return;
    }
    const url = URL.createObjectURL(next);
    const image = new Image();
    image.onload = () => {
      setSourceDimensions({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      setMessage("無法讀取圖片內容。"); setFile(null); URL.revokeObjectURL(url);
    };
    image.src = url;
  }

  async function upload() {
    if (!file) { setMessage("請先選擇一張封面圖片。"); return; }
    setUploading(true); setMessage("正在最佳化並上傳封面，請勿關閉頁面…");
    try {
      const token = await accessToken();
      if (!token) { setMessage("登入狀態已過期，請重新登入後再上傳。"); return; }
      const form = new FormData();
      form.append("file", file); form.append("collection", collection); form.append("itemId", itemId); form.append("usage", "cover");
      const response = await fetch("/api/cms/assets", {
        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form,
      });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error || "封面上傳失敗。"); return; }
      onChange(result.url); setDisplayDimensions({ width: result.width, height: result.height });
      const saving = result.savedPercent > 0 ? `縮小 ${result.savedPercent}%` : "已完成網站格式轉換";
      setMessage(`封面已換成網站版：${formatBytes(result.originalBytes)} → ${formatBytes(result.optimizedBytes)}（${saving}）。請記得儲存整頁。`);
      setFile(null); setSourceDimensions(null); if (fileInput.current) fileInput.current.value = "";
    } catch { setMessage("封面上傳失敗，未修改頁面。請檢查網路後再試一次。"); }
    finally { setUploading(false); }
  }

  return <section className="space-y-3 rounded-2xl border border-neutral-200 p-4">
    <div><h3 className="font-semibold">封面圖片</h3><p className="mt-1 text-sm text-neutral-600">建議 1200 × 900 px。系統保留原圖，另產生最寬 1200 px 的 WebP 網站版；不放大、不裁切。</p></div>
    <label className="block">目前封面圖片網址<input className={fieldClass} maxLength={2048} value={value} onChange={(event) => { onChange(event.target.value); setDisplayDimensions(null); setMessage(""); }} /></label>
    {value && <div><div className="overflow-hidden rounded-2xl bg-neutral-100">
      {/* 後台需讀取使用者輸入網址的原始尺寸，因此使用原生 img。 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={value} alt="封面預覽" className="max-h-80 w-full object-contain" onLoad={(event) => setDisplayDimensions({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })} onError={() => { setDisplayDimensions(null); setMessage("圖片無法載入，請確認網址。"); }} />
    </div><p className="mt-2 text-sm text-neutral-600">網站顯示尺寸：{displayDimensions ? `${displayDimensions.width} × ${displayDimensions.height} px` : "讀取中…"}；保留比例、不裁切。</p></div>}
    <div className="rounded-xl bg-neutral-100 p-4"><label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-neutral-900 bg-white px-5 py-2 font-medium">1. 選擇新封面<input ref={fileInput} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={chooseFile} /></label>
      {file && <p className="mt-2 text-sm text-neutral-600">已選擇：{file.name}・{formatBytes(file.size)}{sourceDimensions ? `・${sourceDimensions.width} × ${sourceDimensions.height} px` : "・正在讀取圖片尺寸…"}</p>}
      {sourceDimensions && <p className="mt-2 text-sm text-neutral-600">原始檔：{sourceDimensions.width} × {sourceDimensions.height} px・{formatBytes(file?.size)}。{sourceDimensions.width < 1200 ? "寬度低於建議值，上傳後不會放大。" : "符合封面建議寬度。"}</p>}
      <button type="button" className="mt-3 rounded-full bg-neutral-900 px-5 py-2 text-white disabled:opacity-40" disabled={!file || uploading} onClick={upload}>{uploading ? "正在最佳化並上傳…" : "2. 上傳並設為封面"}</button>
    </div>
    {message && <p role="status" aria-live="polite" className={`rounded-xl px-3 py-2 text-sm ${uploading ? "bg-blue-50 text-blue-900" : "bg-amber-50 text-amber-900"}`}>{message}</p>}
  </section>;
}
