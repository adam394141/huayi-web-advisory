'use client'

import Link from 'next/link'
import { FadeUp } from './motion'

export function CpcBrandCase() {
  return (
    <section id="brand-case" className="scroll-mt-16 bg-adam-ivory py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
            BRAND CASE
          </p>
        </FadeUp>

        <div className="mt-6 grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <FadeUp delay={0.1}>
            <div className="overflow-hidden rounded-[20px] border border-adam-gold-line bg-white">
              <img
                src="/works/gaoda-farm/web/gaoda-cis-01-cover.webp"
                alt="高大牧場品牌識別設計——包含 LOGO、包裝與品牌色彩規劃"
                className="w-full"
                loading="lazy"
                decoding="async"
              />
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div>
              <h2 className="text-[22px] font-bold leading-[1.35] tracking-tight text-adam-navy md:text-[28px]" style={{ letterSpacing: '-0.01em' }}>
                80 年老品牌，如何從品牌定位一路做到新包裝？
              </h2>
              <p className="mt-5 text-[16px] leading-[1.8] text-adam-warm-gray md:text-[17px]">
                高大牧場有長年的酪農經驗。華翼從品牌定位出發，整理品牌識別與產品系列視覺，讓策略落到消費者實際看得見的包裝。這個專案獲得 2026 MUSE Creative Awards 銀獎。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/works/gaoda-farm"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-adam-navy px-7 py-[14px] text-[14px] font-bold text-white transition-all hover:bg-adam-navy-light"
                >
                  看高大牧場完整案例 →
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-adam-gold/30 px-7 py-[14px] text-[14px] font-medium text-adam-navy transition-all hover:border-adam-gold hover:text-adam-gold"
                >
                  聊品牌與經營
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
