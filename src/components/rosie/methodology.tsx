'use client'

import { Search, Users, Target } from 'lucide-react'
import { FadeUp } from './motion'

const services = [
  {
    num: '01',
    icon: Search,
    title: '品牌健檢與人才需求診斷',
    subtitle: '一次性顧問服務',
    desc: '釐清企業目前的品牌問題、優先工作，以及是否需要增聘設計師、小編或企劃。',
    deliverables: '診斷報告、職能需求、優先行動清單。',
  },
  {
    num: '02',
    icon: Users,
    title: '品牌部門建置專案',
    subtitle: '階段性建置服務',
    desc: '從組織設計、職務說明、人才招募與面試，到工作流程、KPI 及內外部資源配置。',
    deliverables: '品牌部門架構、人才配置方案、工作制度與執行流程。',
  },
  {
    num: '03',
    icon: Target,
    title: '外部品牌總監／品牌策略',
    subtitle: '月費制長期顧問',
    desc: '定期參與品牌決策、帶領內部人才、檢視工作成果，並依企業成長階段調整策略。',
    deliverables: '月度策略會議、執行追蹤、團隊指導與階段性成果檢核。',
  },
]

export function RosieMethodology() {
  return (
    <section id="methodology" className="bg-adam-ivory py-16 md:py-20">
      <div className="mx-auto max-w-[880px] px-5 md:px-8">
        <FadeUp>
          <div className="mb-10 text-center md:mb-14">
            <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
              SERVICES
            </p>
            <h2 className="mt-3 text-[26px] font-bold tracking-tight text-adam-navy md:text-[36px]" style={{ letterSpacing: '-0.01em' }}>
              服務項目
            </h2>
          </div>
        </FadeUp>

        <div className="flex flex-col gap-4">
          {services.map((svc, i) => (
            <FadeUp key={svc.num} delay={i * 0.08}>
              <div className="overflow-hidden rounded-2xl border border-adam-gold-line bg-white p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-medium text-adam-warm-gray">
                      {svc.num}｜{svc.title}
                    </p>
                    <p className="mt-1 text-[12px] text-adam-gold">
                      {svc.subtitle}
                    </p>
                  </div>
                  <svc.icon className="mt-1 h-6 w-6 shrink-0 text-adam-navy/30" strokeWidth={1.5} />
                </div>
                <p className="mt-4 text-[16px] leading-[1.76] text-adam-navy">
                  {svc.desc}
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-adam-warm-gray">
                  交付：{svc.deliverables}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
