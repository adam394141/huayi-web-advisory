import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "品牌策略｜華翼品牌策略",
  description: "從市場研究到品牌定位，協助企業建立清晰的差異化策略。運用 SWOT、STP、4P、品牌金字塔等框架，找出只有你能說的那句話。",
  alternates: { canonical: "/services/brand-strategy" },
  keywords: ["品牌策略", "品牌定位", "差異化", "品牌金字塔", "STP", "競品分析", "華翼"],
};

const DELIVERABLES = [
  "品牌定位報告",
  "市場競品分析",
  "差異化策略方案",
  "品牌金字塔建構",
  "目標客群定義（STP）",
  "落地行動計畫",
];

const STEPS = [
  { num: "01", title: "市場與競品研究", desc: "看清楚你的產業誰在做、怎麼做、還有什麼沒人做。" },
  { num: "02", title: "企業內部訪談", desc: "跟老闆、團隊、甚至客戶聊，找出真正的優勢與盲點。" },
  { num: "03", title: "定位策略產出", desc: "用框架整理出差異化定位、目標客群、品牌金字塔。" },
  { num: "04", title: "落地行動計畫", desc: "不只給報告，給你接下來該做什麼的優先順序。" },
];

const FITS = [
  "做了很多年，但說不清楚自己的品牌跟別人有什麼不同",
  "想從代工轉品牌，不知道從哪開始",
  "二代接班，想重新定義品牌方向",
];

export default function BrandStrategyPage() {
  return (
    <>
      <Section className="pb-0 pt-20 md:pt-28">
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.4em] text-[var(--color-gold-dark)]">BRAND STRATEGY</p>
          <h1 className="mt-4 font-serif text-[2rem] font-semibold text-[var(--color-fg)] md:text-[3rem]">品牌策略</h1>
          <p className="mt-2 text-[16px] text-[var(--color-body)]">找到只有你能說的那句話</p>
        </ScrollReveal>
      </Section>

      <Section>
        <ScrollReveal>
          <Image src="/services/brand-strategy.png" alt="品牌顧問在白板前討論品牌定位策略" width={1200} height={600} className="w-full rounded-[var(--radius-card)] object-cover" priority />
        </ScrollReveal>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <ScrollReveal delay={0.1}>
            <div className="space-y-5 text-[16px] leading-[1.9] text-[var(--color-body)]">
              <p>很多企業做了十幾年，產品品質好、客戶也穩定，但就是說不清楚自己跟別人有什麼不同。提案的時候講不出差異、報價的時候只能比價格、招人的時候說不出公司的吸引力。</p>
              <p>品牌策略不是做一本漂亮的品牌手冊，而是幫你找到那個「只有你能說的那句話」。我們運用 SWOT、STP、4P、品牌金字塔等框架，從市場數據中找出差異化的切入點，讓品牌定位能落地、能執行、能被團隊理解。</p>
              <p>做完品牌策略後，你的團隊會知道：我們是誰、我們服務誰、我們跟別人哪裡不一樣。這不是一份放在抽屜裡的文件，而是每天都在用的決策依據。</p>
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
