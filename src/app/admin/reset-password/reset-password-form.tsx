"use client";

import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

export function ResetPasswordForm() {
  const [client] = useState(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: true } },
  ));
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("正在驗證重設連結…");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let active = true;
    const { data: listener } = client.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" && session) {
        setReady(true);
        setMessage("");
      }
    });
    client.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session && window.location.hash.includes("type=recovery")) {
        setReady(true);
        setMessage("");
      } else if (!window.location.hash) {
        setMessage("重設連結無效或已過期，請重新申請一封重設信。");
      }
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
      client.auth.stopAutoRefresh();
    };
  }, [client]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (password.length < 12) {
      setMessage("新密碼至少需要 12 個字元。");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("兩次輸入的密碼不一致。");
      return;
    }
    setBusy(true);
    setMessage("");
    const { error } = await client.auth.updateUser({ password });
    setPassword("");
    setConfirmPassword("");
    if (error) {
      setMessage("無法更新密碼；連結可能已過期，請重新申請。");
    } else {
      await client.auth.signOut({ scope: "local" });
      window.history.replaceState(null, "", "/admin/reset-password");
      setCompleted(true);
      setReady(false);
      setMessage("密碼已更新。請返回後台，以新密碼登入並完成雙重驗證。");
    }
    setBusy(false);
  }

  const field = "mt-2 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base";
  const button = "rounded-full bg-neutral-900 px-6 py-3 text-white disabled:opacity-40";

  return <main className="mx-auto max-w-md px-6 py-12">
    <Image src="/brand/huayi-logo.svg" alt="華翼品牌策略" width={150} height={60} className="mb-6 h-auto" />
    <h1 className="text-3xl font-semibold">設定新密碼</h1>
    {message && <p role="status" className="my-5 rounded-xl bg-amber-50 p-4">{message}</p>}
    {ready && !completed && <form onSubmit={submit} className="mt-6 space-y-5">
      <label className="block">新密碼
        <input className={field} type="password" autoComplete="new-password" minLength={12} required value={password} onChange={(event) => setPassword(event.target.value)} disabled={busy} />
      </label>
      <label className="block">再次輸入新密碼
        <input className={field} type="password" autoComplete="new-password" minLength={12} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} disabled={busy} />
      </label>
      <button className={button} disabled={busy}>{busy ? "更新中…" : "更新密碼"}</button>
    </form>}
    <p className="mt-6 text-sm"><Link className="underline" href={completed ? "/admin" : "/admin/forgot-password"}>{completed ? "返回後台登入" : "重新申請重設信"}</Link></p>
  </main>;
}
