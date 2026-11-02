import type { Metadata } from 'next'
import Link from 'next/link'
import { MotionProvider } from '@/components/rosie/motion'
import { FadeUp, FadeIn } from '@/components/rosie/motion'

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

const ADV = {
  bg: '#E8E3DC',
  bgAlt: '#DDD8D0',
  text: '#2A2520',
  muted: '#8A847B',
  red: '#C13B2A',
  cream: '#F5F0E8',
  dark: '#2A2520',
  darkCard: '#302B25',
  banner: '#8B1A1A',
}

function SealStamp({
  chars,
  size = 72,
  rotate = -4,
}: {
  chars: [string, string, string, string]
  size?: number
  rotate?: number
}) {
  const half = size / 2
  const fontSize = size * 0.34
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        border: `3px solid ${ADV.red}`,
        transform: `rotate(${rotate}deg)`,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        alignItems: 'center',
        justifyItems: 'center',
        fontFamily: 'var(--font-serif), serif',
        fontSize,
        fontWeight: 700,
        color: ADV.red,
        lineHeight: 1,
        boxShadow: `inset 0 0 ${half * 0.15}px rgba(193,59,42,0.12), 0 0 0 1px rgba(193,59,42,0.08)`,
        opacity: 0.85,
        flexShrink: 0,
      }}
    >
      <span>{chars[0]}</span>
      <span>{chars[1]}</span>
      <span>{chars[2]}</span>
      <span>{chars[3]}</span>
    </div>
  )
}

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
    price: 'NT$24,000',
    priceNote: '前 30 分鐘免費',
    duration: null,
  },
  {
    tag: '02 · 核心',
    featured: true,
    title: '12 週系統重建',
    desc: '每週一次 90 分鐘會談、日常訊息支持與每週操作任務。第 0 週與第 12 週各做一次狀態評估。',
    deliver: '決策速度、衝突頻率、節律穩定度，12 週前後的對照紀錄。',
    price: 'NT$280,000',
    priceNote: '評估後 14 天內升級，入門費用全額抵用',
    duration: '12 週，每週 2–3 小時',
  },
  {
    tag: '03 · 高階 · 邀請制',
    featured: false,
    title: '年度私人顧問',
    desc: '重大節點即時介入：併購與接班、婚姻與家族、公開危機。',
    deliver: '關鍵時刻，你身邊有一位看得懂你系統的人。',
    price: '依邀請另議',
    priceNote: null,
    duration: null,
  },
]

