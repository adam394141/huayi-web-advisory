'use client'

import Link from 'next/link'
import { FadeUp } from './motion'

const records = [
  { title: '陸仕企業', desc: '12 週 AI 企業內訓課程', type: '企業內訓' },
  { title: '自強基金會', desc: 'AI 課程', date: '2026.07', type: '法人培訓' },
  { title: '誠研科技（台東）', desc: 'AI 課程', date: '2026.07', type: '企業內訓' },
  { title: '破風者 AI 社群', desc: '手機 AI 帶貨實戰班', date: '2026.05', type: '公開課' },
]

export function CpcTeachingRecords() {
  return (
    <section className="bg-adam-navy py-20 md:py-[100px]">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
          <FadeUp>
            <div>
              <p className="text-[13px] font-semibold tracking-[0.15em] text-adam-gold">
                TEACHING RECORDS
              </p>
              <h2 className="mt-3 text-[28px] font-bold leading-[1.3] text-white md:text-[36px]">
                真的有在教
              </h2>
              <p className="mt-4 max-w-[400px] text-[17px] leading-[1.7] text-white/55">
                以下是已驗證的授課紀錄，完整紀錄可點進查看。
              </p>
              <Link
                href="/adam_cpc/teaching-records"
                className="mt-8 inline-flex items-center gap-2 rounded-[14px] border border-adam-gold/30 px-7 py-3.5 text-[15px] font-semibold text-adam-gold transition-all hover:border-adam-gold hover:bg-adam-gold/10"
              >
                查看全部授課記錄 →
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="flex flex-col gap-3">
              {records.map((r) => (
                <div
                  key={r.title}
                  className="rounded-2xl border border-white/8 bg-adam-navy-light px-6 py-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[16px] font-semibold text-white">
                        {r.title}
                      </p>
                      <p className="mt-1 text-[13px] text-white/45">{r.desc}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      {r.date && (
                        <span className="text-[12px] font-medium text-white/35">
                          {r.date}
                        </span>
                      )}
                      <span className="rounded-full bg-adam-gold/15 px-2.5 py-0.5 text-[11px] font-medium text-adam-gold">
                        {r.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
