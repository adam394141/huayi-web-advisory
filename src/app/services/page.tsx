import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Search, Users, Route, LogOut } from "lucide-react";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "服務項目｜華翼品牌策略",
  description:
    "華翼以駐點顧問方式協助企業建立品牌與行銷團隊：診斷現場、建立團隊、駐點陪跑、獨立運作。",
  alternates: { canonical: "/services" },
};

const CORE_STEPS = [
  {
    num: "01",
    icon: Search,
    image: "/services/step-diagnose.svg",
    title: "診斷現場",
    desc: "進入企業盤點品牌與行銷各環節的真實需求，區分哪些該外包、哪些該內建、哪些可以用 AI 取代。不是給你一份報告就走，而是找出真正要解決的問題。",
    deliverables: [
      "企業品牌與行銷體檢",
      "團隊能力缺口分析",
      "外包 vs. 內建決策建議",
      "建置優先順序規劃",
    ],
  },
  {
    num: "02",
    icon: Users,
    image: "/services/step-build.svg",
    title: "建立團隊",
    desc: "依優先順序逐步補上對的人——設計師、企劃、小編、電商。不是一次到位，而是跟著企業的節奏一步一步建，同時導入 AI 工具讓新團隊從第一天就能高效運作。",
    deliverables: [
      "職能需求與人才規格",
      "招募與面試協助",
      "AI 工具導入與內訓",
      "工作流程建立",
    ],
  },
  {
    num: "03",
    icon: Route,
    image: "/services/step-coach.svg",
    title: "駐點陪跑",
    desc: "顧問進駐現場，帶著團隊實作、修正、校準，直到流程能被穩定執行。不是遠端下指令，而是在你的辦公室裡一起工作。",
    deliverables: [
      "每週現場指導",
      "實戰演練與修正",
      "品質標準建立",
      "跨部門協作流程",
    ],
  },
  {
    num: "04",
    icon: LogOut,
    image: "/services/step-independent.svg",
    title: "獨立運作",
    desc: "團隊具備獨立運作能力後，華翼退場。移交的不只是人和流程，還有判斷問題的能力。建好就走，不綁定、不依賴。",
    deliverables: [
      "獨立運作驗收",
      "SOP 與操作手冊",
      "季度回訪（選配）",
      "深度問題支援（選配）",
    ],
  },
];

const ADDON_MODULES = [
  { title: "品牌策略", desc: "品牌定位、市場競品分析、差異化策略、品牌金字塔建構" },
  { title: "企業 AI 導入", desc: "AI 導入評估、企業內訓、流程自動化、MVP 系統開發" },
  { title: "品牌行銷", desc: "Facebook / Google 廣告投放、社群經營、內容行銷" },
  { title: "品牌設計", desc: "CIS 識別系統、包裝設計、活動主視覺、品牌周邊" },
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
            駐點建置，建好就走。
          </h1>
          <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-[var(--color-body)]">
            華翼像設備進場的駐點工程師——進到現場完成診斷、建置、教學與陪跑，直到團隊能自己運作，再把方法複製到下一個場域。
          </p>
        </ScrollReveal>
      </Section>

      {/* Core Process */}
      {CORE_STEPS.map((step, i) => (
        <Section
          key={step.num}
          className={i % 2 === 1 ? "bg-[var(--color-surface)]" : ""}
        >
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-start">
            <ScrollReveal>
              <Image
                src={step.image}
                alt={step.title}
                width={400}
                height={300}
                className="w-full max-w-[360px] rounded-[var(--radius-card)]"
              />
            </ScrollReveal>
            <div>
              <ScrollReveal delay={0.1}>
                <div className="flex items-start gap-4">
                  <span className="text-[3rem] font-light leading-none text-[var(--color-faint)]/30">
                    {step.num}
                  </span>
                  <step.icon
                    className="mt-3 h-8 w-8 text-[var(--color-gold-dark)]"
                    strokeWidth={1.5}
                  />
                </div>
                <h2 className="mt-6 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2rem]">
                  {step.title}
                </h2>
                <p className="mt-4 text-[16px] leading-[1.9] text-[var(--color-body)]">
                  {step.desc}
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
              <div className="rounded-[var(--radius-card)] border border-[var(--color-faint)]/30 p-8">
                <p className="text-[12px] tracking-[0.15em] text-[var(--color-subtle)]">
                  主要交付項目
                </p>
                <ul className="mt-5 space-y-3">
                  {step.deliverables.map((d) => (
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
          </div>
        </Section>
      ))}

      {/* Add-on Modules */}
      <Section className="bg-[var(--color-surface)]">
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.3em] text-[var(--color-subtle)]">
            ADD-ON MODULES
          </p>
          <h2 className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2.2rem]">
            建置完成後的選配服務
          </h2>
          <p className="mt-4 max-w-[480px] text-[16px] leading-relaxed text-[var(--color-body)]">
            團隊建好後，如有額外需求，華翼也能承接以下模組。
          </p>
        </ScrollReveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {ADDON_MODULES.map((mod, i) => (
            <ScrollReveal key={mod.title} delay={i * 0.06}>
              <div className="rounded-[var(--radius-card)] border border-[var(--color-faint)]/30 bg-[var(--color-warm-white)] p-6">
                <h3 className="font-serif text-[1.1rem] font-semibold text-[var(--color-fg)]">
                  {mod.title}
                </h3>
                <p className="mt-2 text-[15px] text-[var(--color-body)]">
                  {mod.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="text-center">
        <ScrollReveal>
          <h2 className="font-serif text-[1.4rem] text-[var(--color-fg)] md:text-[1.8rem]">
            先花一小時做企業體檢
          </h2>
          <p className="mt-4 max-w-[400px] mx-auto text-[15px] text-[var(--color-body)]">
            我們會直接告訴你，現在該外包還是該建團隊。
          </p>
          <p className="mt-8">
            <Link
              href="/contact"
              className="inline-block rounded-[var(--radius-button)] bg-[var(--color-fg)] px-8 py-3.5 text-[15px] tracking-wider text-white transition-colors hover:bg-[var(--color-gold-dark)]"
            >
              預約企業體檢
            </Link>
          </p>
        </ScrollReveal>
      </Section>
    </>
  );
}
