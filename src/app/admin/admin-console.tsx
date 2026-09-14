"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { ContentBlockEditor } from "./content-block-editor";
import { CoverImageUploader } from "./cover-image-uploader";
import { getAdminPreview } from "@/lib/admin-preview";

type Item = { id: string; title: string; category: string; status: string; cover_image: string | null; updated_at: string };
type EditorItem = Item & {
  slug: string; content: string | null; show_on_homepage: boolean | null; sort_order: number | null;
  description?: string | null; client?: string | null; design_rationale?: string | null;
  excerpt?: string | null; author?: string | null; seo_title?: string | null; seo_description?: string | null;
};

const SAVE_TIMEOUT_MS = 30_000;

async function saveRequest(input: RequestInfo | URL, init: RequestInit) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), SAVE_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
}

export function AdminConsole({ configured, writeConfigured }: { configured: boolean; writeConfigured: boolean }) {
  const [client] = useState(() => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    // 密碼及登入憑證不存入 localStorage/sessionStorage；重新整理須重新登入。
    auth: { persistSession: false, autoRefreshToken: true, detectSessionInUrl: false },
  }));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [factorId, setFactorId] = useState("");
  const [qr, setQr] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [collection, setCollection] = useState<"works" | "blog_posts">("works");
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [writable, setWritable] = useState(writeConfigured);
  const [editing, setEditing] = useState<EditorItem | null>(null);
  const [original, setOriginal] = useState<EditorItem | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { client.auth.stopAutoRefresh(); }, [client]);

  async function load(nextCollection = collection, nextPage = 0) {
    setBusy(true); setMessage("");
    try {
      const { data } = await client.auth.getSession();
      const response = await fetch(`/api/cms?collection=${nextCollection}&page=${nextPage}`, {
        headers: { Authorization: `Bearer ${data.session?.access_token || ""}` }, cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) { setItems([]); setTotal(0); setMessage(result.error); return; }
      setItems(result.items); setTotal(result.total || 0); setPage(nextPage); setCollection(nextCollection); setSignedIn(true); setWritable(!!result.writable); setEditing(null); setOriginal(null);
    } catch { setMessage("連線失敗，未變更任何資料。"); }
    finally { setBusy(false); }
  }

  async function edit(id: string) {
    setBusy(true); setMessage("");
    try {
      const { data } = await client.auth.getSession();
      const response = await fetch(`/api/cms?collection=${collection}&id=${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${data.session?.access_token || ""}` }, cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error); return; }
      setEditing(result.item); setOriginal(result.item); setWritable(!!result.writable);
    } catch { setMessage("無法開啟內容，未變更任何資料。"); }
    finally { setBusy(false); }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!editing || !original) return;
    const common = ["title", "slug", "category", "content", "cover_image", "status", "show_on_homepage", "sort_order", "seo_title", "seo_description"] as const;
    const specific = collection === "works" ? ["description", "client", "design_rationale"] as const : ["excerpt", "author"] as const;
    const changes: Record<string, string | number | boolean | null> = {};
    for (const key of [...common, ...specific]) {
      const next = editing[key] ?? (key === "sort_order" ? 0 : key === "show_on_homepage" ? false : "");
      const previous = original[key] ?? (key === "sort_order" ? 0 : key === "show_on_homepage" ? false : "");
      if (next !== previous) changes[key] = next;
    }
    if (!Object.keys(changes).length) { setMessage("沒有需要儲存的變更。"); return; }
    setBusy(true); setMessage("");
    try {
      const { data } = await client.auth.getSession();
      const response = await saveRequest("/api/cms", {
        method: "PATCH", cache: "no-store",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token || ""}` },
        body: JSON.stringify({ collection, id: editing.id, expected_updated_at: original.updated_at, changes }),
      });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error); return; }
      setEditing(result.item); setOriginal(result.item);
      setItems((current) => current.map((item) => item.id === result.item.id ? { ...item, ...result.item } : item));
      setMessage("已安全儲存，修改前版本已保留。");
    } catch (error) {
      const timedOut = error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
      setMessage(timedOut
        ? "儲存等待超過 30 秒，已停止等待；畫面內容仍保留。請稍候再返回列表確認，避免立刻重複儲存。"
        : "儲存失敗，畫面內容仍保留，未確認任何資料變更。");
    }
    finally { setBusy(false); }
  }

  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const { error } = await client.auth.signInWithPassword({ email, password });
      setPassword("");
      if (error) { setMessage("登入失敗，請確認帳號密碼或稍後重試。"); return; }
      const { data: factors, error: factorError } = await client.auth.mfa.listFactors();
      if (factorError) { setMessage("無法取得雙重驗證設定。"); return; }
      const verified = factors.totp.find((factor) => factor.status === "verified");
      if (verified) { setFactorId(verified.id); return; }
      const { data, error: enrollError } = await client.auth.mfa.enroll({ factorType: "totp", friendlyName: `華翼後台 ${new Date().toISOString()}` });
      if (enrollError) { setMessage("無法設定驗證器，請管理者檢查既有驗證因素。"); return; }
      setFactorId(data.id);
      // 以 img 顯示 Supabase 產生的 QR，不將 SVG 注入 DOM。
      setQr(data.totp.qr_code.startsWith("data:") ? data.totp.qr_code : `data:image/svg+xml,${encodeURIComponent(data.totp.qr_code)}`);
    } catch { setPassword(""); setMessage("登入服務暫時無法使用。"); }
    finally { setBusy(false); }
  }

  async function verify(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const { error } = await client.auth.mfa.challengeAndVerify({ factorId, code });
      setCode("");
      if (error) { setMessage("驗證碼無效或已過期。"); return; }
      setQr(""); await load();
    } catch { setMessage("驗證失敗，請稍後重試。"); }
    finally { setBusy(false); }
  }

  async function logout() {
    setBusy(true);
    try { await client.auth.signOut({ scope: "local" }); }
    finally { setSignedIn(false); setFactorId(""); setQr(""); setPassword(""); setCode(""); setItems([]); setEditing(null); setOriginal(null); setTotal(0); setMessage(""); setBusy(false); }
  }

  const field = "mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base";
  const button = "rounded-full bg-neutral-900 px-6 py-3 text-white disabled:opacity-40";
  const preview = original ? getAdminPreview(collection, original.status, original.slug) : { href: null, reason: "請先儲存內容後再預覽。" };
  return <section className="mx-auto max-w-5xl px-6 py-12">
    <Image src="/brand/huayi-logo.svg" alt="華翼品牌策略" width={150} height={60} className="mb-6 h-auto" />
    <h1 className="text-3xl font-semibold">內容管理</h1>
    <p className="mt-3 text-neutral-600">作品與觀點分開管理；講師頁與 ADS 不在此操作。</p>
    <div className="my-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
      {configured ? (writable ? "已開放文字、圖文區塊、圖片上傳、拖曳順序、狀態與排序值編輯；新增整筆內容與版本還原仍在製作。" : "目前為安全唯讀階段，新增、發布、排序與還原尚未啟用。") : "後台建置中：管理員授權與資料庫權限尚未驗收，登入及寫入未開放。"}
    </div>
    {message && <p role="alert" className="my-4 text-red-700">{message}</p>}
    {!signedIn ? <div className="max-w-md">
      {!factorId ? <form onSubmit={login} className="space-y-5">
        <label className="block">管理員 Email<input className={field} type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} disabled={!configured || busy} /></label>
        <label className="block">密碼<input className={field} type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} disabled={!configured || busy} /></label>
        <button className={button} disabled={!configured || busy}>登入並進行雙重驗證</button>
        <p className="text-sm"><Link className="underline" href="/admin/forgot-password">忘記密碼？</Link></p>
      </form> : <form onSubmit={verify} className="space-y-5">
        {qr && <><p>請使用驗證器 App 掃描後輸入六位數驗證碼。請勿分享這個 QR Code。</p><Image unoptimized src={qr} alt="雙重驗證設定 QR Code" width={240} height={240} /></>}
        <label className="block">驗證碼<input className={field} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required maxLength={6} value={code} onChange={e => setCode(e.target.value)} /></label>
        <button className={button} disabled={busy}>驗證</button>
        <button type="button" className="ml-4 underline" disabled={busy} onClick={logout}>取消並登出</button>
      </form>}
      <p className="mt-5 text-sm text-neutral-600">不開放自行註冊。帳號或驗證器遺失時，由 Supabase 專案管理者確認身分後處理；不能跳過雙重驗證。</p>
    </div> : editing ? <form onSubmit={save} className="max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center gap-4"><button type="button" className="underline" disabled={busy} onClick={() => { setEditing(null); setOriginal(null); setMessage(""); }}>← 返回列表</button><span className="text-sm text-neutral-500">最後更新：{new Date(editing.updated_at).toLocaleString("zh-TW")}</span></div>
      <label className="block">標題<input className={field} required maxLength={180} value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} /></label>
      <label className="block">網址代稱（英文小寫、數字、連字號）<input className={field} required maxLength={140} pattern="[a-z0-9]+(?:[-_][a-z0-9]+)*" value={editing.slug} onChange={(event) => setEditing({ ...editing, slug: event.target.value })} /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">分類<input className={field} required maxLength={80} value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value })} /></label>
        <label className="block">狀態<select className={field} value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value })}><option value="draft">草稿</option><option value="preview">預覽</option><option value="approved">已核准</option><option value="published">已發布</option><option value="archived">封存</option></select></label>
      </div>
      {collection === "works" ? <>
        <label className="block">客戶／專案名稱<input className={field} maxLength={180} value={editing.client || ""} onChange={(event) => setEditing({ ...editing, client: event.target.value })} /></label>
        <label className="block">列表摘要<textarea className={`${field} min-h-28`} maxLength={5000} value={editing.description || ""} onChange={(event) => setEditing({ ...editing, description: event.target.value })} /></label>
        <label className="block">設計說明<textarea className={`${field} min-h-36`} maxLength={20000} value={editing.design_rationale || ""} onChange={(event) => setEditing({ ...editing, design_rationale: event.target.value })} /></label>
      </> : <>
        <label className="block">作者<input className={field} maxLength={180} value={editing.author || ""} onChange={(event) => setEditing({ ...editing, author: event.target.value })} /></label>
        <label className="block">文章摘要<textarea className={`${field} min-h-28`} maxLength={5000} value={editing.excerpt || ""} onChange={(event) => setEditing({ ...editing, excerpt: event.target.value })} /></label>
      </>}
      <ContentBlockEditor
        key={`${collection}:${editing.id}`}
        value={editing.content || ""}
        onChange={(content) => setEditing((current) => current ? { ...current, content } : current)}
        collection={collection}
        itemId={editing.id}
        accessToken={async () => (await client.auth.getSession()).data.session?.access_token || ""}
        previewHref={preview.href}
        previewUnavailableReason={preview.reason}
      />
      <CoverImageUploader value={editing.cover_image || ""} onChange={(cover_image) => setEditing((current) => current ? { ...current, cover_image } : current)} collection={collection} itemId={editing.id} accessToken={async () => (await client.auth.getSession()).data.session?.access_token || ""} fieldClass={field} />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">排序值<input className={field} type="number" min={-100000} max={100000} value={editing.sort_order ?? 0} onChange={(event) => setEditing({ ...editing, sort_order: Number(event.target.value) })} /></label>
        <label className="mt-8 flex items-center gap-3"><input type="checkbox" checked={!!editing.show_on_homepage} onChange={(event) => setEditing({ ...editing, show_on_homepage: event.target.checked })} />顯示於首頁</label>
      </div>
      <details className="rounded-xl border border-neutral-200 p-4"><summary className="cursor-pointer">SEO 設定</summary><div className="mt-4 space-y-4"><label className="block">SEO 標題<input className={field} maxLength={180} value={editing.seo_title || ""} onChange={(event) => setEditing({ ...editing, seo_title: event.target.value })} /></label><label className="block">SEO 說明<textarea className={`${field} min-h-24`} maxLength={500} value={editing.seo_description || ""} onChange={(event) => setEditing({ ...editing, seo_description: event.target.value })} /></label></div></details>
      <button className={button} disabled={busy || !writable}>{busy ? "儲存中…" : "儲存修改"}</button>
    </form> : <>
      <div className="flex flex-wrap gap-4">
        <button className={button} disabled={busy} onClick={() => load("works")}>作品</button>
        <button className={button} disabled={busy} onClick={() => load("blog_posts")}>觀點</button>
        <button className="underline" disabled={busy} onClick={logout}>登出</button>
      </div>
      <h2 className="my-5 text-xl">{collection === "works" ? "作品" : "觀點"}・共 {total} 筆</h2>
      <ul className="divide-y">{items.map(item => <li key={item.id} className="flex items-center justify-between gap-5 py-5"><div><h3 className="font-semibold">{item.title}</h3><p className="mt-2 text-sm">{item.category} · {item.status}</p></div><button className="shrink-0 underline" disabled={busy} onClick={() => edit(item.id)}>開啟編輯</button></li>)}</ul>
      {!items.length && <p className="py-6">目前沒有可讀取的內容。</p>}
      <div className="mt-5 flex gap-5"><button disabled={busy || page === 0} onClick={() => load(collection, page - 1)}>上一頁</button><span>第 {page + 1} 頁</span><button disabled={busy || (page + 1) * 30 >= total} onClick={() => load(collection, page + 1)}>下一頁</button></div>
    </>}
    <aside className="mt-10 rounded-2xl bg-neutral-100 p-6"><h2 className="font-semibold">圖片準備說明</h2><p className="mt-2">作品封面建議 1200 × 900 px；作品內頁建議寬 1600 px 以上、高度不限。保留原圖比例，不預設裁切。</p><p className="mt-2 text-sm">接受 4 MB 以下的 JPG、PNG、WebP。上傳後自動保留原圖、移除照片定位等非必要資訊，並產生 WebP 網站版。低解析度原圖不會被放大。</p></aside>
  </section>;
}
