import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "企業 AI 導入｜華翼品牌策略",
  description: "協助企業找到 AI 真正能創造價值的切入點。從導入評估、企業內訓到流程自動化，不賣工具，教你的團隊會用。",
  alternates: { canonical: "/services/ai" },
  keywords: ["AI導入", "企業AI", "AI內訓", "數位轉型", "流程自動化", "AI工具", "華翼"],
};

const DELIVERABLES = [
  "AI 導入評估報告",
  "企業內訓課程",
  "MVP 系統快速開發",
  "流程自動化方案",
  "AI 內容產出系統",
  "團隊 AI 工具教學",
];

const STEPS = [
  { num: "01", title: "痛點盤點", desc: "找出企業目前最耗時、最低效的環節，評估 AI 能省多少時間。" },
  { num: "02", title: "工具選擇", desc: "不推銷特定工具，根據你的團隊能力和預算，選最適合的方案。" },
  { num: "03", title: "現場教學", desc: "到你的辦公室，帶著團隊實際操作，不是看投影片，是直接上手。" },
  { num: "04", title: "流程嵌入", desc: "把 AI 工具嵌進日常工作流程，讓團隊自然而然地使用，不是多一件事。" },
];

const FITS = [
  "知道 AI 很重要，但不知道從哪裡開始",
  "團隊對 AI 工具陌生，需要有人帶著學",
  "想用 AI 提升內容產出、客服回覆或資料處理效率",
];

export default function AiPage() {
  return (
    <>
      <Section className="pb-0 pt-20 md:pt-28">
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.4em] text-[var(--color-gold-dark)]">AI INTEGRATION</p>
          <h1 className="mt-4 font-serif text-[2rem] font-semibold text-[var(--color-fg)] md:text-[3rem]">企業 AI 導入</h1>
          <p className="mt-2 text-[16px] text-[var(--color-body)]">不賣工具，教你的團隊會用</p>
        </ScrollReveal>
      </Section>

      <Section>
        <ScrollReveal>
          <Image src="/services/ai.png" alt="AI 講師帶領企業員工操作 AI 工具" width={1200} height={600} className="w-full rounded-[var(--radius-card)] object-cover" priority />
        </ScrollReveal>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <ScrollReveal delay={0.1}>
            <div className="space-y-5 text-[16px] leading-[1.9] text-[var(--color-body)]">
              <p>台灣中小企業導入 AI 最常卡在三件事：預算有限、技術門檻、不知道從哪開始。很多老闆買了工具、上了課，回到公司還是不知道怎麼用。</p>
              <p>華翼的做法不一樣——我們不賣工具，而是到你的辦公室裡，帶著你的團隊從實際工作出發。客服回覆太慢？內容產出太慢？報表整理太花時間？我們先找到痛點最明顯的環節，再選對工具、教會團隊、嵌入流程。</p>
              <p>三個月後，你的團隊能自己用 AI 完成過去要花三倍時間的工作。不需要請工程師，不需要買昂貴的系統，用現有的工具就能做到。</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="rounded-[var(--radius-card)] border border-[var(--color-faint)]/30 p-8">
              <p className="text-[12px] tracking-[0.15em] text-[var(--color-subtle)]">主要交付項目</p>
              <ul className="mt-5 space-y-3">
                {DELIVERABLES.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-[16px] text-[var(--color-body)]">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold)]" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      <Section className="bg-[var(--color-surface)]">
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.3em] text-[var(--color-subtle)]">WHO IS THIS FOR</p>
          <h2 className="mt-3 font-serif text-[1.4rem] font-semibold text-[var(--color-fg)] md:text-[1.8rem]">適合什麼樣的企業</h2>
        </ScrollReveal>
        <div className="mt-8 space-y-4">
          {FITS.map((f, i) => (
            <ScrollReveal key={i} delay={i * 0.06}>
              <div className="flex items-start gap-4 rounded-[var(--radius-card)] border border-[var(--color-faint)]/30 bg-[var(--color-warm-white)] px-6 py-5">
                <span className="mt-0.5 text-[var(--color-gold)]">✓</span>
                <p className="text-[16px] text-[var(--color-body)]">{f}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section>
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.3em] text-[var(--color-subtle)]">HOW WE WORK</p>
          <h2 className="mt-3 font-serif text-[1.4rem] font-semibold text-[var(--color-fg)] md:text-[1.8rem]">我們的做法</h2>
        </ScrollReveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {STEPS.map((s, i) => (
            <ScrollReveal key={s.num} delay={i * 0.06}>
              <div className="rounded-[var(--radius-card)] border border-[var(--color-faint)]/30 p-6">
                <span className="text-[2rem] font-light text-[var(--color-faint)]/40">{s.num}</span>
                <h3 className="mt-2 text-[16px] font-semibold text-[var(--color-fg)]">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-body)]">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section className="bg-[var(--color-surface)] text-center">
        <ScrollReveal>
          <h2 className="font-serif text-[1.4rem] text-[var(--color-fg)] md:text-[1.8rem]">先預約企業體檢，讓我們了解你的現況</h2>
          <p className="mt-8">
            <Link href="/contact" className="inline-block rounded-[var(--radius-button)] bg-[var(--color-fg)] px-8 py-3.5 text-[15px] tracking-wider text-white transition-colors hover:bg-[var(--color-gold-dark)]">
              預約企業體檢
            </Link>
          </p>
        </ScrollReveal>
      </Section>
    </>
  );
}
