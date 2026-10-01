'use client'

import { FadeUp } from './motion'

const steps = [
  {
    num: '01',
    title: '人的定位｜先診斷，再開策略',
    desc: '用 BGS 企業成長診斷系統，看清老闆、老闆娘與接班人各自該站的位置，找出真正卡住成長的地方。',
    result: '人站對位置',
    dark: false,
  },
  {
    num: '02',
    title: '找到空位｜顧客心裡還缺什麼',
    desc: '不跟對手比誰更好，找出顧客心中還空著、你能當第一的位置。',
    result: '找到你能第一的位置',
    dark: true,
  },
  {
    num: '03',
    title: '做出差異｜別人往左，你往右',
    desc: '避開產業都在擠的地方，找出只有你能說的那一句話。',
    result: '一句話說清楚你是誰',
    dark: false,
  },
  {
    num: '04',
    title: '視覺落地｜讓品牌不用再解釋',
    desc: '把定位轉成包裝、識別與每一個接觸點，讓市場一眼認出你。',
    result: '市場一眼認出',
    dark: true,
  },
  {
    num: '05',
    title: '累積資產｜品牌越做越值錢',
    desc: '長期檢視知名度、品質感與顧客忠誠，讓行銷預算變成資產，而不是被削價消耗。',
    result: '品牌越做越值錢',
    dark: false,
  },
]

export function RosieMethodology() {
  return (
    <section id="methodology" className="bg-adam-ivory py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <div className="mb-10 text-center md:mb-14">
            <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
              METHODOLOGY
            </p>
            <h2 className="mt-3 text-[26px] font-bold tracking-tight text-adam-navy md:text-[36px]" style={{ letterSpacing: '-0.01em' }}>
              雙定位五步驟：先定位人，再定位品牌
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-[1.76] text-adam-warm-gray">
              第 1 步定位人，第 2 到 5 步定位品牌。每一步都有系統性的方法與可驗證的成果。
            </p>
          </div>
        </FadeUp>

        <div className="mx-auto flex max-w-[880px] flex-col gap-3">
          {steps.map((step, i) => (
            <FadeUp key={step.num} delay={i * 0.05}>
              <div className={`overflow-hidden rounded-2xl ${step.dark ? 'bg-adam-navy' : 'border border-adam-gold-line bg-white'}`}>
                <div className="flex items-start gap-4 p-5 md:gap-5 md:px-8 md:py-6">
                  <span
                    className={`shrink-0 text-[32px] font-black ${step.dark ? 'text-adam-gold/50' : 'text-adam-navy/25'}`}
                    style={{ letterSpacing: '-0.03em' }}
                  >
                    {step.num}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[18px] font-bold ${step.dark ? 'text-white' : 'text-adam-navy'}`}>
                      {step.title}
                    </p>
                    <p className={`mt-1 text-[14px] leading-relaxed ${step.dark ? 'text-white/50' : 'text-adam-warm-gray'}`}>
                      {step.desc}
                    </p>
                    <span className={`mt-3 inline-block rounded-full px-3 py-1 text-[12px] font-medium ${step.dark ? 'bg-adam-gold/15 text-adam-gold' : 'bg-adam-blue-gray text-adam-navy'}`}>
                      結果：{step.result}
                    </span>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
