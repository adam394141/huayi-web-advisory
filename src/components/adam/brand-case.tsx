'use client'

import Link from 'next/link'
import { FadeUp } from './motion'

export function CpcBrandCase() {
  return (
    <section id="brand-case" className="scroll-mt-16 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
            BRAND CASES
          </p>
        </FadeUp>

        {/* 案例一：高大牧場 */}
        <div className="mt-6 grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <FadeUp delay={0.1}>
            <div className="overflow-hidden rounded-[20px] border border-adam-gold-line">
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
                高大牧場｜80 年老品牌，如何從定位走到新包裝？
              </h2>
              <p className="mt-5 text-[16px] leading-[1.8] text-adam-warm-gray md:text-[17px]">
                高大牧場有長年的酪農經驗。華翼從品牌定位出發，整理品牌識別與產品系列視覺，讓策略落到消費者實際看得見的包裝。這個專案獲得 2026 MUSE Creative Awards 銀獎。
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">
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

        {/* 案例二：情境示例 */}
        <FadeUp delay={0.2}>
          <div className="mt-14 rounded-[20px] border border-adam-gold-line bg-adam-ivory p-7 md:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-12">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.12em] text-adam-gold">CASE IN PROGRESS</p>
                <h3 className="mt-3 text-[20px] font-bold leading-[1.35] text-adam-navy md:text-[24px]">
                  工廠想做自有品牌，第一支產品怎麼選？
                </h3>
              </div>
              <div>
                <p className="text-[15px] leading-[1.8] text-adam-warm-gray md:text-[16px]">
                  <strong className="text-adam-navy">原本卡在哪裡：</strong>產品線有十幾支，工廠什麼都能做，但要掛自己的品牌時，不知道該從哪一支開始。每支的成本結構、備料週期和潛在客群都不同，沒有一個簡單答案。
                </p>
                <p className="mt-4 text-[15px] leading-[1.8] text-adam-warm-gray md:text-[16px]">
                  <strong className="text-adam-navy">Adam 先做什麼：</strong>先盤點每支產品的成本、現有通路和客群輪廓。從「做得出來」「賣得動」「利潤撐得住」三個條件交叉比對，找出最適合先投入的品項，再規劃品牌定位和第一波上市策略。
                </p>
                <p className="mt-3 text-[13px] text-adam-warm-gray/60">
                  此為澄清問題的情境示例，完整案例待客戶核准後公開。
                </p>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* 我通常怎麼開始 */}
        <FadeUp delay={0.25}>
          <div className="mt-14 max-w-[720px]">
            <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
              HOW I START
            </p>
            <h3 className="mt-3 text-[20px] font-bold leading-[1.35] text-adam-navy md:text-[24px]">
              我通常怎麼開始？
            </h3>
            <p className="mt-5 text-[16px] leading-[1.85] text-adam-warm-gray md:text-[17px]">
              老闆說想做品牌，我通常會先問：你最想賣哪一支產品？誰會買？這支如果真的賣起來，你的成本、產能和通路接得住嗎？這幾件事攤開來看，才知道下一步要改的是品牌定位、產品組合，還是公司裡的工作流程。
            </p>
            <div className="mt-7">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-adam-gold px-8 py-[14px] text-[14px] font-bold text-adam-navy transition-all hover:brightness-110"
              >
                聊品牌與經營 →
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
