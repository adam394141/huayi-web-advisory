'use client'

import Image from 'next/image'
import { FadeUp, FadeIn } from './motion'

export function CpcHero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-adam-navy pt-24 md:min-h-screen">
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
                HUAYI / BRAND & AI
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className="mt-6 text-[32px] font-black leading-[1.15] tracking-tight text-white sm:text-[40px] lg:text-[52px]" style={{ letterSpacing: '-0.03em' }}>
                陳宗民 Adam
              </h1>
              <p className="mt-3 text-[17px] font-medium leading-relaxed text-white/70 md:text-[20px]">
                品牌策略顧問｜企業 AI 導入與內訓
              </p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <p className="mt-6 max-w-[480px] text-[16px] leading-[1.75] text-white/55 md:text-[17px]">
                我協助中小企業和接班團隊釐清客群、產品差異和品牌方向。想從代工走向自有品牌，或想讓團隊把 AI 用進文件整理、知識交接和日常工作，都可以從你現在最卡的那一步談起。
              </p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="mt-5 text-[14px] font-semibold tracking-wide text-adam-gold/80">
                品牌決定方向，AI 決定速度
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href="#brand-case"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-adam-gold px-8 py-[16px] text-[15px] font-bold tracking-wide text-adam-navy transition-all hover:brightness-110"
                >
                  看品牌案例 ↓
                </a>
                <a
                  href="#ai-training"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-8 py-[16px] text-[15px] font-medium text-white transition-all hover:border-adam-gold hover:text-adam-gold"
                >
                  詢問 AI 內訓 ↓
                </a>
              </div>
            </FadeUp>
          </div>

          <FadeIn delay={0.1} className="order-1 md:order-2">
            <div className="relative mx-auto w-full max-w-[340px] md:max-w-none">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[28px]">
                <Image
                  src="/adam/adam-professional.jpg"
                  alt="陳宗民 Adam — 品牌策略顧問・企業 AI 內訓"
                  fill
                  sizes="(max-width: 768px) 70vw, 40vw"
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-adam-navy to-transparent" />
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
