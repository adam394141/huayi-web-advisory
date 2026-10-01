'use client'

import { FadeUp } from './motion'

const collabModels = [
  { name: '趨勢講座', time: '1.5–2 hr', size: '30–50 人', desc: '快速掌握 AI 趨勢與應用方向' },
  { name: '實作課', time: '3–6 hr', size: '20–40 人', desc: '單一主題深入實作，直接產出成果' },
  { name: '工作坊', time: '6–12 hr', size: '15–30 人', desc: '完整實戰訓練，從需求到成果' },
  { name: '密集班', time: '6–18 hr', size: '10–20 人', desc: '深度培訓，建立 AI 工作系統' },
  { name: '企業陪跑', time: '4–12 週', size: '部門團隊', desc: '長期顧問，從診斷到落地陪伴' },
]

export function CpcCollabFormats() {
  return (
    <section className="bg-adam-ivory py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <p className="mb-6 text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
            COLLABORATION
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {collabModels.map((m) => (
              <div
                key={m.name}
                className="rounded-2xl border border-adam-gold-line bg-white p-6 transition-shadow hover:shadow-md"
              >
                <p className="text-[20px] font-bold text-adam-navy">{m.name}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-adam-blue-gray px-3 py-1 text-[15px] font-medium text-adam-navy md:text-[16px]">
                    {m.time}
                  </span>
                  <span className="rounded-full bg-adam-blue-gray px-3 py-1 text-[15px] font-medium text-adam-navy md:text-[16px]">
                    {m.size}
                  </span>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-adam-warm-gray">
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
