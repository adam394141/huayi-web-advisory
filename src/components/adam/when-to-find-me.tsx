'use client'

import { FadeUp } from './motion'

const scenarios = [
  {
    problem: '有產線，想做自有品牌',
    detail: '產品做得出來，但第一支該賣什麼、賣給誰、怎麼定價，還沒想清楚。',
    approach: '先盤點現有產品、客群和成本，找出適合先試的品項。',
  },
  {
    problem: '產品不少，卻不知道該把資源放在哪一支',
    detail: '從報價、備料到通路，先找出哪個環節卡住，再決定哪些產品值得繼續投入。',
    approach: '',
  },
  {
    problem: '員工已經在用 AI，工作還是照舊',
    detail: '挑一件每天都在做的事，例如整理文件或交接資料，帶團隊用手上的工作試一輪，再決定怎麼接進日常流程。',
    approach: '',
  },
]

export function CpcWhenToFindMe() {
  return (
    <section className="bg-adam-ivory py-14 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
            WHEN TO FIND ME
          </p>
          <h2 className="mt-3 text-[22px] font-bold leading-[1.35] tracking-tight text-adam-navy md:text-[28px]" style={{ letterSpacing: '-0.01em' }}>
            什麼時候可以找我？
          </h2>
        </FadeUp>

        <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
          {scenarios.map((s, i) => (
            <FadeUp key={s.problem} delay={0.1 + i * 0.08}>
              <div className="flex h-full flex-col rounded-[20px] border border-adam-gold-line bg-white p-6 md:p-7">
                <p className="text-[16px] font-bold leading-snug text-adam-navy md:text-[17px]">
                  {s.problem}
                </p>
                <p className="mt-3 flex-1 text-[15px] leading-[1.75] text-adam-warm-gray">
                  {s.detail}
                  {s.approach && <> {s.approach}</>}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
