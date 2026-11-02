import type { Metadata } from 'next'
import { MotionProvider } from '@/components/rosie/motion'
import { FadeUp } from '@/components/rosie/motion'
import { AdvisoryForm } from '@/components/rosie/advisory-form'

export const metadata: Metadata = {
  title: '私人評估申請｜饒芝綺 Rosie｜華翼企業諮詢',
  description:
    '回答 5 題狀態問題，留下基本資料。由顧問本人親自審閱，48 小時內回覆。',
  openGraph: {
    title: '私人評估申請｜饒芝綺 Rosie',
    description: '由顧問本人親自審閱，48 小時內回覆一份《狀態快照》與建議的起始路徑。',
    url: 'https://huayi.tw/rosie/advisory/apply',
    siteName: '華翼品牌策略',
    locale: 'zh_TW',
    type: 'website',
  },
  robots: { index: false, follow: false },
}

export default function AdvisoryApplyPage() {
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
      <MotionProvider>
        <main className="min-h-screen bg-[#E8E3DC]">
          <div className="mx-auto max-w-[760px] px-5 pb-24 pt-32 md:px-8 md:pt-40">
            <FadeUp>
              <p className="text-[13px] font-semibold tracking-[0.28em] text-[#C13B2A]">
                私人評估申請
              </p>
              <h1
                className="mt-4 font-serif text-[26px] font-semibold leading-tight text-[#2A2520] sm:text-[32px]"
              >
                先告訴我，現在是哪裡失衡。
              </h1>
              <p className="mt-3 text-[15px] text-[#8A847B]">
                所有資料僅由顧問本人閱讀，不公開，可隨時要求刪除。
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="mt-10 border border-[#D0C9C0] bg-[#F5F0E8] p-6 md:p-10">
                <AdvisoryForm />
              </div>
            </FadeUp>
          </div>
        </main>
      </MotionProvider>
    </>
  )
}
