import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MotionProvider } from '@/components/rosie/motion'
import { RosieHero } from '@/components/rosie/hero'
import { RosieWhoIAm } from '@/components/rosie/who-i-am'
import { RosieMethodology } from '@/components/rosie/methodology'
import { RosieWhyRosie } from '@/components/rosie/why-rosie'
import { RosieResultsInAction } from '@/components/rosie/results-in-action'
import { RosieCredentialProof } from '@/components/rosie/credential-proof'
import { RosieTeachingInAction } from '@/components/rosie/teaching-in-action'
import { RosieCollaboration } from '@/components/rosie/collaboration'
import { RosieInvitationForm } from '@/components/rosie/invitation-form'

export const metadata: Metadata = {
  title: '饒芝綺 Rosie｜雙定位品牌顧問｜華翼品牌策略',
  description:
    '人放對位置，品牌才會對。先定位人，再定位品牌。23年品牌實戰策略顧問、MMT人生策略系統官方講師。預約企業健檢。',
  openGraph: {
    title: '饒芝綺 Rosie｜雙定位品牌顧問',
    description:
      '人放對位置，品牌才會對。先定位人，再定位品牌。23年品牌實戰策略顧問、MMT人生策略系統官方講師。',
    url: 'https://huayi.tw/rosie',
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
