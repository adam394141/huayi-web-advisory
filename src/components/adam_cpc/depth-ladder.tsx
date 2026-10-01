'use client'

import { useState } from 'react'
import { FadeUp } from './motion'

interface LevelData {
  num: string
  title: string
  summary: string
  dark: boolean
  outline: { heading: string; items: string[] }[]
  outcome: string
}

const levels: LevelData[] = [
  {
    num: '01', title: 'AI 基礎與工具應用', dark: false,
    summary: '從第一次使用 AI，到掌握工具選擇、Prompt、多模態應用與基本判斷。',
    outline: [
      { heading: '生成式 AI 基礎觀念', items: ['大型語言模型的運作概念', 'AI 擅長與不擅長的事', '幻覺、錯誤與資料風險'] },
      { heading: '主流 AI 工具認識與選擇', items: ['ChatGPT／Gemini／Claude', '不同模型的特色與適用情境'] },
      { heading: 'Prompt 底層邏輯', items: ['任務、背景、角色、限制、輸出格式', '多輪對話與逐步修正'] },
      { heading: '多模態 AI 應用', items: ['文字、圖片、PDF、網頁與附件理解'] },
      { heading: 'AI 使用安全與查核', items: ['AI 回答查核', '個資與企業資料風險'] },
    ],
    outcome: '能獨立完成提問、分析、整理與內容產出，建立自己的 AI 基礎使用方法。',
  },
  {
    num: '02', title: 'AI 內容與創作應用', dark: true,
    summary: '從文案、企劃到圖像、影音與簡報，建立完整 AI 內容生產流程。',
    outline: [
      { heading: 'AI 文案與企劃', items: ['社群文案、活動文案、商品介紹', '提案企劃與腳本撰寫'] },
      { heading: '品牌語氣與內容一致性', items: ['Persona 與 Tone of Voice', '去除 AI 味', '跨平台改寫'] },
      { heading: 'AI 圖像生成與修改', items: ['圖像 Prompt 邏輯', '商品、社群、廣告素材'] },
      { heading: 'AI 影音應用', items: ['短影音腳本與分鏡', 'AI 影片生成、配音、音樂'] },
      { heading: 'AI 簡報與提案', items: ['Gamma 與 AI 簡報架構', '資料轉簡報'] },
    ],
    outcome: '完成一組從企劃、文案、圖片、影音到簡報的 AI 內容作品。',
  },
  {
    num: '03', title: 'AI 職場工作應用', dark: false,
    summary: '把 AI 放進每天真正會做的工作，而不是只學單一軟體操作。',
    outline: [
      { heading: '資訊整理與文件理解', items: ['長文摘要、PDF 理解、資料歸納', '多份文件比較'] },
      { heading: '會議與商務溝通', items: ['會議紀錄與待辦整理', 'Email、客戶回覆與商務文字'] },
      { heading: '企劃與報告', items: ['提案架構、市場資料與競品分析', '報告撰寫與決策摘要'] },
      { heading: '資料分析與洞察', items: ['表格資料理解', '找異常、數據解讀與圖表洞察'] },
      { heading: '不同職務的 AI 應用', items: ['行政、行銷、業務、人資、客服、主管'] },
    ],
    outcome: '把自己原本的一項日常工作重新設計成 AI 輔助流程。',
  },
  {
    num: '04', title: 'AI 知識管理與研究', dark: true,
    summary: '從「問 AI」進階到「讓 AI 讀懂自己的資料」，建立知識工作系統。',
    outline: [
      { heading: 'NotebookLM 深度應用', items: ['建立資料來源、多文件理解', '問答、摘要與專題研究'] },
      { heading: 'Deep Research', items: ['研究問題拆解', '市場研究、競爭分析與報告生成'] },
      { heading: '企業知識庫概念', items: ['SOP、制度、FAQ、教育訓練與內部文件'] },
      { heading: 'Notion × AI', items: ['資訊分類、專案知識、文件管理與 AI 協作'] },
      { heading: 'AI 第二大腦', items: ['收集、整理、搜尋、理解、再利用'] },
    ],
    outcome: '建立一套可實際查詢、研究與再利用的 AI 知識庫。',
  },
  {
    num: '05', title: 'AI 工作流程與自動化', dark: false,
    summary: '從「一次問一次」進入跨工具、可重複執行的 AI Workflow。',
    outline: [
      { heading: '工作流程盤點', items: ['找出重複工作、資訊斷點與人工搬運', '判斷哪些工作適合 AI 化'] },
      { heading: 'AI Workflow 設計', items: ['Input → Processing → Decision → Output → Human Review'] },
      { heading: '跨工具協作', items: ['ChatGPT／Gemini／Claude／NotebookLM／Notion／Google 生態'] },
      { heading: 'n8n 自動化', items: ['Trigger、API、AI Node、資料傳遞、自動通知'] },
      { heading: '企業工作流案例', items: ['客戶詢問、報告產出、行銷內容、資料整理'] },
    ],
    outcome: '完成一條可以實際執行、重複使用的 AI 工作流程。',
  },
  {
    num: '06', title: 'AI Agent 與任務代理', dark: true,
    summary: '從「AI 回答問題」進入「AI 能依目標執行任務」。',
    outline: [
      { heading: 'Agent 基礎觀念', items: ['Chatbot、Workflow、Agent 的差異', 'Tool Use、Memory、Context'] },
      { heading: '任務拆解', items: ['Goal、Planning、Action、Verification、Human Approval'] },
      { heading: 'Agent 使用場景', items: ['研究、行銷、客服、文件、資料 Agent'] },
      { heading: '多 Agent 協作', items: ['Planner、Worker、Reviewer、Orchestrator'] },
      { heading: '風險與治理', items: ['權限、資料、自動執行、人機協作與高風險確認'] },
    ],
    outcome: '設計一個可完成特定工作任務的 AI Agent，並定義人工確認邊界。',
  },
  {
    num: '07', title: 'Vibe Coding 與 AI 開發', dark: false,
    summary: '不一定是工程師，也能把需求與想法做成網站、工具與 MVP。',
    outline: [
      { heading: 'Vibe Coding 基礎', items: ['AI Coding 與需求描述', '如何與 Coding Agent 溝通'] },
      { heading: '網站與 Landing Page', items: ['網頁架構、UI、RWD、表單、部署'] },
      { heading: '企業內部工具', items: ['表單工具、Dashboard、CRM、查詢工具'] },
      { heading: '資料庫與 API', items: ['Database 基礎、CRUD、API、第三方服務串接'] },
      { heading: 'AI 開發工作流', items: ['Git、Claude Code / Coding Agent、Debug、Preview'] },
    ],
    outcome: '從零完成一個可以實際操作的小型 Web／AI 工具或 MVP。',
  },
  {
    num: '08', title: '企業 AI 數位轉型', dark: true,
    summary: '從個人會用 AI，進一步思考企業該把 AI 放在哪裡、如何導入與持續擴大。',
    outline: [
      { heading: '企業 AI 場景盤點', items: ['部門工作、高頻工作、重複工作、知識密集工作'] },
      { heading: 'AI 導入優先順序', items: ['高頻、規則清楚、資料取得容易、風險可控'] },
      { heading: 'AI ROI 評估', items: ['時間、人力、錯誤率、產出速度、流程週期'] },
      { heading: 'AI 解決方案設計', items: ['Knowledge Base、Workflow、Automation、Agent'] },
      { heading: 'PoC / MVP', items: ['小場景開始、快速驗證、回饋、改版、擴大導入'] },
      { heading: '治理與制度', items: ['AI 使用規範、資料安全、權限、風險管理'] },
      { heading: '企業 AI 能力建構', items: ['員工訓練、AI Champion、部門導入、持續改善'] },
    ],
    outcome: '完成一份企業 AI 導入藍圖，包含場景、優先順序、PoC 與後續導入方向。',
  },
]

