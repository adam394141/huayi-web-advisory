'use client'

import { FadeUp, StaggerContainer, StaggerItem } from './motion'

const modules = [
  {
    level: 'Level 1–3',
    title: 'AI 辦公效率與工作流程',
    desc: '行政文書、資料整理、報表、文件處理系統化導入 AI',
    audiences: ['行政', '營運', '全員'],
  },
  {
    level: 'Level 2–4',
    title: 'AI 品牌定位與內容行銷',
    desc: '品牌故事、社群貼文到電子報，AI 輔助內容產出流程',
    audiences: ['行銷', '品牌', '創業者'],
  },
  {
    level: 'Level 4',
    title: 'NotebookLM＋Notion 知識管理',
    desc: '建立可對話的企業知識庫，快速找到所需資訊',
    audiences: ['HR', '知識管理', '主管'],
  },
  {
    level: 'Level 2',
    title: 'AI 視覺設計與影音製作',
    desc: 'AI 圖像生成、影片腳本與視覺內容快速產出',
    audiences: ['設計', '行銷', '自媒體'],
  },
  {
    level: 'Level 6–7',
    title: 'AI Agent 與 Vibe Coding',
    desc: '不寫程式也能用 AI 建立工具、自動化流程與 MVP 原型',
    audiences: ['創業者', '產品', '技術主管'],
  },
  {
    level: 'Level 5–8',
    title: '企業 AI 導入與數位轉型',
    desc: '從場景盤點到落地執行，協助企業建立可持續的 AI 能力',
    audiences: ['經營者', '主管', '部門'],
  },
]

export function CpcCourseModules() {
  return (
    <section className="bg-adam-ivory py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <div className="mb-16 text-center">
            <p className="text-[13px] font-medium tracking-[0.18em] text-adam-gold">
              COURSE MODULES
            </p>
            <h2 className="mt-3 font-serif text-[26px] font-semibold tracking-tight text-adam-navy md:text-[36px]">
              代表性課程模組
            </h2>
            <p className="mx-auto mt-4 max-w-[600px] text-[16px] leading-[1.75] text-adam-warm-gray">
              以下是常見的授課主題。每個模組可獨立開課，也可依需求組合成半天、一天或系列課程。
            </p>
          </div>
        </FadeUp>

        <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <StaggerItem key={m.title}>
              <div className="flex h-full flex-col rounded-2xl border border-adam-gold-line bg-white p-7 transition-all hover:border-adam-gold/40 hover:shadow-lg">
                <span className="text-[12px] font-medium text-adam-warm-gray/60">
                  {m.level}
                </span>
                <h3 className="mt-3 text-[17px] font-bold text-adam-navy">
                  {m.title}
                </h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-adam-warm-gray">
                  {m.desc}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {m.audiences.map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-adam-blue-gray px-2.5 py-0.5 text-[11px] font-medium text-adam-navy/70"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <p className="mt-8 text-center text-[14px] text-adam-warm-gray/60">
          以上為代表性主題，可依產業、時數與學員組成調整內容
        </p>
      </div>
    </section>
  )
}
