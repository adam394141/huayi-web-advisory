'use client'

import { FadeUp } from './motion'

const clients = [
  '工研院', '金屬工業中心', '高大牧場', '高雄農會', '梓官漁會', '愛麵族',
  '岡山農會', '科工館', '蕃茄廚具', '高醫', '誠實堅果', '七賢脊椎',
  '三鳳宮', '兵役處', '青商會', '扶輪社', '獅子會',
]

export function CpcWhoIAm() {
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
                資料庫設計起步、經歷品牌設計、廣告投放，跨域整合行銷經驗，現在教 AI 數位轉型。
              </h2>
              <div className="mt-8 space-y-4 text-[17px] leading-[1.76] text-adam-warm-gray">
                <p>
                  我從資料庫設計與資訊工作起步，之後投入品牌設計、品牌策略與數位廣告投放，長期協助不同產業整合品牌、行銷與商業需求。
                </p>
                <p>
                  這些跨域實務，讓我在教 AI 時，不只談單一工具，而是從資料、流程、內容、行銷與決策的底層邏輯出發，讓學員理解 AI 為什麼這樣用、怎麼放進真實工作場景。
                </p>
                <p>
                  現在，我把多年品牌、行銷與企業顧問經驗，整合到生成式 AI 教學與 AI 數位轉型，從基礎工具一路帶到工作流、Agent、Vibe Coding 與企業應用。
                </p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="flex flex-col gap-5">
              <div className="rounded-[20px] border border-adam-gold-line bg-white p-8">
                <p className="text-[13px] font-semibold tracking-[0.08em] text-adam-gold">
                  跨域路徑
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <span className="rounded-[10px] bg-adam-blue-gray px-3.5 py-2 text-[13px] font-semibold text-adam-navy">
                    資料庫設計
                  </span>
                  <span className="text-[16px] text-adam-gold">→</span>
                  <span className="rounded-[10px] bg-adam-blue-gray px-3.5 py-2 text-[13px] font-semibold text-adam-navy">
                    品牌設計
                  </span>
                  <span className="text-[16px] text-adam-gold">→</span>
                  <span className="rounded-[10px] bg-adam-blue-gray px-3.5 py-2 text-[13px] font-semibold text-adam-navy">
                    廣告投放
                  </span>
                  <span className="text-[16px] text-adam-gold">→</span>
                  <span className="rounded-[10px] bg-adam-blue-gray px-3.5 py-2 text-[13px] font-semibold text-adam-navy">
                    整合行銷
                  </span>
                  <span className="text-[16px] text-adam-gold">→</span>
                  <span className="rounded-[10px] bg-adam-blue-gray px-3.5 py-2 text-[13px] font-semibold text-adam-navy">
                    生成式 AI
                  </span>
                  <span className="text-[16px] text-adam-gold">→</span>
                  <span className="rounded-[10px] bg-adam-navy px-3.5 py-2 text-[13px] font-semibold text-adam-gold">
                    AI 數位轉型
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[20px] border border-adam-gold-line bg-white p-6 text-center">
                  <p className="text-[36px] font-black tracking-tight text-adam-navy" style={{ letterSpacing: '-0.03em' }}>
                    20<span className="text-[18px] text-adam-gold">+</span>
                  </p>
                  <p className="mt-1 text-[13px] text-adam-warm-gray">年品牌領域經驗</p>
                </div>
                <div className="rounded-[20px] border border-adam-gold-line bg-white p-6 text-center">
                  <p className="text-[36px] font-black tracking-tight text-adam-navy" style={{ letterSpacing: '-0.03em' }}>
                    400<span className="text-[18px] text-adam-gold">+</span>
                  </p>
                  <p className="mt-1 text-[13px] text-adam-warm-gray">AI 課程學員</p>
                </div>
                <div className="rounded-[20px] border border-adam-gold-line bg-white p-6 text-center">
                  <p className="text-[36px] font-black tracking-tight text-adam-navy" style={{ letterSpacing: '-0.03em' }}>
                    300<span className="text-[18px] text-adam-gold">+</span>
                  </p>
                  <p className="mt-1 text-[13px] text-adam-warm-gray">企業顧問與合作</p>
                </div>
              </div>

              <div className="rounded-[20px] border border-adam-gold-line bg-white p-7">
                <p className="text-[13px] font-semibold tracking-[0.08em] text-adam-gold">
                  代表性客戶與合作單位
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {clients.map((c) => (
                    <span
                      key={c}
                      className="rounded-lg bg-adam-blue-gray px-3 py-1.5 text-[13px] font-medium text-adam-navy"
                    >
                      {c}
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
