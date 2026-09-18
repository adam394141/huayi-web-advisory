import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Bot, TrendingUp, Palette } from "lucide-react";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "服務項目｜華翼品牌策略",
  description:
    "華翼提供品牌策略、企業 AI 導入、品牌行銷與商業成長、品牌體驗與設計四大服務。",
  alternates: { canonical: "/services" },
};

const SERVICES = [
  {
    num: "01",
    icon: Compass,
    title: "品牌策略",
    desc: "從市場研究到品牌定位，協助企業建立清晰的差異化策略。我們運用 SWOT、STP、4P、品牌金字塔等框架，讓品牌不只有方向，更有可執行的路徑。",
    deliverables: [
      "品牌定位報告",
      "市場競品分析",
      "差異化策略方案",
      "品牌金字塔建構",
      "目標客群定義（STP）",
    ],
  },
  {
    num: "02",
    icon: Bot,
    title: "企業 AI 導入",
    desc: "不賣工具，而是協助企業找到 AI 真正能創造價值的切入點。從導入評估、企業內訓到系統建置，以 MVP 思維快速驗證，開發週期 2-3 天。",
    deliverables: [
      "AI 導入評估報告",
      "企業內訓課程",
      "MVP 系統快速開發",
      "流程自動化方案",
      "AI 內容產出系統",
    ],
  },
  {
    num: "03",
    icon: TrendingUp,
    title: "品牌行銷與商業成長",
    desc: "整合 Facebook 與 Google 廣告投放、社群經營與內容行銷，讓每一筆預算發揮最大效益。不只做曝光，更聚焦轉換與實際商業成長。",
    deliverables: [
      "Facebook / Google 廣告投放",
      "社群經營策略",
      "內容行銷規劃",
      "數據分析與優化",
      "行銷漏斗建置",
    ],
  },
  {
    num: "04",
    icon: Palette,
    title: "品牌體驗與設計",
    desc: "從品牌識別到包裝設計，打造一致且有記憶點的品牌體驗。不只是好看，更要能在市場中被辨識、被記住。",
    deliverables: [
      "CIS 品牌識別系統",
      "包裝設計",
      "活動主視覺設計",
      "品牌周邊設計",
      "品牌應用規範",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Page Header */}
      <Section className="pb-0 pt-20 md:pt-28">
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.4em] text-[var(--color-gold-dark)]">
            SERVICES
          </p>
          <h1 className="mt-4 font-serif text-[2rem] font-semibold text-[var(--color-fg)] md:text-[3rem]">
            我們的服務。
          </h1>
          <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-[var(--color-body)]">
            每一項服務都不是獨立存在的——它們會根據企業的實際需求靈活組合，成為最適合你的解決方案。
          </p>
        </ScrollReveal>
      </Section>

      {/* Service Sections */}
      {SERVICES.map((service, i) => (
        <Section
          key={service.num}
          className={i % 2 === 1 ? "bg-[var(--color-surface)]" : ""}
        >
          <div className="grid gap-12 md:grid-cols-2">
            <ScrollReveal>
              <div className="flex items-start gap-4">
                <span className="text-[3rem] font-light leading-none text-[var(--color-faint)]/30">
                  {service.num}
                </span>
                <service.icon
                  className="mt-3 h-8 w-8 text-[var(--color-gold-dark)]"
                  strokeWidth={1.5}
                />
              </div>
              <h2 className="mt-6 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2rem]">
                {service.title}
              </h2>
              <p className="mt-4 text-[16px] leading-[1.9] text-[var(--color-body)]">
                {service.desc}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="rounded-[var(--radius-card)] border border-[var(--color-faint)]/30 p-8">
                <p className="text-[12px] tracking-[0.15em] text-[var(--color-subtle)]">
                  主要交付項目
                </p>
                <ul className="mt-5 space-y-3">
                  {service.deliverables.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-3 text-[16px] text-[var(--color-body)]"
                    >
                      <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold)]" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </Section>
      ))}

      {/* CTA */}
      <Section className="text-center">
        <ScrollReveal>
          <h2 className="font-serif text-[1.4rem] text-[var(--color-fg)] md:text-[1.8rem]">
            找到最適合你的方案
          </h2>
          <p className="mt-8">
            <Link
              href="/contact"
              className="inline-block rounded-[var(--radius-button)] bg-[var(--color-fg)] px-8 py-3.5 text-[15px] tracking-wider text-white transition-colors hover:bg-[var(--color-gold-dark)]"
            >
              開始諮詢
            </Link>
          </p>
        </ScrollReveal>
      </Section>
    </>
  );
}
