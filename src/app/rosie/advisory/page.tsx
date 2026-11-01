import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MotionProvider } from '@/components/rosie/motion'
import { FadeUp, FadeIn } from '@/components/rosie/motion'
import { AdvisoryForm } from '@/components/rosie/advisory-form'

export const metadata: Metadata = {
  title: '私人評估申請｜華翼企業諮詢 Private Advisory',
  description:
    '為正在經歷重大轉折的企業主與決策者，提供結構診斷與恢復路徑。讓你的決策與關係系統，回到可控。',
  openGraph: {
    title: '讓你的決策與關係系統，回到可控。',
    description:
      '私人評估申請 · 由顧問本人審閱。為正在經歷重大轉折的企業主與決策者，提供結構診斷與恢復路徑。',
    url: 'https://huayi.tw/rosie/advisory',
    siteName: '華翼品牌策略',
    locale: 'zh_TW',
    type: 'website',
  },
}

const STEPS = [
  { num: '1', title: '提交申請', desc: '回答 5 題狀態問題，留下基本資料。' },
  { num: '2', title: '顧問親自審閱', desc: '不是系統自動產生，是顧問本人閱讀。' },
  {
    num: '3',
    title: '收到《狀態快照》',
    desc: '一段結構判讀，加上建議的起始路徑與諮詢預約。',
  },
]

const STATES = [
  {
    tag: 'DECISION',
    title: '決策失衡',
    desc: '重大決定反覆拖延。過去果斷的你，開始不信任自己的判斷。',
  },
  {
    tag: 'RELATIONSHIP',
    title: '關係失衡',
    desc: '伴侶、家族或合夥人之間的張力，已經開始滲進事業與每一次判斷。',
  },
  {
    tag: 'RHYTHM',
    title: '節律失衡',
    desc: '壓力長期高載。專注、睡眠與耐性，一項一項開始失守。',
  },
]

const METHOD_STEPS = [
  {
    idx: '01',
    title: '定位真正的層次',
    desc: '你說出口的問題，往往不是真正需要處理的那一層。我們先找到它。',
  },
  {
    idx: '02',
    title: '還原觸發結構',
    desc: '在什麼場景、被什麼觸發、壓力從哪裡來。看見結構，情緒就會退回它該在的位置。',
  },
  {
    idx: '03',
    title: '重建操作序列',
    desc: '先做什麼、後做什麼、什麼現在不要碰。具體到下週就能執行。',
  },
]

const PATHS = [
  {
    tag: '01 · 入門',
    featured: false,
    title: '系統深度評估',
    desc: '一次 120 分鐘深度評估，交付書面《失衡根源圖》與 30 天優先行動清單。',
    deliver: '你會清楚知道問題的真正層次，以及第一個該動的槓桿。',
    price: '洽詢',
  },
  {
    tag: '02 · 核心',
    featured: true,
    title: '12 週系統重建',
    desc: '每週一次 90 分鐘會談、日常訊息支持與每週操作任務。第 0 週與第 12 週各做一次狀態評估。',
    deliver: '決策速度、衝突頻率、節律穩定度，12 週前後的對照紀錄。',
    price: '洽詢',
  },
  {
    tag: '03 · 高階 · 邀請制',
    featured: false,
    title: '年度私人顧問',
    desc: '重大節點即時介入：併購與接班、婚姻與家族、公開危機。',
    deliver: '關鍵時刻，你身邊有一位看得懂你系統的人。',
    price: '依邀請另議',
  },
]

