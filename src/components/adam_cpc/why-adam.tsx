'use client'

import { FadeUp } from './motion'

const reasons = [
  {
    title: '教底層邏輯，不只教工具',
    desc: '從需求拆解、資料思考到流程設計，讓學員知道「為什麼這樣做」',
  },
  {
    title: '跨域實務經驗',
    desc: '資料庫、品牌設計、廣告投放、整合行銷與企業顧問，能把 AI 放進真實工作場景',
  },
  {
    title: '從基礎一路教到進階',
    desc: '多種 AI 工具、工作流、Agent、Vibe Coding、AI 數位轉型皆可依需求組課',
  },
  {
    title: '重視學得會與帶得走',
    desc: '把實務經驗拆成可理解、可操作、可重複的教學方法，而不是只做工具展示',
  },
]

export function CpcWhyAdam() {
  return (
    <section className="bg-adam-ivory py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <div className="mb-10 text-center md:mb-14">
            <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
              WHY INVITE ADAM
            </p>
            <h2 className="mt-3 text-[26px] font-bold tracking-tight text-adam-navy md:text-[36px]">
              為什麼選 Adam
            </h2>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
            {reasons.map((r) => (
              <div key={r.title} className="rounded-2xl border border-adam-gold-line bg-white p-7">
                <h3 className="text-[18px] font-bold text-adam-navy">{r.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-adam-warm-gray">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
