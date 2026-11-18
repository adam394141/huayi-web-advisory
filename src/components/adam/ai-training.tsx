'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FadeUp } from './motion'

const levels = [
  { num: '01', title: 'AI 基礎與工具應用', desc: '從第一次使用 AI，到掌握工具選擇、Prompt 與基本判斷。' },
  { num: '02', title: 'AI 內容與創作應用', desc: '文案、企劃、圖像、影音與簡報的 AI 內容生產流程。' },
  { num: '03', title: 'AI 資料分析與商業洞察', desc: '用 AI 整理數據、找出商業洞察與報告自動化。' },
  { num: '04', title: 'AI 工作流與效率系統', desc: 'AI 串接日常工具，建立自動化工作流。' },
  { num: '05', title: 'AI Agent 應用', desc: '讓 AI 自主執行多步驟任務與協作。' },
  { num: '06', title: 'AI 程式應用（Vibe Coding）', desc: '不寫程式也能用 AI 開發工具和系統。' },
  { num: '07', title: 'AI 策略與組織轉型', desc: '企業導入 AI 的策略規劃與團隊建置。' },
  { num: '08', title: 'AI 數位轉型實戰', desc: '從診斷到落地，完整的企業 AI 轉型陪跑。' },
]

const collabModels = [
  { name: '趨勢講座', time: '1.5–2 hr', size: '30–50 人' },
  { name: '實作課', time: '3–6 hr', size: '20–40 人' },
  { name: '工作坊', time: '6–12 hr', size: '15–30 人' },
  { name: '密集班', time: '6–18 hr', size: '10–20 人' },
  { name: '企業陪跑', time: '4–12 週', size: '部門團隊' },
]

export function CpcAiTraining() {
  const [showCurriculum, setShowCurriculum] = useState(false)

  return (
    <section id="ai-training" className="scroll-mt-16 bg-adam-navy py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
            AI TRAINING
          </p>
          <h2 className="mt-4 text-[22px] font-bold leading-[1.35] text-white md:text-[30px]">
            把 AI 用進團隊每天做的工作
          </h2>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="mt-5 max-w-[640px] text-[16px] leading-[1.8] text-white/55 md:text-[17px]">
            先選一件團隊常做、又耗時間的工作，例如整理文件、交接知識或製作例行報告。內訓用團隊熟悉的場景練習；想接到日常流程，也可以從工作盤點開始，再安排小範圍試行。
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/adam/teaching-records"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-7 py-[14px] text-[14px] font-medium text-white transition-all hover:border-adam-gold hover:text-adam-gold"
            >
              查看授課紀錄 →
            </Link>
            <a
              href="#invitation"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-adam-gold px-7 py-[14px] text-[14px] font-bold text-adam-navy transition-all hover:brightness-110"
            >
              洽詢 AI 內訓
            </a>
          </div>
        </FadeUp>

        {/* 合作形式 */}
        <FadeUp delay={0.2}>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {collabModels.map((m) => (
              <div key={m.name} className="rounded-[16px] border border-adam-gold/15 bg-adam-navy-light p-4 text-center">
                <p className="text-[15px] font-semibold text-white">{m.name}</p>
                <p className="mt-1 text-[12px] text-white/40">{m.time}・{m.size}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* 可展開課綱 */}
        <FadeUp delay={0.25}>
          <div className="mt-10">
            <button
              onClick={() => setShowCurriculum(!showCurriculum)}
              className="flex items-center gap-2 text-[14px] font-medium text-adam-gold transition-colors hover:text-adam-gold/80"
            >
              <span>{showCurriculum ? '收合' : '展開'} Level 1–8 完整課綱</span>
              <span className="text-[12px]">{showCurriculum ? '▲' : '▼'}</span>
            </button>

            {showCurriculum && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {levels.map((lv) => (
                  <div key={lv.num} className="rounded-[16px] border border-adam-gold/15 bg-adam-navy-light p-5">
                    <p className="text-[12px] font-bold text-adam-gold">LEVEL {lv.num}</p>
                    <p className="mt-1 text-[15px] font-semibold text-white">{lv.title}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-white/45">{lv.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
