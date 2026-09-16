"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { RichTextEditor } from "./rich-text-editor";
import { CoverImageUploader } from "./cover-image-uploader";
import { getAdminPreview } from "@/lib/admin-preview";
import { AiOptimizationPanel } from "./ai-optimization-panel";
import { ContentVersionPanel } from "./content-version-panel";
import { MediaLibrary } from "./media-library";

type Item = {
  id: string; title: string; slug: string; category: string; status: string; cover_image: string | null; updated_at: string;
  client?: string | null; author?: string | null; published_at?: string | null;
};
type EditorItem = Item & {
  slug: string; content: string | null; show_on_homepage: boolean | null; sort_order: number | null;
  description?: string | null; client?: string | null; design_rationale?: string | null;
  excerpt?: string | null; author?: string | null; seo_title?: string | null; seo_description?: string | null;
  tags?: string[]; faq?: Array<{ question: string; answer: string }>; ai_summary?: string | null;
};

const SAVE_TIMEOUT_MS = 30_000;
type ListFilters = { query: string; category: string; status: string; sort: "site" | "updated" };
const EMPTY_FILTERS: ListFilters = { query: "", category: "", status: "", sort: "site" };
const STATUS_LABELS: Record<string, string> = { draft: "草稿", preview: "預覽", approved: "已核准", published: "已發布", archived: "封存" };
const STATUS_STYLES: Record<string, string> = {
  draft: "border-neutral-300 bg-neutral-50 text-neutral-700",
  preview: "border-blue-300 bg-blue-50 text-blue-800",
  approved: "border-amber-300 bg-amber-50 text-amber-900",
  published: "border-green-300 bg-green-50 text-green-800",
  archived: "border-neutral-300 bg-neutral-200 text-neutral-700",
};

async function saveRequest(input: RequestInfo | URL, init: RequestInit) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), SAVE_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
}