export default function AdvisoryPage() {
  return (
    <div style={{ background: ADV.bg, color: ADV.text }}>
      <MotionProvider>
        <main>
          <noscript>
            <style
              dangerouslySetInnerHTML={{
                __html:
                  '[data-motion]{opacity:1!important;transform:none!important}',
              }}
            />
          </noscript>

          {/* Red banner */}
          <div
            style={{ background: ADV.banner }}
            className="py-2.5 text-center"
          >
            <p
              className="text-[12px] tracking-[0.3em]"
              style={{ color: '#E8CFA0' }}
            >
              二十二年，坐在決策者的對面。
            </p>
          </div>

          {/* Hero */}
          <section className="px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20">
            <div className="mx-auto max-w-[960px]">
              <FadeIn>
                <p
                  className="text-[13px] tracking-[0.35em]"
                  style={{ color: ADV.muted }}
                >
                  私 人 顧 問 —— 每 月 限 額 受 理
                </p>
              </FadeIn>

              <FadeUp delay={0.1}>
                <div className="mt-10 flex items-start gap-2 md:mt-14">
                  <div className="flex items-start gap-1">
                    <h1
                      className="vertical-text font-serif font-bold leading-none"
                      style={{
                        fontSize: 'clamp(48px, 10vw, 80px)',
                        color: ADV.text,
                        letterSpacing: '0.08em',
                        height: 'auto',
                      }}
                    >
                      回到可控。
                    </h1>
                    <p
                      className="vertical-text mt-1 font-serif leading-none"
                      style={{
                        fontSize: 'clamp(16px, 2.8vw, 22px)',
                        color: ADV.muted,
                        letterSpacing: '0.12em',
                      }}
                    >
                      讓你的決策與關係系統，
                    </p>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.2}>
                <div className="mt-8 md:mt-10">
                  <SealStamp chars={['饒', '芝', '綺', '印']} size={68} />
                </div>
              </FadeUp>

              <FadeUp delay={0.25}>
                <div className="mt-10 max-w-[520px] md:mt-12">
                  <p
                    className="font-serif text-[18px] font-semibold leading-[2] md:text-[20px]"
                    style={{ color: ADV.text }}
                  >
                    我不處理你的情緒。
                    <br />
                    我協助你，恢復系統的穩定性。
                  </p>
                  <p
                    className="mt-5 text-[15px] leading-[1.9]"
                    style={{ color: ADV.muted }}
                  >
                    為正在經歷重大轉折的企業主、家族接班人與決策者，提供結構診斷與恢復路徑。
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={0.3}>
                <div className="mt-10 flex flex-wrap items-center gap-5 md:mt-12">
                  <Link
                    href="/rosie/advisory/apply"
                    className="inline-flex items-center justify-center border-2 px-10 py-4 font-serif text-[16px] font-semibold tracking-[0.25em] transition-opacity hover:opacity-80"
                    style={{
                      borderColor: ADV.text,
                      color: ADV.text,
                    }}
                  >
                    申 請 私 人 評 估
                  </Link>
                  <span
                    className="text-[13px]"
                    style={{ color: ADV.muted }}
                  >
                    顧問本人審閱 · 48 小時內回覆
                  </span>
                </div>
              </FadeUp>
            </div>
          </section>

          {/* States */}
          <section style={{ background: ADV.bgAlt }}>
            <div className="mx-auto max-w-[960px] px-5 py-20 md:px-8 md:py-28">
              <FadeUp>
                <p
                  className="text-center text-[12px] tracking-[0.3em]"
                  style={{ color: ADV.muted }}
                >
                  如果你正處在這樣的狀態
                </p>
                <h2
                  className="mt-5 text-center font-serif text-[24px] font-semibold leading-[1.5] sm:text-[30px]"
                  style={{ color: ADV.text }}
                >
                  表面上一切如常，
                  <br className="hidden sm:block" />
                  但你知道，系統正在鬆動。
                </h2>
              </FadeUp>

              <div className="mt-14 grid gap-5 md:grid-cols-3">
                {STATES.map((s, i) => (
                  <FadeUp key={s.tag} delay={i * 0.08}>
                    <article
                      className="border p-7"
                      style={{
                        borderColor: 'rgba(42,37,32,0.12)',
                        background: ADV.cream,
                      }}
                    >
                      <p
                        className="text-[11px] tracking-[0.2em]"
                        style={{ color: ADV.muted }}
                      >
                        {s.tag}
                      </p>
                      <h3
                        className="mt-3 font-serif text-[22px] font-semibold"
                        style={{ color: ADV.text }}
                      >
                        {s.title}
                      </h3>
                      <p
                        className="mt-3 text-[15px] leading-[1.8]"
                        style={{ color: ADV.muted }}
                      >
                        {s.desc}
                      </p>
                    </article>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>

          {/* Method */}
          <section>
            <div className="mx-auto max-w-[960px] px-5 py-20 md:px-8 md:py-28">
              <div className="grid gap-14 md:grid-cols-[1fr_1.3fr] md:gap-20">
                <FadeUp>
                  <div>
                    <p
                      className="text-[12px] tracking-[0.3em]"
                      style={{ color: ADV.muted }}
                    >
                      方 法
                    </p>
                    <h2
                      className="mt-5 font-serif text-[26px] font-semibold leading-tight sm:text-[32px]"
                      style={{ color: ADV.text }}
                    >
                      不是安慰，
                      <br />
                      是結構診斷。
                    </h2>
                    <p
                      className="mt-5 text-[15px] leading-[1.9]"
                      style={{ color: ADV.muted }}
                    >
                      結合 22 型企業決策顧問經驗與個人決策模式模型，服務超過
                      300 位企業主與決策者。
                    </p>
                  </div>
                </FadeUp>

                <div className="flex flex-col">
                  {METHOD_STEPS.map((s, i) => (
                    <FadeUp key={s.idx} delay={i * 0.08}>
                      <div
                        className="flex gap-6 border-t py-7"
                        style={{ borderColor: 'rgba(42,37,32,0.12)' }}
                      >
                        <span
                          className="shrink-0 font-serif text-[15px]"
                          style={{ color: ADV.red }}
                        >
                          {s.idx}
                        </span>
                        <div>
                          <h3
                            className="text-[18px] font-medium"
                            style={{ color: ADV.text }}
                          >
                            {s.title}
                          </h3>
                          <p
                            className="mt-2 text-[15px] leading-[1.8]"
                            style={{ color: ADV.muted }}
                          >
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
          <section style={{ background: ADV.bgAlt }}>
            <div className="mx-auto max-w-[960px] px-5 py-20 md:px-8 md:py-28">
              <FadeUp>
                <p
                  className="text-center text-[12px] tracking-[0.3em]"
                  style={{ color: ADV.muted }}
                >
                  三 條 路 徑
                </p>
                <h2
                  className="mt-5 text-center font-serif text-[24px] font-semibold leading-[1.5] sm:text-[30px]"
                  style={{ color: ADV.text }}
                >
                  每一條路徑，都先說清楚交付什麼。
                </h2>
                <p
                  className="mt-3 text-center text-[15px]"
                  style={{ color: ADV.muted }}
                >
                  顧問會在《狀態快照》中，建議最適合你的起點。
                </p>
              </FadeUp>

              <div className="mt-14 grid gap-5 md:grid-cols-3">
                {PATHS.map((p, i) => (
                  <FadeUp key={p.tag} delay={i * 0.08}>
                    <article
                      className="flex flex-col gap-5 border p-7 md:p-8"
                      style={{
                        borderColor: p.featured
                          ? 'rgba(42,37,32,0.3)'
                          : 'rgba(42,37,32,0.12)',
                        background: p.featured ? ADV.darkCard : ADV.cream,
                        color: p.featured ? ADV.cream : ADV.text,
                      }}
                    >
                      <p
                        className="text-[12px] tracking-[0.18em]"
                        style={{
                          color: p.featured
                            ? 'rgba(245,240,232,0.5)'
                            : ADV.muted,
                        }}
                      >
                        {p.tag}
                      </p>
                      <h3 className="font-serif text-[24px] font-semibold">
                        {p.title}
                      </h3>
                      <p
                        className="text-[15px] leading-[1.8]"
                        style={{
                          color: p.featured
                            ? 'rgba(245,240,232,0.65)'
                            : ADV.muted,
                        }}
                      >
                        {p.desc}
                      </p>
                      {p.duration && (
                        <p
                          className="text-[13px]"
                          style={{
                            color: p.featured
                              ? 'rgba(245,240,232,0.45)'
                              : ADV.muted,
                          }}
                        >
                          {p.duration}
                        </p>
                      )}
                      <div
                        className="border-t pt-5"
                        style={{
                          borderColor: p.featured
                            ? 'rgba(245,240,232,0.12)'
                            : 'rgba(42,37,32,0.12)',
                        }}
                      >
                        <p
                          className="text-[12px] tracking-[0.18em]"
                          style={{ color: ADV.red }}
                        >
                          交付
                        </p>
                        <p
                          className="mt-2 text-[15px] leading-[1.8]"
                          style={{
                            color: p.featured
                              ? 'rgba(245,240,232,0.75)'
                              : ADV.muted,
                          }}
                        >
                          {p.deliver}
                        </p>
                      </div>
                      <div className="mt-auto pt-3">
                        <p className="font-serif text-[20px]">{p.price}</p>
                        {p.priceNote && (
                          <p
                            className="mt-1 text-[13px]"
                            style={{ color: ADV.red }}
                          >
                            {p.priceNote}
                          </p>
                        )}
                      </div>
                    </article>
                  </FadeUp>
                ))}
              </div>

              <FadeUp delay={0.2}>
                <p
                  className="mt-10 text-center text-[14px]"
                  style={{ color: ADV.muted }}
                >
                  所有路徑皆從申請開始，不了解你，付再多錢都沒用。
                </p>
              </FadeUp>
            </div>
          </section>

          {/* CTA repeat */}
          <section>
            <div className="mx-auto max-w-[960px] px-5 py-16 text-center md:px-8 md:py-24">
              <FadeUp>
                <p
                  className="font-serif text-[22px] font-semibold leading-[1.6] sm:text-[26px]"
                  style={{ color: ADV.text }}
                >
                  申請一份由顧問親閱的私人評估。
                </p>
                <p
                  className="mt-2 text-[15px]"
                  style={{ color: ADV.muted }}
                >
                  每月限額申請
                </p>
                <div className="mt-8">
                  <Link
                    href="/rosie/advisory/apply"
                    className="inline-flex items-center justify-center border-2 px-10 py-4 font-serif text-[16px] font-semibold tracking-[0.25em] transition-opacity hover:opacity-80"
                    style={{
                      borderColor: ADV.text,
                      color: ADV.text,
                    }}
                  >
                    申 請 私 人 評 估
                  </Link>
                </div>
                <p
                  className="mt-4 text-[13px]"
                  style={{ color: ADV.muted }}
                >
                  顧問本人審閱 · 48 小時內回覆
                </p>
              </FadeUp>
            </div>
          </section>

          {/* Rosie footer info */}
          <section
            className="border-t"
            style={{ borderColor: 'rgba(42,37,32,0.1)' }}
          >
            <div className="mx-auto max-w-[960px] px-5 py-12 md:px-8 md:py-16">
              <div className="flex flex-wrap items-start justify-between gap-8">
                <div>
                  <p
                    className="font-serif text-[17px] font-semibold"
                    style={{ color: ADV.text }}
                  >
                    饒芝綺 Rosie｜首席顧問
                  </p>
                  <p
                    className="mt-2 text-[13px] leading-relaxed"
                    style={{ color: ADV.muted }}
                  >
                    22 年企業決策顧問經驗，服務 300+
                    位企業主與機構。台灣 · 服務亞洲華語決策者。
                  </p>
                </div>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: 'rgba(138,132,123,0.7)' }}
                >
                  本服務為決策與關係系統顧問，不提供醫療診斷、心理治療或命運預測。
                  <br />
                  如有需要，顧問會協助轉介合適的專業資源。
                </p>
              </div>
            </div>
          </section>
        </main>
      </MotionProvider>
    </div>
  )
}
