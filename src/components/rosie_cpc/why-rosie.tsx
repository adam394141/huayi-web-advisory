'use client'

import { FadeUp } from './motion'

const reasons = [
  {
    title: '客戶在意',
    desc: '傳產轉型、接班交棒，是老闆娘與二代最迫切的問題。',
  },
  {
    title: '我擅長',
    desc: '23 年跨八大產業的品牌設計，加上 MMT 天賦系統對人的判斷。',
  },
  {
    title: '競品難抄',
    desc: '品牌顧問不懂人，天賦老師不懂品牌；兩者都會的人極少。',
  },
  {
    title: '能被感知',
    desc: '成果看得到：新的視覺、推得動的提案，以及對外更有信心。',
  },
]

export function RosieWhyRosie() {
  return (
    <section className="bg-adam-ivory py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <div className="mb-10 text-center md:mb-14">
            <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
              WHY ROSIE
            </p>
            <h2 className="mt-3 text-[26px] font-bold tracking-tight text-adam-navy md:text-[36px]">
              為什麼難被複製
            </h2>
            <p className="mx-auto mt-4 max-w-[480px] text-[17px] leading-[1.76] text-adam-warm-gray">
              有效的差異化必須同時滿足四個條件，我的定位四項都符合。
            </p>
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
