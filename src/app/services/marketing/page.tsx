import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "品牌行銷與商業成長｜華翼品牌策略",
  description: "整合 Facebook 與 Google 廣告投放、社群經營與內容行銷，不只做曝光，更聚焦轉換與實際商業成長。",
  alternates: { canonical: "/services/marketing" },
  keywords: ["廣告投放", "Facebook廣告", "Google廣告", "社群經營", "內容行銷", "行銷漏斗", "華翼"],
};

const DELIVERABLES = [
  "Facebook / Google 廣告投放與優化",
  "社群經營策略與內容規劃",
  "內容行銷與 SEO 文章",
  "數據分析與成效報表",
  "行銷漏斗建置",
  "廣告素材製作建議",
];

const STEPS = [
  { num: "01", title: "現況分析", desc: "檢視目前的行銷管道、廣告帳戶、社群表現，找出最大的改善空間。" },
  { num: "02", title: "策略規劃", desc: "根據預算與目標，規劃廣告投放策略、內容主題與發布節奏。" },
  { num: "03", title: "執行與優化", desc: "上線投放後持續監測數據，每週優化素材、受眾與出價策略。" },
  { num: "04", title: "成效報告", desc: "每月提供完整成效報表，用數據說話，讓你知道每一塊錢花在哪。" },
];

const FITS = [
  "有預算投廣告，但不知道怎麼投才有效",
  "社群經營了很久，但互動率和轉換率一直上不來",
  "想建立穩定的內容行銷系統，而不是偶爾發一篇文章",
];

export default function MarketingPage() {
  return (
    <>
      <Section className="pb-0 pt-20 md:pt-28">
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.4em] text-[var(--color-gold-dark)]">MARKETING</p>
          <h1 className="mt-4 font-serif text-[2rem] font-semibold text-[var(--color-fg)] md:text-[3rem]">品牌行銷與商業成長</h1>
          <p className="mt-2 text-[16px] text-[var(--color-body)]">不只做曝光，更聚焦轉換與成長</p>
        </ScrollReveal>
      </Section>

      <Section>
        <ScrollReveal>
          <Image src="/services/marketing.png" alt="行銷數據分析與廣告成效報表" width={1200} height={600} className="w-full rounded-[var(--radius-card)] object-cover" priority />
        </ScrollReveal>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <ScrollReveal delay={0.1}>
            <div className="space-y-5 text-[16px] leading-[1.9] text-[var(--color-body)]">
              <p>很多中小企業的行銷困境是：花了錢投廣告，但不知道效果好不好；社群經營了半年，粉絲數成長但業績沒動。問題不在工具，在於沒有人把策略、執行和數據串在一起。</p>
              <p>華翼的行銷服務整合 Facebook 與 Google 廣告投放、社群經營與內容行銷，讓每一筆預算都有明確的目標——不是追求曝光數字，而是追求實際的詢問、轉換與營收成長。</p>
              <p>每一次投放都有數據追蹤、每一次優化都有依據。我們不會告訴你「再等等就好了」，而是用數據告訴你哪裡該加碼、哪裡該停損。讓行銷預算變成資產，而不是被消耗。</p>
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
