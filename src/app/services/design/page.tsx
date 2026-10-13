import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "品牌體驗與設計｜華翼品牌策略",
  description: "從品牌識別到包裝設計，打造一致且有記憶點的品牌體驗。23 年設計實戰，跨八大產業，讓品牌不用再解釋。",
  alternates: { canonical: "/services/design" },
  keywords: ["品牌設計", "CIS", "品牌識別", "包裝設計", "活動主視覺", "品牌體驗", "華翼"],
};

const DELIVERABLES = [
  "CIS 品牌識別系統",
  "包裝設計",
  "活動主視覺設計",
  "品牌周邊設計",
  "品牌應用規範",
  "印刷品製作管理",
];

const STEPS = [
  { num: "01", title: "品牌訪談", desc: "了解你的品牌核心、目標受眾、使用場景，確保設計方向對準策略。" },
  { num: "02", title: "設計提案", desc: "提出 2-3 組設計方案，說明每個方案的策略邏輯，而不只是美不美。" },
  { num: "03", title: "細節修正", desc: "根據回饋精修，確保每個接觸點——名片、包裝、網站——都一致。" },
  { num: "04", title: "規範交付", desc: "完整的品牌應用規範，讓你的團隊或新進設計師都能正確使用。" },
];

const FITS = [
  "品牌形象老舊，想做全面的視覺升級",
  "新品牌或新產品線需要從零建立識別系統",
  "有設計但不一致——名片、網站、包裝各做各的",
];

export default function DesignPage() {
  return (
    <>
      <Section className="pb-0 pt-20 md:pt-28">
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.4em] text-[var(--color-gold-dark)]">DESIGN</p>
          <h1 className="mt-4 font-serif text-[2rem] font-semibold text-[var(--color-fg)] md:text-[3rem]">品牌體驗與設計</h1>
          <p className="mt-2 text-[16px] text-[var(--color-body)]">不只好看，更要被市場記住</p>
        </ScrollReveal>
      </Section>

      <Section>
        <ScrollReveal>
          <Image src="/services/design.png" alt="品牌設計提案與色票排列" width={1200} height={600} className="w-full rounded-[var(--radius-card)] object-cover" priority />
        </ScrollReveal>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <ScrollReveal delay={0.1}>
            <div className="space-y-5 text-[16px] leading-[1.9] text-[var(--color-body)]">
              <p>很多企業花了錢做設計，Logo 很漂亮、包裝很好看，但放到市場上就是沒有辨識度。原因不是設計能力不夠，而是設計沒有對準品牌策略——做出來的東西好看但沒有靈魂。</p>
              <p>華翼的品牌設計從策略出發，先搞清楚你要傳遞什麼，再決定怎麼呈現。23 年的設計實戰經驗，跨補教、科技、百貨、連鎖餐飲、製造等八大產業，讓每一個視覺接觸點都能傳遞品牌的核心價值。</p>
              <p>做完品牌設計後，你的品牌會有一致的面貌——從名片到包裝、從網站到活動現場，市場一眼認出你。不用再解釋，設計自己會說話。</p>
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
