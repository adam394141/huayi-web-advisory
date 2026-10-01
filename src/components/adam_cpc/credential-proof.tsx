'use client'

import Image from 'next/image'
import { FadeUp } from './motion'

export function CpcCredentialProof() {
  return (
    <section className="bg-adam-navy py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <FadeUp>
            <div className="overflow-hidden rounded-[20px] border border-adam-gold/15 bg-adam-navy-light p-6 md:p-8">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src="/adam_cpc/cert-iqcs.webp"
                  alt="ISO/IEC 17024 IQCS AI Instructor 認證證書 — TW0005247"
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="object-contain"
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
                ISO/IEC 17024
                <br />
                IQCS 國際認證
              </h2>
              <p className="mt-4 text-[17px] leading-[1.7] text-white/55">
                通過 IQCS 依據 ISO/IEC 17024 標準辦理之 AI Instructor 資格考試，取得 AI Instructor — Competence of Prompt Engineer 資格。證書編號 TW0005247，有效期 2025.09.13–2028.09.12。
              </p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