function LevelAccordion({ lv, index }: { lv: LevelData; index: number }) {
  const [open, setOpen] = useState(false)
  const panelId = `level-panel-${lv.num}`
  const triggerId = `level-trigger-${lv.num}`

  return (
    <FadeUp delay={index * 0.04}>
      <div className={`overflow-hidden rounded-2xl ${lv.dark ? 'bg-adam-navy' : 'border border-adam-gold-line bg-white'}`}>
        <button
          id={triggerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
          className="flex w-full items-center gap-4 p-5 text-left md:gap-5 md:px-8 md:py-6"
        >
          <span
            className={`shrink-0 text-[32px] font-black ${lv.dark ? 'text-adam-gold/50' : 'text-adam-navy/25'}`}
            style={{ letterSpacing: '-0.03em' }}
          >
            {lv.num}
          </span>
          <div className="min-w-0 flex-1">
            <p className={`text-[18px] font-bold ${lv.dark ? 'text-white' : 'text-adam-navy'}`}>
              {lv.title}
            </p>
            <p className={`mt-1 text-[14px] ${lv.dark ? 'text-white/50' : 'text-adam-warm-gray'}`}>
              {lv.summary}
            </p>
          </div>
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-200 md:size-11 ${
              open
                ? 'rotate-45 border-adam-gold bg-adam-gold/10'
                : lv.dark
                  ? 'border-adam-gold/30 hover:border-adam-gold hover:bg-adam-gold/10'
                  : 'border-adam-gold/40 hover:border-adam-gold hover:bg-adam-gold/5'
            }`}
            aria-hidden="true"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={lv.dark ? 'text-adam-gold' : 'text-adam-gold'}>
              <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </button>

        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            <div className={`border-t px-5 pb-6 pt-5 md:px-8 md:pb-8 ${lv.dark ? 'border-white/10' : 'border-adam-gold-line'}`}>
              <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
                {lv.outline.map((section) => (
                  <div key={section.heading}>
                    <p className={`text-[14px] font-semibold ${lv.dark ? 'text-white/80' : 'text-adam-navy'}`}>
                      {section.heading}
                    </p>
                    <ul className={`mt-1.5 space-y-1 text-[13px] ${lv.dark ? 'text-white/40' : 'text-adam-warm-gray'}`}>
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className={`mt-1.5 inline-block size-1 shrink-0 rounded-full ${lv.dark ? 'bg-adam-gold/40' : 'bg-adam-gold/60'}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className={`mt-5 rounded-xl p-4 ${lv.dark ? 'bg-white/5' : 'bg-adam-ivory'}`}>
                <p className={`text-[12px] font-semibold ${lv.dark ? 'text-adam-gold' : 'text-adam-gold'}`}>
                  實作成果
                </p>
                <p className={`mt-1 text-[14px] ${lv.dark ? 'text-white/60' : 'text-adam-warm-gray'}`}>
                  {lv.outcome}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeUp>
  )
}

export function CpcDepthLadder() {
  return (
    <section id="levels" className="bg-adam-ivory py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <div className="mb-10 text-center md:mb-14">
            <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
              COMPLETE COVERAGE
            </p>
            <h2 className="mt-3 text-[26px] font-bold tracking-tight text-adam-navy md:text-[36px]" style={{ letterSpacing: '-0.01em' }}>
              Level 1–8，從基礎到進階皆可授課
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-[1.76] text-adam-warm-gray">
              以下每個 Level 都是 Adam 可以授課的能力範圍。點擊查看課程內容。
            </p>
          </div>
        </FadeUp>

        <div className="mx-auto flex max-w-[880px] flex-col gap-2">
          {levels.map((lv, i) => (
            <LevelAccordion key={lv.num} lv={lv} index={i} />
          ))}
        </div>

        <p className="mt-8 text-center text-[14px] text-adam-warm-gray/60">
          課程內容可依學員背景、產業、時數與工作場景彈性組合
        </p>
      </div>
    </section>
  )
}
