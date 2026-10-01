'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FadeUp, FadeIn } from './motion'

const tags = [
  '品牌', '設計', '創新', '創意', '雙定位',
  '傳產轉型', '二代接班', 'MMT 天賦系統', 'BGS 診斷', '品牌健檢',
]

export function RosieHero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-adam-navy pt-24">
      <div
        className="pointer-events-none absolute -right-[10%] -top-[20%] size-[800px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(196,164,100,0.12) 0%, transparent 65%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-5 pb-20 pt-8 md:px-8">
        <div className="grid items-center gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-20">
          <div className="order-2 md:order-1">
            <FadeUp>
              <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
                ROSIE · DUAL POSITIONING BRAND CONSULTANT
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className="mt-6 text-[28px] font-black leading-[1.2] tracking-tight text-white sm:text-[36px] lg:text-[48px]" style={{ letterSpacing: '-0.03em' }}>
                人放對位置，
                <br className="hidden sm:block" />
                <span className="text-adam-gold">品牌才會對。</span>
                <br />
                先定位人，
                <br className="hidden sm:block" />
                再定位品牌。
              </h1>
            </FadeUp>

            <FadeUp delay={0.15}>
              <p className="mt-6 max-w-[480px] text-[16px] leading-[1.7] text-white/60 md:text-[18px]">
                饒芝綺 Rosie──華翼品牌策略創辦人、雙定位品牌顧問。23 年品牌設計實戰、跨八大產業。用 BGS 企業成長診斷系統與 MMT 天賦系統，先把人放對位置，再把品牌放到市場上對的位置。
              </p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="mt-8 flex max-w-[480px] flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-adam-gold/[0.12] px-3.5 py-1 text-[13px] font-medium text-adam-gold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="#invitation"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-adam-gold px-9 py-[18px] text-[16px] font-bold tracking-wide text-adam-navy transition-all hover:brightness-110"
                >
                  預約企業健檢 →
                </Link>
                <Link
                  href="#methodology"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-9 py-[18px] text-[16px] font-medium text-white transition-all hover:border-adam-gold hover:text-adam-gold"
                >
                  看完整能力 ↓
                </Link>
              </div>
            </FadeUp>
          </div>

          <FadeIn delay={0.1} className="order-1 md:order-2">
            <div className="relative mx-auto w-full max-w-[400px] md:max-w-none">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[28px]">
                <Image
                  src="/rosie_cpc/rosie-professional.jpg"
                  alt="饒芝綺 Rosie — 雙定位品牌顧問"
                  fill
                  sizes="(max-width: 768px) 80vw, 40vw"
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-adam-navy to-transparent" />
              </div>
              <div className="absolute -bottom-5 left-6 right-6 flex items-center gap-3.5 rounded-2xl border border-adam-gold/20 bg-adam-navy-light px-5 py-4 backdrop-blur-xl">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-adam-gold/15">
                  <span className="font-mono text-[11px] font-bold text-adam-gold">MMT</span>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-white">
                    MMT 人才天賦系統 官方講師
                  </p>
                  <p className="mt-0.5 text-[12px] text-white/50">
                    2025 · MMT 官方認證
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-20"
        style={{ background: 'linear-gradient(to bottom, transparent, #F7F3EA)' }}
        aria-hidden="true"
      />
    </section>
  )
}
