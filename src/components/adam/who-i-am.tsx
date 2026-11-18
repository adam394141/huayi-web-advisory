'use client'

import Link from 'next/link'
import { FadeUp } from './motion'

const clients = [
  '工研院', '金屬工業中心', '高大牧場', '高雄農會', '梓官漁會', '愛麵族',
  '岡山農會', '科工館', '蕃茄廚具', '高醫', '誠實堅果', '七賢脊椎',
  '三鳳宮', '兵役處', '青商會', '扶輪社', '獅子會',
]

export function CpcWhoIAm() {
  return (
    <section className="bg-adam-ivory py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
            ABOUT ADAM
          </p>
        </FadeUp>

        <div className="mt-6 grid gap-12 md:grid-cols-2 md:gap-16">
          {/* 左欄：經歷 + 跨域路徑 */}
          <FadeUp delay={0.1}>
            <div>
              <h2 className="text-[22px] font-bold leading-[1.35] tracking-tight text-adam-navy md:text-[28px]" style={{ letterSpacing: '-0.01em' }}>
                從資料庫到品牌策略，再到 AI 轉型
              </h2>
              <p className="mt-5 text-[16px] leading-[1.8] text-adam-warm-gray md:text-[17px]">
                我從資料庫設計與資訊工作起步，之後投入品牌設計、品牌策略與數位廣告投放，長期協助不同產業整合品牌、行銷與商業需求。現在把多年跨域實務整合到企業 AI 內訓與品牌顧問服務。
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {['資料庫設計', '品牌設計', '廣告投放', '整合行銷', '生成式 AI', 'AI 數位轉型'].map((step, i, arr) => (
                  <span key={step} className="flex items-center gap-2">
                    <span className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold ${i === arr.length - 1 ? 'bg-adam-navy text-adam-gold' : 'bg-adam-blue-gray text-adam-navy'}`}>
                      {step}
                    </span>
                    {i < arr.length - 1 && <span className="text-[14px] text-adam-gold">→</span>}
                  </span>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* 右欄：數字 + 客戶 */}
          <FadeUp delay={0.2}>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[16px] border border-adam-gold-line bg-white p-5 text-center">
                  <p className="text-[32px] font-black tracking-tight text-adam-navy" style={{ letterSpacing: '-0.03em' }}>
                    20<span className="text-[16px] text-adam-gold">+</span>
                  </p>
                  <p className="mt-1 text-[12px] text-adam-warm-gray">年品牌領域經驗</p>
                </div>
                <div className="rounded-[16px] border border-adam-gold-line bg-white p-5 text-center">
                  <p className="text-[32px] font-black tracking-tight text-adam-navy" style={{ letterSpacing: '-0.03em' }}>
                    400<span className="text-[16px] text-adam-gold">+</span>
                  </p>
                  <p className="mt-1 text-[12px] text-adam-warm-gray">AI 課程學員</p>
                </div>
                <div className="rounded-[16px] border border-adam-gold-line bg-white p-5 text-center">
                  <p className="text-[32px] font-black tracking-tight text-adam-navy" style={{ letterSpacing: '-0.03em' }}>
                    300<span className="text-[16px] text-adam-gold">+</span>
                  </p>
                  <p className="mt-1 text-[12px] text-adam-warm-gray">企業顧問與合作</p>
                </div>
              </div>

              <div className="rounded-[16px] border border-adam-gold-line bg-white p-5">
                <p className="text-[13px] font-semibold tracking-[0.08em] text-adam-gold">
                  代表性客戶與合作單位
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {clients.map((c) => (
                    <span key={c} className="rounded-lg bg-adam-blue-gray px-3 py-1.5 text-[13px] font-medium text-adam-navy">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* 證照：獨立橫幅，兩欄外 */}
        <FadeUp delay={0.25}>
          <div className="mt-10 grid items-center gap-6 overflow-hidden rounded-[20px] border border-adam-gold-line bg-white md:grid-cols-[200px_1fr]">
            <div className="bg-adam-blue-gray p-4 md:p-0">
              <img
                src="/adam/cert-iqcs.webp"
                alt="ISO/IEC 17024 IQCS AI Instructor 認證證書 — TW0005247"
                className="mx-auto max-h-[180px] object-contain md:max-h-[160px]"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex items-center gap-4 px-6 pb-5 md:py-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-adam-gold/15">
                <span className="font-mono text-[11px] font-bold text-adam-gold">ISO</span>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-adam-navy">ISO/IEC 17024 IQCS 認證講師</p>
                <p className="mt-0.5 text-[13px] text-adam-warm-gray">AI Instructor · TW0005247（2025–2028）</p>
              </div>
            </div>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}
