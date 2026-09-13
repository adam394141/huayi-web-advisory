"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

type Item = { id: string; title: string; category: string; status: string; cover_image: string | null; updated_at: string };

export function AdminConsole({ configured }: { configured: boolean }) {
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
      setItems(result.items); setTotal(result.total || 0); setPage(nextPage); setCollection(nextCollection); setSignedIn(true);
    } catch { setMessage("連線失敗，未變更任何資料。"); }
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
    finally { setSignedIn(false); setFactorId(""); setQr(""); setPassword(""); setCode(""); setItems([]); setTotal(0); setMessage(""); setBusy(false); }
  }

  const field = "mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base";
  const button = "rounded-full bg-neutral-900 px-6 py-3 text-white disabled:opacity-40";
  return <section className="mx-auto max-w-5xl px-6 py-12">
    <Image src="/brand/huayi-logo.svg" alt="華翼品牌策略" width={150} height={60} className="mb-6 h-auto" />
    <h1 className="text-3xl font-semibold">內容管理</h1>
    <p className="mt-3 text-neutral-600">作品與觀點分開管理；講師頁與 ADS 不在此操作。</p>
    <div className="my-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
      {configured ? "目前為安全唯讀階段，新增、發布、排序與還原尚未啟用。" : "後台建置中：管理員授權與資料庫權限尚未驗收，登入及寫入未開放。"}
    </div>
    {message && <p role="alert" className="my-4 text-red-700">{message}</p>}
    {!signedIn ? <div className="max-w-md">
      {!factorId ? <form onSubmit={login} className="space-y-5">
        <label className="block">管理員 Email<input className={field} type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} disabled={!configured || busy} /></label>
        <label className="block">密碼<input className={field} type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} disabled={!configured || busy} /></label>
        <button className={button} disabled={!configured || busy}>登入並進行雙重驗證</button>
      </form> : <form onSubmit={verify} className="space-y-5">
        {qr && <><p>請使用驗證器 App 掃描後輸入六位數驗證碼。請勿分享這個 QR Code。</p><Image unoptimized src={qr} alt="雙重驗證設定 QR Code" width={240} height={240} /></>}
        <label className="block">驗證碼<input className={field} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required maxLength={6} value={code} onChange={e => setCode(e.target.value)} /></label>
        <button className={button} disabled={busy}>驗證</button>
        <button type="button" className="ml-4 underline" disabled={busy} onClick={logout}>取消並登出</button>
      </form>}
      <p className="mt-5 text-sm text-neutral-600">不開放自行註冊。帳號或驗證器遺失時，由 Supabase 專案管理者確認身分後處理；不能跳過雙重驗證。</p>
    </div> : <>
      <div className="flex flex-wrap gap-4">
        <button className={button} disabled={busy} onClick={() => load("works")}>作品</button>
        <button className={button} disabled={busy} onClick={() => load("blog_posts")}>觀點</button>
        <button className="underline" disabled={busy} onClick={logout}>登出</button>
      </div>
      <h2 className="my-5 text-xl">{collection === "works" ? "作品" : "觀點"}・共 {total} 筆</h2>
      <ul className="divide-y">{items.map(item => <li key={item.id} className="py-5"><h3 className="font-semibold">{item.title}</h3><p className="mt-2 text-sm">{item.category} · {item.status}</p></li>)}</ul>
      {!items.length && <p className="py-6">目前沒有可讀取的內容。</p>}
      <div className="mt-5 flex gap-5"><button disabled={busy || page === 0} onClick={() => load(collection, page - 1)}>上一頁</button><span>第 {page + 1} 頁</span><button disabled={busy || (page + 1) * 30 >= total} onClick={() => load(collection, page + 1)}>下一頁</button></div>
    </>}
    <aside className="mt-10 rounded-2xl bg-neutral-100 p-6"><h2 className="font-semibold">圖片準備說明</h2><p className="mt-2">作品封面建議 1200 × 900 px；作品內頁建議寬 1600 px 以上、高度不限。保留原圖比例，不預設裁切。</p><p className="mt-2 text-sm">上傳與實際尺寸檢查尚在製作中。低解析度原圖不能靠放大改善清晰度。</p></aside>
  </section>;
}
