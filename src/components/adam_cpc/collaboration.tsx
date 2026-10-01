'use client'

import { FadeUp, StaggerContainer, StaggerItem } from './motion'

const models = [
  { title: '趨勢講座', duration: '1.5–2 hr', size: '50–200 人', desc: '快速掌握 AI 趨勢與應用方向' },
  { title: '主題實作課', duration: '3–4 hr', size: '20–40 人', desc: '單一主題深入實作，直接產出成果' },
  { title: '一日工作坊', duration: '6–7 hr', size: '15–30 人', desc: '完整一天實戰訓練，從需求到成果' },
  { title: '兩日密集班', duration: '12–14 hr', size: '15–25 人', desc: '兩天深度培訓，建立 AI 工作系統' },
  { title: '企業陪跑', duration: '4–12 週', size: '部門團隊', desc: '長期顧問，從診斷到落地全程陪伴' },
]

export function CpcCollaboration() {
  return (
    <section className="bg-adam-ivory py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <div className="mb-16 text-center">
            <p className="text-[13px] font-medium tracking-[0.18em] text-adam-gold">
              COLLABORATION
            </p>
            <h2 className="mt-3 font-serif text-[26px] font-semibold tracking-tight text-adam-navy md:text-[36px]">
              合作方式
            </h2>
            <p className="mx-auto mt-4 max-w-[560px] text-[16px] leading-[1.75] text-adam-warm-gray">
              從一場趨勢講座到長期企業陪跑，依你的需求選擇最適合的合作深度。
            </p>
          </div>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {models.map((m) => (
            <StaggerItem key={m.title}>
              <div className="flex h-full flex-col rounded-2xl border border-adam-gold-line bg-white p-6 text-center transition-all hover:border-adam-gold/40 hover:shadow-md">
                <h3 className="text-[16px] font-bold text-adam-navy">
                  {m.title}
                </h3>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  <span className="rounded-full bg-adam-blue-gray px-2.5 py-0.5 text-[11px] text-adam-navy/70">
                    {m.duration}
                  </span>
                  <span className="rounded-full bg-adam-blue-gray px-2.5 py-0.5 text-[11px] text-adam-navy/70">
                    {m.size}
                  </span>
                </div>
                <p className="mt-3 flex-1 text-[13px] leading-relaxed text-adam-warm-gray">
                  {m.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
