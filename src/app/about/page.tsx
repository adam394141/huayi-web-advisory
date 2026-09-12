import type { Metadata } from "next";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ImagePlaceholder } from "@/components/image-placeholder";

export const metadata: Metadata = {
  title: "關於華翼｜華翼品牌策略",
  description:
    "華翼品牌形象設計，從設計公司轉型為品牌策略顧問，服務台灣中小企業與二代接班人。",
};

const METHOD_STEPS = [
  {
    num: "01",
    title: "企業診斷",
    desc: "深入理解企業痛點——品牌？行銷？人力？技術？找出真正需要解決的核心問題。",
  },
  {
    num: "02",
    title: "方案設計",
    desc: "提出 2-3 個可行方案，說明優先順序與預期效果，讓決策者有清晰的選擇依據。",
  },
  {
    num: "03",
    title: "延伸服務",
    desc: "依實際需求自然延伸相關服務，從品牌策略到 AI 導入，不一次推銷所有方案。",
  },
];

const CAPABILITIES = [
  {
    title: "品牌策略",
    desc: "品牌定位、市場競品研究、差異化策略",
  },
  {
    title: "AI 與技術",
    desc: "AI 導入評估、企業內訓、快速開發",
  },
  {
    title: "行銷成長",
    desc: "廣告投放、社群經營、內容行銷",
  },
  {
    title: "品牌設計",
    desc: "CIS 品牌識別、包裝設計、活動主視覺",
  },
];

const TEAM = [
  { name: "Adam", title: "品牌顧問" },
  { name: "Rosie", title: "品牌顧問" },
];

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <Section className="pb-0 pt-20 md:pt-28">
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.4em] text-[var(--color-gold-dark)]">
            ABOUT
          </p>
          <h1 className="mt-4 font-serif text-[2rem] font-semibold text-[var(--color-fg)] md:text-[3rem]">
            我們是華翼。
          </h1>
        </ScrollReveal>
      </Section>

      {/* Brand Story */}
      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <ScrollReveal>
            <h2 className="font-serif text-[1.4rem] font-semibold leading-snug text-[var(--color-fg)] md:text-[1.8rem]">
              從設計公司
              <br />
              到品牌策略顧問
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="space-y-5 text-[16px] leading-[1.9] text-[var(--color-body)]">
              <p>
                華翼品牌形象設計立足台灣，以品牌策略顧問的角色，服務中小企業與二代接班人。
              </p>
              <p>
                我們相信，品牌不只是一個 Logo
                或一套視覺系統，而是企業在市場中的差異化資產。從品牌定位到
                AI
                導入，我們的目標是讓每一個有實力的品牌，都能被市場看見真正的價值。
              </p>
              <p>
                品牌決定企業方向，AI 決定企業速度——這是華翼的核心信念，也是我們每一次顧問服務的出發點。
              </p>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* Method */}
      <Section className="bg-[var(--color-surface)]">
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.3em] text-[var(--color-subtle)]">
            METHODOLOGY
          </p>
          <h2 className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2.2rem]">
            顧問方法
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {METHOD_STEPS.map((s, i) => (
            <ScrollReveal key={s.num} delay={i * 0.1}>
              <div className="rounded-[var(--radius-card)] bg-[var(--color-warm-white)] p-8 md:p-10">
                <span className="text-[2.4rem] font-light text-[var(--color-faint)]/40">
                  {s.num}
                </span>
                <h3 className="mt-3 font-serif text-[1.2rem] font-semibold text-[var(--color-fg)]">
                  {s.title}
                </h3>
                <p className="mt-3 text-[16px] leading-relaxed text-[var(--color-body)]">
                  {s.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Integrated Capabilities */}
      <Section>
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.3em] text-[var(--color-subtle)]">
            CAPABILITIES
          </p>
          <h2 className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2.2rem]">
            整合能力
          </h2>
          <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-[var(--color-body)]">
            品牌策略、AI
            技術、行銷成長與品牌設計——四個面向不是獨立服務，而是根據企業需求靈活組合的整合能力。
          </p>
        </ScrollReveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {CAPABILITIES.map((c, i) => (
            <ScrollReveal key={c.title} delay={i * 0.08}>
              <div className="rounded-[var(--radius-card)] border border-[var(--color-faint)]/30 p-8">
                <h3 className="font-serif text-[1.1rem] font-semibold text-[var(--color-fg)]">
                  {c.title}
                </h3>
                <p className="mt-2 text-[16px] text-[var(--color-body)]">
                  {c.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section className="bg-[var(--color-surface)]">
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.3em] text-[var(--color-subtle)]">
            TEAM
          </p>
          <h2 className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2.2rem]">
            華翼團隊
          </h2>
        </ScrollReveal>
        <div className="mt-10 grid max-w-[720px] gap-10 md:grid-cols-2">
          {TEAM.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 0.1}>
              <ImagePlaceholder src={member.name === "Adam" ? "/home/adam.jpg" : null} alt={member.name + " 品牌顧問"} aspect="3/4" />
              <h3 className="mt-5 text-[18px] font-medium text-[var(--color-fg)]">
                {member.name}
              </h3>
              <p className="mt-1 text-[16px] text-[var(--color-body)]">
                {member.title}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </Section>
    </>
  );
}
