import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Search, Users, Briefcase, Handshake } from "lucide-react";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "服務項目｜華翼品牌策略",
  description:
    "華翼從企業經營痛點出發，透過 AI 導入、流程改善與品牌行銷，提供內部建置、外部專業支援或混合協作三種模式。",
  alternates: { canonical: "/services" },
};

const DIAGNOSIS = {
  num: "00",
  icon: Search,
  image: "/services/華翼官網001.png",
  title: "先診斷，再決定路徑",
  desc: "每家企業的狀況不同，不應該只有一種解法。華翼先進入企業了解經營痛點、團隊現況與資源條件，再建議最適合的交付模式——不是每家都該自建團隊，也不是每家都適合外包。",
  deliverables: [
    "企業經營與流程體檢",
    "團隊能力缺口分析",
    "AI 導入機會評估",
    "內建 vs. 外包 vs. 混合決策建議",
  ],
};

const DELIVERY_MODES = [
  {
    num: "A",
    icon: Users,
    image: "/services/官網圖片002.png",
    title: "建立自己的團隊",
    subtitle: "適合有長期人才預算的企業",
    desc: "華翼協助策略規劃、人才招募、職能定義、制度建立、SOP 與培訓。帶著團隊實作與修正，直到能自主運作後交接撤場。",
    deliverables: [
      "組織架構與職能規劃",
      "招募與面試協助",
      "AI 工具導入與內訓",
      "SOP 與工作流程建立",
      "獨立運作驗收與交接",
    ],
  },
  {
    num: "B",
    icon: Briefcase,
    image: "/services/官網圖片003.png",
    title: "外部專業團隊支援",
    subtitle: "適合暫時不需要或養不起完整內部團隊的企業",
    desc: "由華翼整合既有合作的外部專業團隊，依約負責策略、專案管理、品質與成效追蹤。企業不需要自己找人、管人，華翼幫你把事情做好。",
    deliverables: [
      "外部團隊組建與管理",
      "專案目標與 KPI 設定",
      "品質監控與成效報告",
      "廠商協調與進度追蹤",
    ],
  },
  {
    num: "C",
    icon: Handshake,
    image: "/services/官網圖片004.png",
    title: "內外混合協作",
    subtitle: "適合有少數內部窗口但需要額外專業支援的企業",
    desc: "華翼協助確立內部窗口與外部夥伴的分工，讓兩邊能有效協作。內部負責最了解產品的部分，外部補上專業技能的缺口。",
    deliverables: [
      "內外分工架構設計",
      "協作流程與溝通機制",
      "內部人員培訓與賦能",
      "階段性檢視與調整",
    ],
  },
];