export default function AdvisoryPage() {
  return (
    <>
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              '[data-motion]{opacity:1!important;transform:none!important}',
          }}
        />
      </noscript>
      <Header />
      <MotionProvider>
        <main>
          {/* Hero */}
          <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-adam-navy pt-24">
            <div
              className="pointer-events-none absolute -right-[10%] -top-[20%] size-[800px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(196,164,100,0.08) 0%, transparent 65%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 mx-auto max-w-[1200px] px-5 pb-20 pt-8 md:px-8">
              <div className="grid items-center gap-12 md:grid-cols-[1.2fr_0.8fr] md:gap-16">
                <div>
                  <FadeUp>
                    <p className="text-[13px] font-semibold tracking-[0.18em] text-adam-gold">
                      限額受理 · 顧問親自審閱
                    </p>
                  </FadeUp>

                  <FadeUp delay={0.1}>
                    <h1
                      className="mt-6 font-serif text-[28px] font-bold leading-[1.25] text-white sm:text-[36px] lg:text-[48px]"
                      style={{ letterSpacing: '-0.02em' }}
                    >
                      讓你的決策與關係系統，
                      <br />
                      回到可控。
                    </h1>
                  </FadeUp>

                  <FadeUp delay={0.15}>
                    <p className="mt-6 max-w-[520px] text-[17px] leading-[1.7] text-white/80 md:text-[19px]">
                      我不處理你的情緒。
                      <br className="hidden sm:block" />
                      我協助你恢復系統的穩定性。
                    </p>
                  </FadeUp>

                  <FadeUp delay={0.2}>
                    <p className="mt-4 max-w-[520px] text-[15px] leading-[1.8] text-white/50">
                      為正在經歷重大轉折的企業主與決策者，提供結構診斷與恢復路徑。不給安慰，給你看得見、做得到的下一步。
                    </p>
                  </FadeUp>

                  <FadeUp delay={0.25}>
                    <div className="mt-10 flex flex-wrap items-center gap-4">
                      <Link
                        href="#apply"
                        className="inline-flex items-center justify-center rounded-2xl bg-adam-gold px-9 py-[18px] text-[16px] font-bold tracking-wide text-adam-navy transition-all hover:brightness-110"
                      >
                        申請私人評估 →
                      </Link>
                      <span className="text-[13px] text-white/40">
                        約 3 分鐘 · 由顧問本人審閱
                      </span>
                    </div>
                  </FadeUp>
                </div>

                <FadeIn delay={0.15}>
                  <div className="rounded-3xl border border-white/8 bg-adam-navy-light p-7 md:p-8">
                    <p className="mb-5 text-[12px] font-semibold tracking-[0.2em] text-white/40">
                      評估如何進行
                    </p>
                    <ol className="flex flex-col gap-5">
                      {STEPS.map((s) => (
                        <li key={s.num} className="flex gap-4">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-adam-gold/15 font-serif text-[15px] font-semibold text-adam-gold">
                            {s.num}
                          </span>
                          <div>
                            <p className="text-[15px] font-medium text-white">
                              {s.title}
                            </p>
                            <p className="mt-0.5 text-[13px] leading-relaxed text-white/45">
                              {s.desc}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* States */}
          <section className="bg-adam-navy">
            <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
              <FadeUp>
                <p className="text-[13px] font-semibold tracking-[0.18em] text-adam-gold">
                  如果你正處在這樣的狀態
                </p>
                <h2 className="mt-4 font-serif text-[26px] font-semibold leading-tight text-white sm:text-[32px]">
                  表面上一切如常，
                  <br className="hidden sm:block" />
                  但你知道，系統正在鬆動。
                </h2>
              </FadeUp>

              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {STATES.map((s, i) => (
                  <FadeUp key={s.tag} delay={i * 0.08}>
                    <article className="rounded-2xl border border-white/8 bg-adam-navy-light p-7">
                      <p className="text-[11px] font-semibold tracking-[0.2em] text-white/30">
                        {s.tag}
                      </p>
                      <h3 className="mt-3 font-serif text-[22px] font-semibold text-white">
                        {s.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-[1.75] text-white/55">
                        {s.desc}
                      </p>
                    </article>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>

          {/* Method */}
          <section className="border-t border-white/6 bg-adam-navy">
            <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
              <div className="grid gap-14 md:grid-cols-[1fr_1.3fr] md:gap-20">
                <FadeUp>
                  <div>
                    <p className="text-[13px] font-semibold tracking-[0.18em] text-adam-gold">
                      方法
                    </p>
                    <h2 className="mt-4 font-serif text-[26px] font-semibold leading-tight text-white sm:text-[32px]">
                      不是安慰，
                      <br />
                      是結構診斷。
                    </h2>
                    <p className="mt-5 text-[15px] leading-[1.8] text-white/50">
                      結合 22 型企業決策顧問經驗與個人決策模式模型，服務超過
                      300 位企業主與決策者。
                    </p>
                  </div>
                </FadeUp>

                <div className="flex flex-col">
                  {METHOD_STEPS.map((s, i) => (
                    <FadeUp key={s.idx} delay={i * 0.08}>
                      <div className="flex gap-6 border-t border-white/8 py-7">
                        <span className="shrink-0 font-serif text-[15px] text-adam-gold">
                          {s.idx}
                        </span>
                        <div>
                          <h3 className="text-[18px] font-medium text-white">
                            {s.title}
                          </h3>
                          <p className="mt-2 text-[15px] leading-[1.75] text-white/55">
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Paths */}
          <section className="border-t border-white/6 bg-adam-navy">
            <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
              <FadeUp>
                <p className="text-[13px] font-semibold tracking-[0.18em] text-adam-gold">
                  三條路徑
                </p>
                <h2 className="mt-4 font-serif text-[26px] font-semibold leading-tight text-white sm:text-[32px]">
                  每一條路徑，都先說清楚交付什麼。
                </h2>
                <p className="mt-3 text-[15px] text-white/50">
                  顧問會在《狀態快照》中，建議最適合你的起點。
                </p>
              </FadeUp>

              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {PATHS.map((p, i) => (
                  <FadeUp key={p.tag} delay={i * 0.08}>
                    <article
                      className={`flex flex-col gap-5 rounded-2xl border p-7 md:p-8 ${
                        p.featured
                          ? 'border-adam-gold/40 bg-adam-navy-light'
                          : 'border-white/8 bg-adam-navy-light'
                      }`}
                    >
                      <p
                        className={`text-[12px] font-semibold tracking-[0.18em] ${
                          p.featured ? 'text-adam-gold' : 'text-white/35'
                        }`}
                      >
                        {p.tag}
                      </p>
                      <h3 className="font-serif text-[24px] font-semibold text-white">
                        {p.title}
                      </h3>
                      <p className="text-[15px] leading-[1.75] text-white/55">
                        {p.desc}
                      </p>
                      <div className="border-t border-white/8 pt-5">
                        <p className="text-[12px] font-semibold tracking-[0.18em] text-adam-gold">
                          交付
                        </p>
                        <p className="mt-2 text-[15px] leading-[1.75] text-white/65">
                          {p.deliver}
                        </p>
                      </div>
                      <p className="mt-auto font-serif text-[18px] text-white/70">
                        {p.price}
                      </p>
                    </article>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>

          {/* Form */}
          <section
            id="apply"
            className="scroll-mt-20 border-t border-white/6 bg-adam-navy"
            tabIndex={-1}
          >
            <div className="mx-auto max-w-[760px] px-5 py-20 md:px-8 md:py-28">
              <FadeUp>
                <p className="text-[13px] font-semibold tracking-[0.18em] text-adam-gold">
                  私人評估申請
                </p>
                <h2 className="mt-4 font-serif text-[26px] font-semibold leading-tight text-white sm:text-[32px]">
                  先告訴我，現在是哪裡失衡。
                </h2>
                <p className="mt-3 text-[15px] text-white/50">
                  所有資料僅由顧問本人閱讀，不公開，可隨時要求刪除。
                </p>
              </FadeUp>

              <FadeUp delay={0.1}>
                <div className="mt-10 rounded-3xl border border-white/8 bg-adam-navy-light p-6 md:p-10">
                  <AdvisoryForm />
                </div>
              </FadeUp>
            </div>
          </section>

          {/* Rosie footer info */}
          <section className="border-t border-white/6 bg-adam-navy">
            <div className="mx-auto max-w-[1200px] px-5 py-12 md:px-8 md:py-16">
              <div className="flex flex-wrap items-start justify-between gap-8">
                <div>
                  <p className="font-serif text-[17px] font-semibold text-white">
                    饒芝綺 Rosie｜首席顧問
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/40">
                    22 年企業決策顧問經驗，服務 300+
                    位企業主與機構。台灣 · 服務亞洲華語決策者。
                  </p>
                </div>
                <p className="text-[13px] leading-relaxed text-white/30">
                  本服務為決策與關係系統顧問，不提供醫療診斷、心理治療或命運預測。
                  <br />
                  如有需要，顧問會協助轉介合適的專業資源。
                </p>
              </div>
            </div>
          </section>
        </main>
      </MotionProvider>
      <Footer />
    </>
  )
}
