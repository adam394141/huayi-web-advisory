"use client";

import { useState, type FormEvent } from "react";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Mail, Clock } from "lucide-react";
import Link from "next/link";
import { CONTACT_INQUIRY_TYPES } from "@/lib/contact-inquiry";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [startedAt, setStartedAt] = useState(() => Date.now());

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          type: data.get("type"),
          message: data.get("message"),
          consent: data.get("consent") === "on",
          website: data.get("website") || "",
          startedAt,
        }),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error || "訊息暫時無法送出，請稍後再試。");
      form.reset();
      setFormState("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "訊息暫時無法送出，請稍後再試。");
      setFormState("error");
    }
  }

  return (
    <>
      {/* Page Header */}
      <Section className="pb-0 pt-20 md:pt-28">
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.4em] text-[var(--color-gold-dark)]">
            CONTACT
          </p>
          <h1 className="mt-4 font-serif text-[2rem] font-semibold text-[var(--color-fg)] md:text-[3rem]">
            聯絡我們。
          </h1>
        </ScrollReveal>
      </Section>

      <Section>
        <div className="grid gap-16 md:grid-cols-[1fr_320px]">
          {/* Form */}
          <ScrollReveal>
            {formState === "success" ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-[var(--radius-module)] bg-[var(--color-surface)] p-12">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-gold)]/10">
                    <Mail className="h-7 w-7 text-[var(--color-gold-dark)]" />
                  </div>
                  <h2 className="mt-6 font-serif text-[1.4rem] font-semibold text-[var(--color-fg)]">
                    已收到您的訊息
                  </h2>
                  <p className="mt-3 text-[16px] text-[var(--color-body)]">
                    我們通常會在 1–2 個工作天內回覆。
                  </p>
                  <button
                    onClick={() => {
                      setStartedAt(Date.now());
                      setFormState("idle");
                    }}
                    className="mt-6 text-[15px] text-[var(--color-gold-dark)] underline underline-offset-4"
                  >
                    重新填寫
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">網站</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-[15px] font-medium text-[var(--color-fg)]"
                  >
                    姓名
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={80}
                    className="w-full rounded-[var(--radius-input)] border border-[var(--color-faint)]/50 bg-white px-4 py-3 text-[16px] text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20"
                    placeholder="您的姓名"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[15px] font-medium text-[var(--color-fg)]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    className="w-full rounded-[var(--radius-input)] border border-[var(--color-faint)]/50 bg-white px-4 py-3 text-[16px] text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="mb-2 block text-[15px] font-medium text-[var(--color-fg)]"
                  >
                    公司名稱
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    maxLength={120}
                    className="w-full rounded-[var(--radius-input)] border border-[var(--color-faint)]/50 bg-white px-4 py-3 text-[16px] text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20"
                    placeholder="公司或品牌名稱"
                  />
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="mb-2 block text-[15px] font-medium text-[var(--color-fg)]"
                  >
                    諮詢類型
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    className="w-full rounded-[var(--radius-input)] border border-[var(--color-faint)]/50 bg-white px-4 py-3 text-[16px] text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      請選擇
                    </option>
                    {CONTACT_INQUIRY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-[15px] font-medium text-[var(--color-fg)]"
                  >
                    訊息內容
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    minLength={10}
                    maxLength={5000}
                    className="w-full resize-none rounded-[var(--radius-input)] border border-[var(--color-faint)]/50 bg-white px-4 py-3 text-[16px] text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20"
                    placeholder="請簡述您的需求..."
                  />
                  <p className="mt-2 text-[13px] leading-6 text-[var(--color-subtle)]">
                    請勿填寫身分證、金融帳號、醫療資料或其他敏感個人資訊。
                  </p>
                </div>

                <label className="flex items-start gap-3 text-[14px] leading-6 text-[var(--color-body)]">
                  <input
                    name="consent"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-gold-dark)]"
                  />
                  <span>
                    我已閱讀
                    <Link href="/privacy" className="mx-1 underline underline-offset-4" target="_blank">
                      隱私權政策
                    </Link>
                    ，並同意華翼為回覆本次詢問處理上述資料。
                  </span>
                </label>

                <div aria-live="polite" className="min-h-6">
                  {formState === "error" ? (
                    <p className="text-[14px] text-red-700">{errorMessage}</p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="rounded-[var(--radius-button)] bg-[var(--color-fg)] px-8 py-3.5 text-[15px] tracking-wider text-white transition-colors hover:bg-[var(--color-gold-dark)] disabled:cursor-wait disabled:opacity-60"
                >
                  {formState === "submitting" ? "送出中…" : "送出"}
                </button>
              </form>
            )}
          </ScrollReveal>

          {/* Side Info */}
          <ScrollReveal delay={0.1}>
            <div className="space-y-8">
              <div className="rounded-[var(--radius-card)] bg-[var(--color-surface)] p-6">
                <Mail
                  className="h-5 w-5 text-[var(--color-gold-dark)]"
                  strokeWidth={1.5}
                />
                <p className="mt-3 text-[12px] tracking-[0.15em] text-[var(--color-subtle)]">
                  EMAIL
                </p>
                <a
                  href="mailto:888@huayi.tw"
                  className="mt-1 block text-[16px] text-[var(--color-fg)] transition-colors hover:text-[var(--color-gold-dark)]"
                >
                  888@huayi.tw
                </a>
              </div>

              <div className="rounded-[var(--radius-card)] bg-[var(--color-surface)] p-6">
                <Clock
                  className="h-5 w-5 text-[var(--color-gold-dark)]"
                  strokeWidth={1.5}
                />
                <p className="mt-3 text-[12px] tracking-[0.15em] text-[var(--color-subtle)]">
                  回覆時間
                </p>
                <p className="mt-1 text-[16px] text-[var(--color-body)]">
                  通常在 1-2 個工作天內回覆
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Section>
    </>
  );
}
