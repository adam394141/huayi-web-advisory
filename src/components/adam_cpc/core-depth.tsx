'use client'

import { FadeUp } from './motion'

const officeSkills = [
  '資料蒐集與研究', '文件理解與整理', '會議摘要',
  '企劃與報告', '知識整理', '跨工具協作', 'n8n 自動化',
]

const transformSkills = [
  'AI 場景盤點', '部門流程診斷', '導入優先順序',
  'PoC / MVP', 'AI 治理', '能力建構',
]

export function CpcCoreDepth() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <div className="mb-16 text-center">
            <p className="text-[13px] font-medium tracking-[0.18em] text-adam-gold">
              CORE DEPTH
            </p>
            <h2 className="mt-3 font-serif text-[26px] font-semibold tracking-tight text-adam-navy md:text-[36px]">
              辦公室工作 × 企業 AI 數位轉型
            </h2>
            <p className="mx-auto mt-4 max-w-[600px] text-[16px] leading-[1.75] text-adam-warm-gray">
              Adam 最擅長的，是把 AI 放進每天的工作、知識、流程與企業運作。不是理論演講，而是帶著你的真實案例一起動手。
            </p>
          </div>
        </FadeUp>

        <div className="grid gap-8 md:grid-cols-2">
          <FadeUp delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl border border-adam-gold-line bg-[#FAF7F0] p-10">
              <div
                className="pointer-events-none absolute -right-10 -top-10 size-[200px] rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #C4A464 0%, transparent 70%)' }}
                aria-hidden="true"
              />
              <p className="text-[13px] font-semibold tracking-[0.1em] text-adam-gold">
                Level 3 · Level 5
              </p>
              <h3 className="mt-3 font-serif text-[24px] font-semibold text-adam-navy">
                AI 辦公室工作應用
              </h3>
              <p className="mt-3 text-[16px] leading-[1.75] text-adam-warm-gray">
                把 AI 融入資料蒐集、文件整理、會議摘要、企劃報告、知識管理與日常流程，讓工作自然提速。
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {officeSkills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-adam-blue-gray px-3 py-1.5 text-[12px] font-medium text-adam-navy"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="relative overflow-hidden rounded-3xl bg-adam-navy p-10">
              <div
                className="pointer-events-none absolute -right-10 -top-10 size-[200px] rounded-full opacity-15"
                style={{ background: 'radial-gradient(circle, #C4A464 0%, transparent 70%)' }}
                aria-hidden="true"
              />
              <p className="text-[13px] font-semibold tracking-[0.1em] text-adam-gold">
                Level 8
              </p>
              <h3 className="mt-3 font-serif text-[24px] font-semibold text-white">
                企業 AI 數位轉型
              </h3>
              <p className="mt-3 text-[16px] leading-[1.75] text-white/65">
                從場景盤點、流程診斷到導入落地，幫企業找到 AI 能幫上忙的地方，建立可持續運作的 AI 能力。
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {transformSkills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white/70"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
