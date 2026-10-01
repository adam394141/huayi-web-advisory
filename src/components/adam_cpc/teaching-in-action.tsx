'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FadeUp } from './motion'

const photos = [
  { src: '/adam_cpc/teaching-v-09.jpg', alt: 'Adam 企業內訓授課現場' },
  { src: '/adam_cpc/teaching-v-00.jpg', alt: 'Adam 小班實作授課' },
  { src: '/adam_cpc/teaching-v-01.jpg', alt: 'Adam 正式講座授課' },
  { src: '/adam_cpc/teaching-v-10.jpg', alt: 'Adam 趨勢演講' },
  { src: '/adam_cpc/teaching-v-02.jpg', alt: 'Adam 工作坊實作教學' },
  { src: '/adam_cpc/teaching-v-11.jpg', alt: 'Adam 課程結訓合照' },
]

export function CpcTeachingInAction() {
  return (
    <section className="bg-adam-navy py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
            TEACHING IN ACTION
          </p>
          <h2 className="mt-3 text-[26px] font-bold leading-[1.3] text-white md:text-[36px]">
            從講台到工作現場，累積真實授課經驗
          </h2>
          <p className="mt-3 max-w-[560px] text-[16px] leading-[1.7] text-white/55">
            以企業內訓、公開課、工作坊與 AI 實作課的長期授課經驗為基礎，課程以實作與成果為核心。
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {photos.map((p) => (
              <div key={p.src} className="overflow-hidden rounded-xl">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="mt-6 text-right">
            <Link
              href="/adam_cpc/teaching-records"
              className="text-[14px] text-adam-gold/60 transition-colors hover:text-adam-gold"
            >
              查看更多授課紀錄 →
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