export function AdminConsole({ configured, writeConfigured, aiConfigured }: { configured: boolean; writeConfigured: boolean; aiConfigured: boolean }) {
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
  const [section, setSection] = useState<"content" | "media">("content");
  const [items, setItems] = useState<Item[]>([]);
  const [filters, setFilters] = useState<ListFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<ListFilters>(EMPTY_FILTERS);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [writable, setWritable] = useState(writeConfigured);
  const [editing, setEditing] = useState<EditorItem | null>(null);
  const [original, setOriginal] = useState<EditorItem | null>(null);
  const [message, setMessage] = useState("");
  const [saveNotice, setSaveNotice] = useState<{ kind: "pending" | "success" | "error" | "info"; text: string } | null>(null);
  const [publishNotice, setPublishNotice] = useState<{ kind: "success" | "error"; text: string; href?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [needsReload, setNeedsReload] = useState(false);

  useEffect(() => () => { client.auth.stopAutoRefresh(); }, [client]);
  const getAccessToken = useCallback(async () => (await client.auth.getSession()).data.session?.access_token || "", [client]);

  async function load(nextCollection = collection, nextPage = 0, nextFilters = filters) {
    setBusy(true); setMessage(""); setPublishNotice(null); setSaveNotice(null);
    try {
      const { data } = await client.auth.getSession();
      const params = new URLSearchParams({ collection: nextCollection, page: String(nextPage), sort: nextFilters.sort });
      if (nextFilters.query.trim()) params.set("q", nextFilters.query.trim());
      if (nextFilters.category.trim()) params.set("category", nextFilters.category.trim());
      if (nextFilters.status) params.set("status", nextFilters.status);
      const response = await fetch(`/api/cms?${params.toString()}`, {
        headers: { Authorization: `Bearer ${data.session?.access_token || ""}` }, cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) { setItems([]); setTotal(0); setMessage(result.error); return; }
      setItems(result.items); setTotal(result.total || 0); setPage(nextPage); setCollection(nextCollection); setSection("content"); setAppliedFilters(nextFilters); setSignedIn(true); setWritable(!!result.writable); setEditing(null); setOriginal(null);
    } catch { setMessage("連線失敗，未變更任何資料。"); }
    finally { setBusy(false); }
  }

  function switchCollection(nextCollection: "works" | "blog_posts") {
    setFilters(EMPTY_FILTERS);
    void load(nextCollection, 0, EMPTY_FILTERS);
  }

  function openMediaLibrary() {
    setSection("media"); setEditing(null); setOriginal(null); setMessage(""); setSaveNotice(null); setPublishNotice(null);
  }

  function submitFilters(event: FormEvent) {
    event.preventDefault();
    void load(collection, 0, filters);
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
    void load(collection, 0, EMPTY_FILTERS);
  }

  async function edit(id: string) {
    setBusy(true); setMessage(""); setPublishNotice(null); setSaveNotice(null);
    try {
      const { data } = await client.auth.getSession();
      const response = await fetch(`/api/cms?collection=${collection}&id=${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${data.session?.access_token || ""}` }, cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error); return; }
      setEditing(result.item); setOriginal(result.item); setWritable(!!result.writable);
      setNeedsReload(false);
    } catch { setMessage("無法開啟內容，未變更任何資料。"); }
    finally { setBusy(false); }
  }

  async function createContent() {
    setBusy(true); setMessage(""); setPublishNotice(null); setSaveNotice(null);
    try {
      const { data } = await client.auth.getSession();
      const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
      const isWork = collection === "works";
      const response = await fetch("/api/cms", {
        method: "POST", cache: "no-store",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token || ""}` },
        body: JSON.stringify(isWork
          ? { collection: "works", title: "未命名作品", slug: `work-draft-${stamp}`, category: "設計專案", client: "" }
          : { collection: "blog_posts", title: "未命名觀點", slug: `article-draft-${stamp}`, category: "品牌觀點", author: "華翼品牌策略" }),
      });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error); return; }
      setEditing(result.item); setOriginal(result.item); setNeedsReload(false);
      setItems((current) => [result.item, ...current]); setTotal((current) => current + 1);
      setMessage(`已建立${isWork ? "作品" : "觀點"}草稿，請先修改標題與英文網址代稱。`);
    } catch { setMessage("無法新增草稿，既有內容沒有被修改。"); }
    finally { setBusy(false); }
  }

  function acceptServerItem(item: Record<string, unknown>) {
    const next = item as EditorItem;
    setEditing(next); setOriginal(next); setNeedsReload(false);
    setItems((current) => current.map((entry) => entry.id === next.id ? { ...entry, ...next } : entry));
  }

  async function prepareArticleForAi() {
    if (!editing || !original || collection !== "blog_posts") throw new Error("目前文章尚未準備完成。");
    const common = ["title", "slug", "category", "content", "cover_image", "status", "show_on_homepage", "sort_order", "seo_title", "seo_description"] as const;
    const specific = ["excerpt", "author"] as const;
    const changes: Record<string, string | number | boolean | null> = {};
    for (const key of [...common, ...specific]) {
      const next = editing[key] ?? (key === "sort_order" ? 0 : key === "show_on_homepage" ? false : "");
      const previous = original[key] ?? (key === "sort_order" ? 0 : key === "show_on_homepage" ? false : "");
      if (next !== previous) changes[key] = next;
    }
    if (!Object.keys(changes).length) return original.updated_at;
    const { data } = await client.auth.getSession();
    const response = await saveRequest("/api/cms", {
      method: "PATCH", cache: "no-store",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token || ""}` },
      body: JSON.stringify({ collection, id: editing.id, expected_updated_at: original.updated_at, changes }),
    });
    const result = await response.json();
    if (!response.ok) {
      setNeedsReload(response.status === 409);
      throw new Error(result.error || "自動儲存失敗，AI 尚未開始。");
    }
    acceptServerItem(result.item);
    setMessage("已自動儲存目前內容，AI 優化已接續開始。");
    return result.item.updated_at as string;
  }

  async function publishArticle() {
    if (!editing || !original || collection !== "blog_posts") return;
    if (JSON.stringify(editing) !== JSON.stringify(original)) { setMessage("請先儲存目前修改，再執行發布檢查。"); return; }
    if (!window.confirm("確定要通過發布檢查並公開這篇文章？")) return;
    setBusy(true); setMessage(""); setPublishNotice(null);
    try {
      const { data } = await client.auth.getSession();
      const response = await fetch(`/api/cms/publish/${editing.id}`, {
        method: "POST", cache: "no-store",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token || ""}` },
        body: JSON.stringify({ expected_updated_at: original.updated_at }),
      });
      const result = await response.json();
      if (!response.ok) {
        setNeedsReload(response.status === 409);
        setPublishNotice({ kind: "error", text: result.error || "發布失敗，文章仍維持原狀態。" });
        return;
      }
      acceptServerItem(result.item);
      const publishedPreview = getAdminPreview("blog_posts", result.item.status, result.item.slug);
      setPublishNotice({
        kind: "success",
        text: "文章已發布成功，前台可能需要數秒完成更新。",
        href: publishedPreview.href || undefined,
      });
    } catch { setPublishNotice({ kind: "error", text: "發布連線失敗，文章仍維持原狀態。" }); }
    finally { setBusy(false); }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!editing || !original) return;
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const shouldOpenPreview = submitter?.value === "save-preview";
    const requestedPreview = getAdminPreview(collection, editing.status, editing.slug);
    const common = ["title", "slug", "category", "content", "cover_image", "status", "show_on_homepage", "sort_order", "seo_title", "seo_description"] as const;
    const specific = collection === "works" ? ["description", "client", "design_rationale"] as const : ["excerpt", "author"] as const;
    const changes: Record<string, string | number | boolean | null> = {};
    for (const key of [...common, ...specific]) {
      const next = editing[key] ?? (key === "sort_order" ? 0 : key === "show_on_homepage" ? false : "");
      const previous = original[key] ?? (key === "sort_order" ? 0 : key === "show_on_homepage" ? false : "");
      if (next !== previous) changes[key] = next;
    }
    if (!Object.keys(changes).length) {
      if (shouldOpenPreview && requestedPreview.href) {
        window.open(requestedPreview.href, "_blank", "noopener,noreferrer");
        setSaveNotice({ kind: "info", text: "沒有需要儲存的變更，已在新分頁開啟前台頁面。" });
      } else {
        setSaveNotice({ kind: "info", text: "沒有需要儲存的變更。" });
      }
      return;
    }
    let previewWindow: Window | null = null;
    if (shouldOpenPreview && requestedPreview.href) {
      // 必須在使用者點擊觸發的同步階段先開分頁，否則儲存完成後容易被瀏覽器阻擋。
      previewWindow = window.open("about:blank", "_blank");
      if (previewWindow) {
        previewWindow.opener = null;
        previewWindow.document.title = "正在更新前台預覽…";
        previewWindow.document.body.textContent = "正在儲存並更新前台預覽，請稍候…";
      }
    }
    setBusy(true); setMessage(""); setSaveNotice({ kind: "pending", text: "正在安全儲存，請稍候…" });
    try {
      const { data } = await client.auth.getSession();
      const response = await saveRequest("/api/cms", {
        method: "PATCH", cache: "no-store",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token || ""}` },
        body: JSON.stringify({ collection, id: editing.id, expected_updated_at: original.updated_at, changes }),
      });
      const result = await response.json();
      if (!response.ok) {
        previewWindow?.close();
        setNeedsReload(response.status === 409);
        setSaveNotice({ kind: "error", text: result.error || "儲存失敗，畫面內容仍保留。" });
        return;
      }
      setEditing(result.item); setOriginal(result.item);
      setItems((current) => current.map((item) => item.id === result.item.id ? { ...item, ...result.item } : item));
      setNeedsReload(false);
      if (shouldOpenPreview) {
        const savedPreview = getAdminPreview(collection, result.item.status, result.item.slug);
        if (previewWindow && savedPreview.href) {
          const previewUrl = new URL(savedPreview.href, window.location.origin);
          previewUrl.searchParams.set("cms_updated", Date.now().toString());
          previewWindow.location.replace(previewUrl.toString());
          setSaveNotice({ kind: "success", text: `已安全儲存（${new Date().toLocaleTimeString("zh-TW")}），並在新分頁開啟最新前台頁面。` });
        } else {
          previewWindow?.close();
          setSaveNotice({ kind: "success", text: previewWindow
            ? `已安全儲存（${new Date().toLocaleTimeString("zh-TW")}），但目前狀態無法開啟公開前台。`
            : `已安全儲存（${new Date().toLocaleTimeString("zh-TW")}）；瀏覽器阻擋了新分頁，請使用上方的「開啟前台」按鈕。` });
        }
      } else {
        setSaveNotice({ kind: "success", text: `已安全儲存（${new Date().toLocaleTimeString("zh-TW")}），修改前版本已保留。` });
      }
    } catch (error) {
      previewWindow?.close();
      const timedOut = error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
      setSaveNotice({ kind: "error", text: timedOut
        ? "儲存等待超過 30 秒，已停止等待；畫面內容仍保留。請稍候再返回列表確認，避免立刻重複儲存。"
        : "儲存失敗，畫面內容仍保留，未確認任何資料變更。" });
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
  const nextPreview = editing ? getAdminPreview(collection, editing.status, editing.slug) : preview;
  const hasFilters = !!(appliedFilters.query || appliedFilters.category || appliedFilters.status || appliedFilters.sort !== "site");
  const categorySuggestions = Array.from(new Set(items.map((item) => item.category).filter(Boolean))).sort((a, b) => a.localeCompare(b, "zh-Hant"));
  return <section className="mx-auto max-w-5xl px-6 py-12">
    <Image src="/brand/huayi-logo.svg" alt="華翼品牌策略" width={150} height={60} className="mb-6 h-auto" />
    <h1 className="text-3xl font-semibold">內容管理</h1>
    <p className="mt-3 text-neutral-600">作品與觀點分開管理；講師頁與 ADS 不在此操作。</p>
    <div className="my-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
      {configured ? (writable ? "已開放作品編輯、觀點新增、圖片上傳、AI 審核、版本還原與人工發布檢查。" : "目前為安全唯讀階段，新增、發布、排序與還原尚未啟用。") : "後台建置中：管理員授權與資料庫權限尚未驗收，登入及寫入未開放。"}
    </div>
    {message && <div role="alert" className="my-4 flex flex-wrap items-center gap-3 text-red-700"><p>{message}</p>{needsReload && editing && <button type="button" className="rounded-full border border-red-700 px-4 py-2 text-sm" disabled={busy} onClick={() => edit(editing.id)}>載入資料庫最新版本</button>}</div>}
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
    </div> : editing ? <form onSubmit={save} onInvalid={() => setSaveNotice({ kind: "error", text: "尚有必填欄位或網址格式不正確；系統已標示並移到第一個問題欄位。" })} className="max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" className="underline" disabled={busy} onClick={() => { setEditing(null); setOriginal(null); setMessage(""); setSaveNotice(null); setPublishNotice(null); setNeedsReload(false); }}>← 返回列表</button>
        {preview.href ? <a className="rounded-full border border-neutral-900 px-4 py-2 text-sm" href={preview.href} target="_blank" rel="noreferrer">開啟已儲存的前台頁面 ↗</a> : <span className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">{preview.reason}</span>}
        <span className="text-sm text-neutral-500">最後更新：{new Date(editing.updated_at).toLocaleString("zh-TW")}</span>
      </div>
      <CoverImageUploader value={editing.cover_image || ""} onChange={(cover_image) => setEditing((current) => current ? { ...current, cover_image } : current)} collection={collection} itemId={editing.id} accessToken={async () => (await client.auth.getSession()).data.session?.access_token || ""} fieldClass={field} />
      <label className="block">標題<input className={field} required maxLength={180} value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} /></label>
      <label className="block">網址代稱（英文小寫、數字、連字號）<input className={field} required maxLength={140} pattern="[a-z0-9]+(?:[-_][a-z0-9]+)*" value={editing.slug} onChange={(event) => setEditing({ ...editing, slug: event.target.value })} /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">分類<input className={field} required maxLength={80} value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value })} /></label>
        <label className="block">狀態<select className={field} value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value })}><option value="draft">草稿</option><option value="preview">預覽</option><option value="approved">已核准</option>{editing.status === "published" && <option value="published">已發布</option>}<option value="archived">封存</option></select></label>
      </div>
      {collection === "works" ? <>
        <label className="block">客戶／專案名稱<input className={field} maxLength={180} value={editing.client || ""} onChange={(event) => setEditing({ ...editing, client: event.target.value })} /></label>
        <label className="block">列表摘要<textarea className={`${field} min-h-28`} maxLength={5000} value={editing.description || ""} onChange={(event) => setEditing({ ...editing, description: event.target.value })} /></label>
        <label className="block">設計說明<textarea className={`${field} min-h-36`} maxLength={20000} value={editing.design_rationale || ""} onChange={(event) => setEditing({ ...editing, design_rationale: event.target.value })} /></label>
      </> : <>
        <label className="block">作者<input className={field} maxLength={180} value={editing.author || ""} onChange={(event) => setEditing({ ...editing, author: event.target.value })} /></label>
        <label className="block">文章摘要<textarea className={`${field} min-h-28`} maxLength={5000} value={editing.excerpt || ""} onChange={(event) => setEditing({ ...editing, excerpt: event.target.value })} /></label>
      </>}
      {collection === "blog_posts" && <AiOptimizationPanel articleId={editing.id} updatedAt={original?.updated_at || editing.updated_at} configured={aiConfigured} hasUnsavedChanges={JSON.stringify(editing) !== JSON.stringify(original)} prepareArticle={prepareArticleForAi} accessToken={async () => (await client.auth.getSession()).data.session?.access_token || ""} onApplied={acceptServerItem} />}
      <RichTextEditor
        key={`${collection}:${editing.id}`}
        value={editing.content || ""}
        onChange={(content) => setEditing((current) => current ? { ...current, content } : current)}
        collection={collection}
        itemId={editing.id}
        accessToken={async () => (await client.auth.getSession()).data.session?.access_token || ""}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">排序值<input className={field} type="number" min={-100000} max={100000} value={editing.sort_order ?? 0} onChange={(event) => setEditing({ ...editing, sort_order: Number(event.target.value) })} /></label>
        <label className="mt-8 flex items-center gap-3"><input type="checkbox" checked={!!editing.show_on_homepage} onChange={(event) => setEditing({ ...editing, show_on_homepage: event.target.checked })} />顯示於首頁</label>
      </div>
      <details className="rounded-xl border border-neutral-200 p-4"><summary className="cursor-pointer">SEO 設定</summary><div className="mt-4 space-y-4"><label className="block">SEO 標題<input className={field} maxLength={180} value={editing.seo_title || ""} onChange={(event) => setEditing({ ...editing, seo_title: event.target.value })} /></label><label className="block">SEO 說明<textarea className={`${field} min-h-24`} maxLength={500} value={editing.seo_description || ""} onChange={(event) => setEditing({ ...editing, seo_description: event.target.value })} /></label></div></details>
      {collection === "blog_posts" && <ContentVersionPanel articleId={editing.id} updatedAt={original?.updated_at || editing.updated_at} accessToken={async () => (await client.auth.getSession()).data.session?.access_token || ""} onRestored={acceptServerItem} />}
      <div className="flex flex-wrap items-center gap-3">
        <button className={button} type="submit" value="save" disabled={busy || !writable}>{busy ? "儲存中…" : "儲存修改"}</button>
        <button className="rounded-full border border-neutral-900 bg-white px-6 py-3 text-neutral-900 disabled:opacity-40" type="submit" value="save-preview" disabled={busy || !writable || !nextPreview.href}>儲存並開啟前台 ↗</button>
        {collection === "blog_posts" && editing.status !== "published" && <button className="rounded-full border border-amber-500 bg-amber-50 px-6 py-3 text-neutral-900 disabled:opacity-40" type="button" disabled={busy || !writable} onClick={publishArticle}>檢查並發布</button>}
        {!nextPreview.href && <span className="text-sm text-neutral-500">{nextPreview.reason}</span>}
      </div>
      {saveNotice && <div role="status" aria-live="polite" className={`rounded-xl border p-4 ${saveNotice.kind === "success" ? "border-green-300 bg-green-50 text-green-900" : saveNotice.kind === "error" ? "border-red-300 bg-red-50 text-red-800" : saveNotice.kind === "pending" ? "border-blue-300 bg-blue-50 text-blue-900" : "border-neutral-300 bg-neutral-50 text-neutral-800"}`}>
        <strong>{saveNotice.kind === "success" ? "儲存完成" : saveNotice.kind === "error" ? "儲存未完成" : saveNotice.kind === "pending" ? "儲存中" : "儲存狀態"}</strong>
        <p className="mt-1">{saveNotice.text}</p>
        {saveNotice.kind === "error" && needsReload && <button type="button" className="mt-3 rounded-full border border-red-700 px-4 py-2 text-sm" disabled={busy} onClick={() => edit(editing.id)}>載入資料庫最新版本</button>}
      </div>}
      {publishNotice && <div role="status" aria-live="polite" className={`rounded-xl border p-4 ${publishNotice.kind === "success" ? "border-green-300 bg-green-50 text-green-900" : "border-red-300 bg-red-50 text-red-800"}`}>
        <strong>{publishNotice.kind === "success" ? "已發布" : "尚未發布"}</strong>
        <p className="mt-1">{publishNotice.text}</p>
        {publishNotice.href && <a className="mt-3 inline-block underline" href={publishNotice.href} target="_blank" rel="noreferrer">開啟已發布文章 ↗</a>}
      </div>}
    </form> : section === "media" ? <>
      <div className="flex flex-wrap gap-4">
        <button className="rounded-full border border-neutral-900 px-6 py-3" disabled={busy} onClick={() => switchCollection("works")}>作品</button>
        <button className="rounded-full border border-neutral-900 px-6 py-3" disabled={busy} onClick={() => switchCollection("blog_posts")}>觀點</button>
        <button className={button} disabled={busy}>媒體庫</button>
        <button className="underline" disabled={busy} onClick={logout}>登出</button>
      </div>
      <MediaLibrary accessToken={getAccessToken} />
    </> : <>
      <div className="flex flex-wrap gap-4">
        <button className={collection === "works" ? button : "rounded-full border border-neutral-900 px-6 py-3"} disabled={busy} onClick={() => switchCollection("works")}>作品</button>
        <button className={collection === "blog_posts" ? button : "rounded-full border border-neutral-900 px-6 py-3"} disabled={busy} onClick={() => switchCollection("blog_posts")}>觀點</button>
        <button className="rounded-full border border-neutral-900 px-6 py-3" disabled={busy} onClick={openMediaLibrary}>媒體庫</button>
        <button className="rounded-full border border-neutral-900 px-6 py-3 disabled:opacity-40" disabled={busy || !writable} onClick={createContent}>＋ 新增{collection === "works" ? "作品" : "觀點"}草稿</button>
        <button className="underline" disabled={busy} onClick={logout}>登出</button>
      </div>
      <form onSubmit={submitFilters} className="mt-6 grid gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 md:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm font-medium">搜尋標題<input className={field} maxLength={100} placeholder={`搜尋${collection === "works" ? "作品" : "觀點"}標題`} value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} /></label>
        <label className="block text-sm font-medium">分類<input className={field} list="cms-category-suggestions" maxLength={80} placeholder="全部分類" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })} /><datalist id="cms-category-suggestions">{categorySuggestions.map((category) => <option key={category} value={category} />)}</datalist></label>
        <label className="block text-sm font-medium">狀態<select className={field} value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">全部狀態</option><option value="draft">草稿</option><option value="preview">預覽</option><option value="approved">已核准</option><option value="published">已發布</option><option value="archived">封存</option></select></label>
        <label className="block text-sm font-medium">排序<select className={field} value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value as ListFilters["sort"] })}><option value="site">網站顯示順序</option><option value="updated">最近修改優先</option></select></label>
        <div className="flex flex-wrap items-center gap-3 md:col-span-2 lg:col-span-4">
          <button className={button} disabled={busy}>套用篩選</button>
          <button type="button" className="rounded-full border border-neutral-400 bg-white px-5 py-3 disabled:opacity-40" disabled={busy || !hasFilters} onClick={clearFilters}>清除條件</button>
        </div>
      </form>
      <div className="my-6 flex flex-wrap items-baseline justify-between gap-3"><h2 className="text-xl">{collection === "works" ? "作品" : "觀點"}・共 {total} 筆</h2><p className="text-sm text-neutral-500">第 {page * 30 + (items.length ? 1 : 0)}–{page * 30 + items.length} 筆</p></div>
      <ul className="grid gap-5">{items.map(item => {
        const itemPreview = getAdminPreview(collection, item.status, item.slug);
        return <li key={item.id} className="grid gap-5 rounded-2xl border border-neutral-200 p-4 sm:grid-cols-[140px_1fr_auto] sm:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
            {item.cover_image ? <Image src={item.cover_image} alt="" fill sizes="140px" className="object-contain" /> : <div className="flex h-full items-center justify-center px-3 text-center text-xs text-neutral-500">尚未設定封面</div>}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full border px-3 py-1 text-xs ${STATUS_STYLES[item.status] || STATUS_STYLES.draft}`}>{STATUS_LABELS[item.status] || item.status}</span><span className="text-sm text-neutral-500">{item.category}</span></div>
            <h3 className="mt-3 font-semibold leading-snug">{item.title}</h3>
            <p className="mt-2 text-sm text-neutral-600">{collection === "works" ? (item.client || "未填客戶／專案名稱") : (item.author || "未填作者")}</p>
            <p className="mt-2 text-xs text-neutral-500">最後修改：{new Date(item.updated_at).toLocaleString("zh-TW")}{collection === "blog_posts" && item.published_at ? ` · 發布：${new Date(item.published_at).toLocaleString("zh-TW")}` : ""}</p>
          </div>
          <div className="flex flex-wrap gap-3 sm:flex-col sm:items-end">
            <button className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-40" disabled={busy} onClick={() => edit(item.id)}>開啟編輯</button>
            {itemPreview.href && <a className="rounded-full border border-neutral-400 px-4 py-2 text-sm" href={itemPreview.href} target="_blank" rel="noreferrer">前台查看 ↗</a>}
          </div>
        </li>;
      })}</ul>
      {!items.length && <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-neutral-600">{hasFilters ? "沒有符合目前篩選條件的內容。" : "目前沒有可讀取的內容。"}</div>}
      <div className="mt-6 flex items-center gap-5"><button className="underline disabled:text-neutral-300" disabled={busy || page === 0} onClick={() => load(collection, page - 1, appliedFilters)}>上一頁</button><span>第 {page + 1} 頁</span><button className="underline disabled:text-neutral-300" disabled={busy || (page + 1) * 30 >= total} onClick={() => load(collection, page + 1, appliedFilters)}>下一頁</button></div>
    </>}
    <aside className="mt-10 rounded-2xl bg-neutral-100 p-6"><h2 className="font-semibold">圖片準備說明</h2><p className="mt-2">作品封面建議 1200 × 900 px；作品內頁建議寬 1600 px 以上、高度不限。保留原圖比例，不預設裁切。</p><p className="mt-2 text-sm">接受 4 MB 以下的 JPG、PNG、WebP。上傳後自動保留原圖、移除照片定位等非必要資訊，並產生 WebP 網站版。低解析度原圖不會被放大。</p></aside>
  </section>;
}
