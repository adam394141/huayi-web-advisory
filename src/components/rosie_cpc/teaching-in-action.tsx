'use client'

import Image from 'next/image'
import { FadeUp } from './motion'

const photos = [
  { src: '/rosie_cpc/teaching-v-00.jpg', alt: 'Rosie MMT 天賦課程授課現場' },
  { src: '/rosie_cpc/teaching-v-01.jpg', alt: 'Rosie 小班品牌諮詢工作坊' },
  { src: '/rosie_cpc/teaching-v-02.jpg', alt: 'Rosie MMT 討論互動' },
  { src: '/rosie_cpc/teaching-v-03.jpg', alt: 'Rosie 大場地品牌講座' },
  { src: '/rosie_cpc/teaching-v-04.jpg', alt: 'Rosie 品牌工作坊小組互動' },
  { src: '/rosie_cpc/teaching-v-05.jpg', alt: 'Rosie 品牌定位實戰授課' },
]

export function RosieTeachingInAction() {
  return (
    <section className="bg-adam-navy py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
            TEACHING IN ACTION
          </p>
          <h2 className="mt-3 text-[26px] font-bold leading-[1.3] text-white md:text-[36px]">
            從品牌諮詢到現場授課，累積真實實戰經驗
          </h2>
          <p className="mt-3 max-w-[560px] text-[16px] leading-[1.7] text-white/55">
            以企業品牌健檢、MMT 天賦工作坊、品牌定位課程的長期實務經驗為基礎，每一場都是落地可用的品牌方案。
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
      </div>
    </section>
  )
}
