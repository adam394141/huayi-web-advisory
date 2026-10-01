'use client'

import { FadeUp, StaggerContainer, StaggerItem } from './motion'

export function CpcEvidence() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <div className="mb-16 text-center">
            <p className="text-[13px] font-medium tracking-[0.18em] text-adam-gold">
              EVIDENCE
            </p>
            <h2 className="mt-3 font-serif text-[26px] font-semibold tracking-tight text-adam-navy md:text-[36px]">
              可查核的專業背景
            </h2>
          </div>
        </FadeUp>

        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          <StaggerItem>
            <div className="rounded-2xl border border-adam-gold-line bg-white p-8 transition-shadow hover:shadow-lg">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[13px] font-semibold tracking-[0.08em] text-adam-gold">
                  專業背景
                </span>
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4CAF7D]">
                  <span className="inline-block size-1.5 rounded-full bg-[#4CAF7D]" />
                  VERIFIED
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="rounded-xl bg-adam-blue-gray p-4">
                  <p className="text-[14px] font-semibold text-adam-navy">
                    華翼品牌策略創辦人
                  </p>
                  <p className="mt-1 text-[12px] text-adam-warm-gray">
                    2015 年成立，服務中小企業品牌定位
                  </p>
                </div>
                <div className="rounded-xl bg-adam-blue-gray p-4">
                  <p className="text-[14px] font-semibold text-adam-navy">
                    品牌策略顧問
                  </p>
                  <p className="mt-1 text-[12px] text-adam-warm-gray">
                    SWOT、STP、4P 與品牌金字塔實務運用
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="rounded-2xl border border-adam-gold-line bg-white p-8 transition-shadow hover:shadow-lg">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[13px] font-semibold tracking-[0.08em] text-adam-gold">
                  講師與 AI 認證
                </span>
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4CAF7D]">
                  <span className="inline-block size-1.5 rounded-full bg-[#4CAF7D]" />
                  VERIFIED
                </span>
              </div>
              <div className="flex items-center gap-4 rounded-xl bg-adam-blue-gray p-4">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-adam-gold/10">
                  <span className="text-center font-mono text-[10px] font-semibold text-adam-gold">
                    IQCS
                    <br />
                    CERT
                  </span>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-adam-navy">
                    ISO/IEC 17024 IQCS
                  </p>
                  <p className="mt-1 text-[12px] text-adam-warm-gray">
                    AI Instructor — Prompt Engineer
                  </p>
                  <p className="mt-0.5 text-[11px] text-adam-warm-gray/60">
                    TW0005247 · 2025.09–2028.09
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="rounded-2xl border border-adam-gold-line bg-white p-8 transition-shadow hover:shadow-lg">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[13px] font-semibold tracking-[0.08em] text-adam-gold">
                  授課紀錄
                </span>
                <span className="rounded-full bg-adam-gold/10 px-2.5 py-1 text-[11px] font-semibold text-adam-gold">
                  COLLECTING
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="rounded-xl bg-adam-blue-gray p-4">
                  <p className="text-[14px] font-semibold text-adam-navy">
                    企業 AI 內訓
                  </p>
                  <p className="mt-1 text-[12px] text-adam-warm-gray">多場次</p>
                </div>
                <div className="rounded-xl bg-adam-blue-gray p-4">
                  <p className="text-[14px] font-semibold text-adam-navy">
                    公協會專題演講
                  </p>
                  <p className="mt-1 text-[12px] text-adam-warm-gray">多場次</p>
                </div>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  )
}
