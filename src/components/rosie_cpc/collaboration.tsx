'use client'

import { FadeUp } from './motion'

const collabModels = [
  { name: '企業健檢', time: '月／1～2 堂', desc: '品牌全面體檢，找出核心問題與優先順序' },
  { name: '人的定位', time: '雙定位、個觀人', desc: '從天賦系統出發，找到品牌創辦人的定位方向' },
  { name: '團隊天賦盤點', time: '輔引／導覽', desc: '用 MMT 分析團隊成員特質，優化人才配置' },
  { name: '商業發展報告書', time: '策略入組', desc: '完整品牌發展策略報告，含定位、視覺與行動計畫' },
  { name: '顧問陪跑', time: '長期合作', desc: '持續陪伴品牌成長，從診斷到落地全程參與', highlighted: true },
]

export function RosieCollaboration() {
  return (
    <section className="bg-adam-ivory py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <p className="mb-3 text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
            COLLABORATION
          </p>
          <h2 className="mb-8 text-[26px] font-bold tracking-tight text-adam-navy md:text-[36px]">
            合作方式
          </h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {collabModels.map((m) => (
              <div
                key={m.name}
                className={`rounded-2xl p-6 transition-shadow hover:shadow-md ${
                  m.highlighted
                    ? 'border-2 border-adam-gold bg-adam-navy text-white'
                    : 'border border-adam-gold-line bg-white'
                }`}
              >
                <p className={`text-[20px] font-bold ${m.highlighted ? 'text-adam-gold' : 'text-adam-navy'}`}>
                  {m.name}
                </p>
                <div className="mt-3">
                  <span className={`rounded-full px-3 py-1 text-[15px] font-medium md:text-[16px] ${
                    m.highlighted
                      ? 'bg-adam-gold/15 text-adam-gold'
                      : 'bg-adam-blue-gray text-adam-navy'
                  }`}>
                    {m.time}
                  </span>
                </div>
                <p className={`mt-3 text-[14px] leading-relaxed ${m.highlighted ? 'text-white/60' : 'text-adam-warm-gray'}`}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
