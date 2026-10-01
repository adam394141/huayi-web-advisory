'use client'

import { FadeUp } from './motion'

const industries = [
  '補教', '科技', '百貨', '連鎖餐飲',
  '廣告', '印刷', '製造', '公部門',
]

export function RosieWhoIAm() {
  return (
    <section className="bg-adam-ivory py-20 md:py-[120px]">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
            WHO I AM
          </p>
        </FadeUp>

        <div className="mt-4 grid gap-16 md:grid-cols-2 md:gap-20">
          <FadeUp delay={0.1}>
            <div>
              <h2 className="text-[22px] font-bold leading-[1.35] tracking-tight text-adam-navy md:text-[30px]" style={{ letterSpacing: '-0.01em' }}>
                視傳系畢業，當了 23 年設計師，後來發現傳產品牌推不動，常常不是設計的問題，而是人站錯了位置。
              </h2>
              <div className="mt-8 space-y-4 text-[17px] leading-[1.76] text-adam-warm-gray">
                <p>
                  饒芝綺 Rosie，華翼品牌策略創辦人，雙定位品牌顧問。視傳系畢業，跨補教、科技、百貨、連鎖餐飲、廣告、印刷、製造與公部門，逐漸從單純的設計執行，走到品牌定位的核心。
                </p>
                <p>
                  她結合品牌設計實戰研發 BGS 系統與整合 MMT 天賦系統，發展出「雙定位」方法：先把老闆、老闆娘與接班人放對位置，再把品牌放到市場上對的位置。
                </p>
                <p>
                  擅長在同質化的傳統產業中，找出同業不敢做、顧客會買單的差異化，讓品牌不用再解釋、提案推得動、對外更有信心。
                </p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="flex flex-col gap-5">
              <div className="rounded-[20px] border border-adam-gold-line bg-white p-8">
                <p className="text-[13px] font-semibold tracking-[0.08em] text-adam-gold">
                  跨域經歷
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <span className="rounded-[10px] bg-adam-blue-gray px-3.5 py-2 text-[13px] font-semibold text-adam-navy">
                    視覺傳達設計
                  </span>
                  <span className="text-[16px] text-adam-gold">→</span>
                  <span className="rounded-[10px] bg-adam-blue-gray px-3.5 py-2 text-[13px] font-semibold text-adam-navy">
                    品牌設計
                  </span>
                  <span className="text-[16px] text-adam-gold">→</span>
                  <span className="rounded-[10px] bg-adam-blue-gray px-3.5 py-2 text-[13px] font-semibold text-adam-navy">
                    23 年跨產業經驗
                  </span>
                  <span className="text-[16px] text-adam-gold">→</span>
                  <span className="rounded-[10px] bg-adam-blue-gray px-3.5 py-2 text-[13px] font-semibold text-adam-navy">
                    解決傳產二代接班困擾
                  </span>
                  <span className="inline-flex items-center gap-2.5">
                    <span className="text-[16px] text-adam-gold">→</span>
                    <span className="rounded-[10px] bg-adam-navy px-3.5 py-2 text-[13px] font-semibold text-adam-gold">
                      雙定位品牌顧問
                    </span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[20px] border border-adam-gold-line bg-white p-6 text-center">
                  <p className="text-[36px] font-black tracking-tight text-adam-navy" style={{ letterSpacing: '-0.03em' }}>
                    23<span className="text-[18px] text-adam-gold">+</span>
                  </p>
                  <p className="mt-1 text-[13px] text-adam-warm-gray">年品牌設計實戰</p>
                </div>
                <div className="rounded-[20px] border border-adam-gold-line bg-white p-6 text-center">
                  <p className="text-[36px] font-black tracking-tight text-adam-navy" style={{ letterSpacing: '-0.03em' }}>
                    300<span className="text-[18px] text-adam-gold">+</span>
                  </p>
                  <p className="mt-1 text-[13px] text-adam-warm-gray">品牌專案</p>
                </div>
                <div className="rounded-[20px] border border-adam-gold-line bg-white p-6 text-center">
                  <p className="text-[36px] font-black tracking-tight text-adam-navy" style={{ letterSpacing: '-0.03em' }}>
                    50<span className="text-[18px] text-adam-gold">+</span>
                  </p>
                  <p className="mt-1 text-[13px] text-adam-warm-gray">企業定位顧問</p>
                </div>
              </div>

              <div className="rounded-[20px] border border-adam-gold-line bg-white p-7">
                <p className="text-[13px] font-semibold tracking-[0.08em] text-adam-gold">
                  跨產業經驗
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {industries.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg bg-adam-blue-gray px-3 py-1.5 text-[13px] font-medium text-adam-navy"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
