'use client'

import { FadeUp, StaggerContainer, StaggerItem } from './motion'

const audiences = [
  {
    title: '一般職員',
    tags: ['AI 入門', '工具使用', '工作效率'],
    levels: '推薦 Level 1–3',
  },
  {
    title: '行政與知識工作者',
    tags: ['辦公應用', '知識管理', '流程整理'],
    levels: '推薦 Level 3–5',
  },
  {
    title: '行銷企劃',
    tags: ['內容創作', '品牌行銷', '圖像影音'],
    levels: '推薦 Level 2–4',
  },
  {
    title: '主管',
    tags: ['分析決策', '工作流程', 'Agent'],
    levels: '推薦 Level 4–7',
  },
  {
    title: '經營者',
    tags: ['商業應用', 'AI 導入', '數位轉型'],
    levels: '推薦 Level 5–8',
  },
]

export function CpcAudienceRoutes() {
  return (
    <section className="bg-adam-ivory py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <FadeUp>
          <div className="mb-16 text-center">
            <p className="text-[13px] font-medium tracking-[0.18em] text-adam-gold">
              AUDIENCE ROUTES
            </p>
            <h2 className="mt-3 font-serif text-[26px] font-semibold tracking-tight text-adam-navy md:text-[36px]">
              同一套能力，依角色重新組合
            </h2>
            <p className="mx-auto mt-4 max-w-[600px] text-[16px] leading-[1.75] text-adam-warm-gray">
              課程內容可依學員背景、產業、時數與實際工作場景彈性組合。以下是依常見角色推薦的學習路徑。
            </p>
          </div>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {audiences.map((a) => (
            <StaggerItem key={a.title}>
              <div className="flex h-full flex-col rounded-2xl border border-adam-gold-line bg-white p-6 transition-all hover:border-adam-gold/40 hover:shadow-lg md:p-7">
                <h3 className="text-[17px] font-bold text-adam-navy">
                  {a.title}
                </h3>
                <div className="mt-4 flex flex-1 flex-col gap-2">
                  {a.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-adam-blue-gray px-3 py-1 text-[12px] font-medium text-adam-navy"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-[12px] text-adam-warm-gray/60">
                  {a.levels}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
