"use client";

import { useState, type FormEvent } from "react";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Mail, Clock } from "lucide-react";

const INQUIRY_TYPES = [
  "品牌策略",
  "AI 導入",
  "行銷",
  "設計",
  "其他",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* Page Header */}
      <Section className="pb-0 pt-20 md:pt-28">
        <ScrollReveal>
          <p className="text-[10px] tracking-[0.4em] text-[var(--color-gold-dark)]">
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
            {submitted ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-[var(--radius-module)] bg-[var(--color-surface)] p-12">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-gold)]/10">
                    <Mail className="h-7 w-7 text-[var(--color-gold-dark)]" />
                  </div>
                  <h2 className="mt-6 font-serif text-[1.4rem] font-semibold text-[var(--color-fg)]">
                    表單送出測試成功！
                  </h2>
                  <p className="mt-3 text-[14px] text-[var(--color-body)]">
                    （Preview 模式）正式版將會寄送通知。
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-[13px] text-[var(--color-gold-dark)] underline underline-offset-4"
                  >
                    重新填寫
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-[13px] font-medium text-[var(--color-fg)]"
                  >
                    姓名
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-[var(--radius-input)] border border-[var(--color-faint)]/50 bg-white px-4 py-3 text-[14px] text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20"
                    placeholder="您的姓名"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[13px] font-medium text-[var(--color-fg)]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-[var(--radius-input)] border border-[var(--color-faint)]/50 bg-white px-4 py-3 text-[14px] text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="mb-2 block text-[13px] font-medium text-[var(--color-fg)]"
                  >
                    公司名稱
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    className="w-full rounded-[var(--radius-input)] border border-[var(--color-faint)]/50 bg-white px-4 py-3 text-[14px] text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20"
                    placeholder="公司或品牌名稱"
                  />
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="mb-2 block text-[13px] font-medium text-[var(--color-fg)]"
                  >
                    諮詢類型
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    className="w-full rounded-[var(--radius-input)] border border-[var(--color-faint)]/50 bg-white px-4 py-3 text-[14px] text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      請選擇
                    </option>
                    {INQUIRY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-[13px] font-medium text-[var(--color-fg)]"
                  >
                    訊息內容
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full resize-none rounded-[var(--radius-input)] border border-[var(--color-faint)]/50 bg-white px-4 py-3 text-[14px] text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20"
                    placeholder="請簡述您的需求..."
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-[var(--radius-button)] bg-[var(--color-fg)] px-8 py-3.5 text-[13px] tracking-wider text-white transition-colors hover:bg-[var(--color-gold-dark)]"
                >
                  送出
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
                <p className="mt-3 text-[11px] tracking-[0.15em] text-[var(--color-subtle)]">
                  EMAIL
                </p>
                <a
                  href="mailto:hy24687418@gmail.com"
                  className="mt-1 block text-[14px] text-[var(--color-fg)] transition-colors hover:text-[var(--color-gold-dark)]"
                >
                  hy24687418@gmail.com
                </a>
              </div>

              <div className="rounded-[var(--radius-card)] bg-[var(--color-surface)] p-6">
                <Clock
                  className="h-5 w-5 text-[var(--color-gold-dark)]"
                  strokeWidth={1.5}
                />
                <p className="mt-3 text-[11px] tracking-[0.15em] text-[var(--color-subtle)]">
                  回覆時間
                </p>
                <p className="mt-1 text-[14px] text-[var(--color-body)]">
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
