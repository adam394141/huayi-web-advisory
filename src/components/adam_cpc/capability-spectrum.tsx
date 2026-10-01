'use client'

import { FadeUp, StaggerContainer, StaggerItem } from './motion'

const tools = [
  { name: 'ChatGPT', desc: '對話與工作應用' },
  { name: 'Gemini', desc: 'Google 生態整合' },
  { name: 'Claude', desc: '長文與深度分析' },
  { name: 'NotebookLM', desc: '知識庫與研究' },
  { name: 'AI Studio', desc: '模型實驗與測試' },
  { name: 'Gamma', desc: '簡報與視覺化' },
  { name: 'AI 圖像', desc: '圖像生成與編輯' },
  { name: 'AI 影片', desc: '影片與短影音' },
  { name: 'Notion', desc: '資訊與專案管理' },
  { name: 'n8n', desc: '工作流自動化' },
  { name: 'Agent', desc: 'AI 代理應用' },
  { name: 'Vibe Coding', desc: 'AI 輔助開發' },
]

export function CpcCapabilitySpectrum() {
  return (
    <section className="bg-adam-ivory py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <div className="mb-16 text-center">
            <p className="text-[13px] font-medium tracking-[0.18em] text-adam-gold">
              CAPABILITY SPECTRUM
            </p>
            <h2 className="mt-3 font-serif text-[26px] font-semibold tracking-tight text-adam-navy md:text-[36px]">
              不只會用一種 AI
            </h2>
            <p className="mx-auto mt-4 max-w-[560px] text-[16px] leading-[1.75] text-adam-warm-gray">
              從文字對話、圖像生成、影片製作，到自動化流程與 AI 系統開發，Adam
              的授課能力橫跨多種 AI 工具與應用場景。
            </p>
          </div>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {tools.map((t) => (
            <StaggerItem key={t.name}>
              <div className="rounded-2xl border border-adam-gold-line bg-white p-5 text-center transition-all hover:border-adam-gold/40 hover:shadow-lg md:p-6">
                <p className="text-[15px] font-semibold text-adam-navy">
                  {t.name}
                </p>
                <p className="mt-1 text-[12px] text-adam-warm-gray/70">
                  {t.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <p className="mt-6 text-center text-[14px] text-adam-warm-gray/60">
          以上為代表性工具，Adam 持續擴展 AI 教學能力範圍
        </p>
      </div>
    </section>
  )
}
