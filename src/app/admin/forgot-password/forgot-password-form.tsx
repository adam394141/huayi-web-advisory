"use client";

import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
      );
      const cmsBaseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || window.location.origin;
      await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${cmsBaseUrl.replace(/\/$/, "")}/admin/reset-password`,
      });
      // 不洩漏帳號是否存在，成功與失敗採相同畫面訊息。
      setMessage("如果這個 Email 是有效的管理員帳號，系統會寄出重設密碼信。請檢查收件匣與垃圾郵件。");
    } catch {
      setMessage("如果這個 Email 是有效的管理員帳號，系統會寄出重設密碼信。請稍後檢查信箱。");
    } finally {
      setBusy(false);
    }
  }

  const field = "mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base";
  const button = "rounded-full bg-neutral-900 px-6 py-3 text-white disabled:opacity-40";

  return <main className="mx-auto max-w-md px-6 py-12">
    <Image src="/brand/huayi-logo.svg" alt="華翼品牌策略" width={150} height={60} className="mb-6 h-auto" />
    <h1 className="text-3xl font-semibold">重設後台密碼</h1>
    <p className="mt-3 text-neutral-600">輸入管理員 Email，我們會寄出一次性重設連結。</p>
    {message && <p role="status" className="my-5 rounded-xl bg-amber-50 p-4">{message}</p>}
    <form onSubmit={submit} className="mt-6 space-y-5">
      <label className="block">管理員 Email
        <input className={field} type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} disabled={busy} />
      </label>
      <button className={button} disabled={busy}>{busy ? "寄送中…" : "寄送重設信"}</button>
    </form>
    <p className="mt-6 text-sm"><Link className="underline" href="/admin">返回後台登入</Link></p>
  </main>;
}