const EXPERTISE = [
  { title: "AI 導入與流程改善", desc: "AI 導入評估、企業內訓、重複流程盤點與自動化" },
  { title: "品牌策略與行銷", desc: "品牌定位、廣告投放、社群經營、內容行銷" },
  { title: "品牌設計", desc: "CIS 識別系統、包裝設計、活動主視覺" },
  { title: "組織管理與人才發展", desc: "角色定義、制度建立、培訓規劃" },
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
            先搞清楚問題，再決定怎麼做。
          </h1>
          <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-[var(--color-body)]">
            華翼從企業的經營痛點出發，先診斷再建議路徑。不是每家都該自建團隊，也不是每家都適合外包——依你的資源和狀況，選擇最合理的方式。
          </p>
        </ScrollReveal>
      </Section>

      {/* Step 0: Diagnosis */}
      <Section>
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-start">
          <ScrollReveal>
            <Image src={DIAGNOSIS.image} alt={DIAGNOSIS.title} width={600} height={450} className="w-full rounded-[var(--radius-card)] object-cover" />
          </ScrollReveal>
          <div>
            <ScrollReveal delay={0.1}>
              <div className="flex items-start gap-4">
                <DIAGNOSIS.icon className="mt-1 h-8 w-8 text-[var(--color-gold-dark)]" strokeWidth={1.5} />
              </div>
              <h2 className="mt-4 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2rem]">{DIAGNOSIS.title}</h2>
              <p className="mt-4 text-[16px] leading-[1.9] text-[var(--color-body)]">{DIAGNOSIS.desc}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="mt-6 rounded-[var(--radius-card)] border border-[var(--color-faint)]/30 p-8">
                <p className="text-[12px] tracking-[0.15em] text-[var(--color-subtle)]">診斷項目</p>
                <ul className="mt-5 space-y-3">
                  {DIAGNOSIS.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-[16px] text-[var(--color-body)]">
                      <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold)]" />{d}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {/* Three Delivery Modes */}
      <Section className="bg-[var(--color-surface)]">
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.3em] text-[var(--color-subtle)]">DELIVERY MODES</p>
          <h2 className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2.2rem]">三種交付模式，依你的狀況選擇</h2>
          <p className="mt-4 max-w-[520px] text-[16px] leading-relaxed text-[var(--color-body)]">不是每家公司都該自建團隊，也不是每家都適合外包。華翼先診斷，再建議最合理的路徑。</p>
        </ScrollReveal>
        <div className="mt-10 flex flex-col gap-6">
          {DELIVERY_MODES.map((mode, i) => (
            <ScrollReveal key={mode.num} delay={i * 0.1}>
              <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-faint)]/30 bg-[var(--color-warm-white)]">
                <Image src={mode.image} alt={mode.title} width={600} height={450} className="w-full object-cover" style={{ maxHeight: "280px" }} />
                <div className="p-8">
                <div className="flex items-start gap-4">
                  <span className="text-[2.4rem] font-light text-[var(--color-faint)]/30">{mode.num}</span>
                  <mode.icon className="mt-2 h-7 w-7 text-[var(--color-gold-dark)]" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 font-serif text-[1.3rem] font-semibold text-[var(--color-fg)]">{mode.title}</h3>
                <p className="mt-1 text-[13px] text-[var(--color-gold-dark)]">{mode.subtitle}</p>
                <p className="mt-4 text-[16px] leading-[1.9] text-[var(--color-body)]">{mode.desc}</p>
                <div className="mt-6 rounded-[var(--radius-card)] border border-[var(--color-faint)]/20 p-6">
                  <p className="text-[12px] tracking-[0.15em] text-[var(--color-subtle)]">主要交付項目</p>
                  <ul className="mt-4 space-y-2.5">
                    {mode.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-3 text-[15px] text-[var(--color-body)]">
                        <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold)]" />{d}
                      </li>
                    ))}
                  </ul>
                </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Expertise */}
      <Section>
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.3em] text-[var(--color-subtle)]">OUR EXPERTISE</p>
          <h2 className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2.2rem]">華翼的核心專業</h2>
          <p className="mt-4 max-w-[480px] text-[16px] leading-relaxed text-[var(--color-body)]">不管選擇哪種交付模式，這些是華翼能直接提供的專業能力。</p>
        </ScrollReveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {EXPERTISE.map((ex, i) => (
            <ScrollReveal key={ex.title} delay={i * 0.06}>
              <div className="rounded-[var(--radius-card)] border border-[var(--color-faint)]/30 bg-[var(--color-warm-white)] p-6">
                <h3 className="font-serif text-[1.1rem] font-semibold text-[var(--color-fg)]">{ex.title}</h3>
                <p className="mt-2 text-[15px] text-[var(--color-body)]">{ex.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <ScrollReveal>
          <p className="text-[12px] tracking-[0.3em] text-[var(--color-subtle)]">FAQ</p>
          <h2 className="mt-3 font-serif text-[1.6rem] font-semibold text-[var(--color-fg)] md:text-[2.2rem]">常見問題</h2>
        </ScrollReveal>
        <div className="mt-10 mx-auto max-w-[800px] space-y-6">
          {[
            { q: "華翼跟一般顧問公司有什麼不同？", a: "我們不會一開始就推方案。先花時間了解你的企業痛點，再建議該自建團隊、找外部支援，還是混合協作。不綁定單一模式，依你的資源和狀況選擇最合理的路徑。" },
            { q: "我的公司養不起行銷團隊，華翼能幫什麼？", a: "不是每家公司都需要自己養團隊。華翼可以幫你整合外部專業團隊，由我們負責策略、管理和品質追蹤，你只需要一個內部窗口對接。" },
            { q: "費用大概是多少？", a: "依服務模式不同。可以先預約 30 分鐘企業體檢，我們了解你的狀況後再建議適合的方案和費用範圍。" },
            { q: "企業導入 AI 有政府補助嗎？", a: "經濟部持續推出中小企業 AI 與數位轉型相關補助方案，符合資格的企業可以申請。華翼可以協助你評估是否符合條件，並在建置過程中導入符合補助範圍的 AI 工具。建議定期關注經濟部中小及新創企業署的最新公告。" },
            { q: "華翼不做什麼？", a: "ERP 系統、勞資管理、法務、ISO 認證不在我們的範圍。但如果診斷過程中發現你需要，我們會幫你轉介對的專業廠商。我們只做自己最專業的事。" },
          ].map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <details className="group rounded-[var(--radius-card)] border border-[var(--color-faint)]/30 px-6 py-5">
                <summary className="flex cursor-pointer items-center justify-between text-[16px] font-medium text-[var(--color-fg)]">
                  {item.q}
                  <span className="ml-4 shrink-0 text-[var(--color-subtle)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-body)]">{item.a}</p>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="text-center">
        <ScrollReveal>
          <h2 className="font-serif text-[1.4rem] text-[var(--color-fg)] md:text-[1.8rem]">
            先花 30 分鐘做企業體檢
          </h2>
          <p className="mt-4 max-w-[400px] mx-auto text-[15px] text-[var(--color-body)]">
            我們會直接告訴你，現在最該解決什麼、怎麼做最合理。
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
