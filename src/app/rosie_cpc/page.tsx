import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MotionProvider } from '@/components/rosie_cpc/motion'
import { RosieHero } from '@/components/rosie_cpc/hero'
import { RosieWhoIAm } from '@/components/rosie_cpc/who-i-am'
import { RosieMethodology } from '@/components/rosie_cpc/methodology'
import { RosieWhyRosie } from '@/components/rosie_cpc/why-rosie'
import { RosieResultsInAction } from '@/components/rosie_cpc/results-in-action'
import { RosieCredentialProof } from '@/components/rosie_cpc/credential-proof'
import { RosieTeachingInAction } from '@/components/rosie_cpc/teaching-in-action'
import { RosieCollaboration } from '@/components/rosie_cpc/collaboration'
import { RosieInvitationForm } from '@/components/rosie_cpc/invitation-form'

export const metadata: Metadata = {
  title: '饒芝綺 Rosie｜雙定位品牌顧問｜華翼品牌策略',
  description:
    '人放對位置，品牌才會對。先定位人，再定位品牌。23 年設計實戰、300+ 品牌專案、50+ 企業定位。MMT 人才天賦系統官方講師。預約企業健檢。',
  openGraph: {
    title: '饒芝綺 Rosie｜雙定位品牌顧問',
    description:
      '人放對位置，品牌才會對。先定位人，再定位品牌。23 年品牌設計實戰、MMT 官方講師。',
    url: 'https://huayi.tw/rosie_cpc',
    siteName: '華翼品牌策略',
    locale: 'zh_TW',
    type: 'website',
  },
}

export default function RosieCpcPage() {
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
          <RosieHero />
          <RosieWhoIAm />
          <RosieCredentialProof />
          <RosieMethodology />
          <RosieWhyRosie />
          <RosieTeachingInAction />
          <RosieResultsInAction />
          <RosieCollaboration />
          <RosieInvitationForm />
        </main>
      </MotionProvider>
      <Footer />
    </>
  )
}
