'use client'

import { FadeUp } from './motion'

const results = [
  {
    label: '品牌｜讓顧客有理由選你',
    stat: '不比規格，找空位',
    desc: '產品不差，卻一直被比價、被殺價？不比規格，找出顧客心中還空著的位置，讓顧客記得住、相信、優先選你。',
  },
  {
    label: '設計｜讓品牌不用再解釋',
    stat: '定位驅動視覺',
    desc: '業務每天花力氣解釋「我們跟別人哪裡不一樣」？把定位轉成包裝、識別與每個接觸點，讓顧客第一眼就懂。',
  },
  {
    label: '創新｜在同質化市場走出另一條路',
    stat: '找別人放棄的位置',
    desc: '整個產業長得一樣？避開競品擠在一起的地方，找出同業不敢做、顧客會買單的切角。',
  },
  {
    label: '創意｜把對的策略變成人願意看的樣子',
    stat: '策略＋創意零斷層',
    desc: '策略寫得很好，落地後沒人有感覺？設計師出身，策略和創意由同一人負責，中間沒有斷層。',
  },
]

export function RosieResultsInAction() {
  return (
    <section className="bg-adam-navy py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
            RESULTS IN ACTION
          </p>
          <h2 className="mt-3 text-[26px] font-bold leading-[1.3] text-white md:text-[36px]">
            四個標籤，解決四種痛點
          </h2>
          <p className="mt-3 max-w-[560px] text-[16px] leading-[1.7] text-white/55">
            產品差異可以被比較，品牌差異才會被記住。創新不是追新，是找到別人放棄的位置。
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {results.map((r) => (
              <div
                key={r.stat}
                className="rounded-2xl border border-white/8 bg-adam-navy-light p-7"
              >
                <p className="text-[12px] font-medium text-adam-gold/60">{r.label}</p>
                <p className="mt-3 text-[24px] font-black tracking-tight text-white md:text-[28px]" style={{ letterSpacing: '-0.02em' }}>
                  {r.stat}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-white/45">
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
