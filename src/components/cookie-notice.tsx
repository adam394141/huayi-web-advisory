"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

const KEY = "huayi-cookie-notice-v1";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(KEY, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(KEY, callback);
  };
}
let dismissedInMemory = false;
function snapshot() {
  if (dismissedInMemory) return false;
  try { return localStorage.getItem(KEY) !== "dismissed"; }
  catch { return true; }
}
function serverSnapshot() { return false; }

export function CookieNotice() {
  const visible = useSyncExternalStore(subscribe, snapshot, serverSnapshot);

  function dismiss() {
    // 僅記錄提示已關閉，不代表授權任何追蹤工具。
    try { localStorage.setItem(KEY, "dismissed"); } catch {}
    dismissedInMemory = true;
    window.dispatchEvent(new Event(KEY));
  }

  if (!visible) return null;
  return (
    <aside aria-label="Cookie 使用提醒" className="sticky bottom-0 z-[60] border-t border-black/10 bg-[#FDFCFA] px-5 py-4 shadow-[0_-4px_24px_#00000008]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-[#333]">
          本網站使用cookies為您提供更好的用戶體驗，繼續使用本網站表示您同意我們的
          <Link href="/privacy" className="underline underline-offset-4 hover:text-black focus-visible:outline-2">隱私權政策</Link>
        </p>
        <button onClick={dismiss} className="min-h-11 shrink-0 rounded-full bg-[#FFBF00] px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-[#efb300] focus-visible:outline-2 focus-visible:outline-offset-2">
          我知道了
        </button>
      </div>
    </aside>
  );
}
