'use client'

import { FadeUp } from './motion'

export function RosieCapabilityMap() {
  return (
    <section className="bg-adam-navy py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <FadeUp>
            <div>
              <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
                CORE CAPABILITY MAP
              </p>
              <h2 className="mt-4 text-[26px] font-bold leading-[1.3] text-white md:text-[32px]">
                雙定位＝人的定位＋品牌定位
              </h2>
              <p className="mt-4 text-[17px] leading-[1.7] text-white/55">
                不只做品牌設計，而是先找到人的定位，再做品牌定位。從品牌創辦人的天賦解讀、到品牌操盤手的職能匹配，最終落地為差異化策略與視覺系統。
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="overflow-hidden rounded-[20px] border border-adam-gold/15 bg-adam-navy-light p-6 md:p-8">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-adam-gold/20 p-4 text-center">
                    <p className="text-[12px] font-medium text-adam-gold/60">人的定位</p>
                    <p className="mt-2 text-[14px] font-semibold text-white">品牌創辦人</p>
                    <p className="mt-1 text-[12px] text-white/40">天賦解讀</p>
                  </div>
                  <div className="rounded-xl border border-adam-gold/20 p-4 text-center">
                    <p className="text-[12px] font-medium text-adam-gold/60">人的定位</p>
                    <p className="mt-2 text-[14px] font-semibold text-white">品牌操盤手</p>
                    <p className="mt-1 text-[12px] text-white/40">職能匹配</p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-adam-gold/50">
                    <path d="M10 4v12M6 12l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-adam-gold/20 p-4 text-center">
                    <p className="text-[12px] font-medium text-adam-gold/60">品牌定位</p>
                    <p className="mt-2 text-[14px] font-semibold text-white">差異化策略</p>
                  </div>
                  <div className="rounded-xl border border-adam-gold/20 p-4 text-center">
                    <p className="text-[12px] font-medium text-adam-gold/60">品牌定位</p>
                    <p className="mt-2 text-[14px] font-semibold text-white">視覺系統</p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-adam-gold/50">
                    <path d="M10 4v12M6 12l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="rounded-xl bg-adam-gold/10 p-4 text-center">
                  <p className="text-[14px] font-bold text-adam-gold">長期陪跑 · 品牌落地</p>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
