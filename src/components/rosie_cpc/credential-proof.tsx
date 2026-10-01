'use client'

import Image from 'next/image'
import { FadeUp } from './motion'

export function RosieCredentialProof() {
  return (
    <section className="bg-adam-navy py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <FadeUp>
            <div className="overflow-hidden rounded-[20px] border border-adam-gold/15 bg-adam-navy-light p-6 md:p-8">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src="/rosie_cpc/cert-mmt.jpg"
                  alt="Rosie 於 MMT Mercury Mental Thinking 活動取得官方講師認證"
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div>
              <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
                CREDENTIAL PROOF
              </p>
              <h2 className="mt-4 text-[26px] font-bold leading-[1.3] text-white md:text-[32px]">
                MMT 人才天賦系統
                <br />
                官方認證講師
              </h2>
              <p className="mt-4 text-[17px] leading-[1.7] text-white/55">
                通過 MMT（Mercury Mental Thinking）人才天賦系統官方認證，取得官方講師資格。品牌顧問不懂人，天賦老師不懂品牌──Rosie 是少數同時具備品牌設計實戰與天賦系統解讀能力的雙定位顧問。
              </p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
