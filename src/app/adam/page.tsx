import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MotionProvider } from '@/components/adam/motion'
import { CpcHero } from '@/components/adam/hero'
import { CpcWhoIAm } from '@/components/adam/who-i-am'
import { CpcCredentialProof } from '@/components/adam/credential-proof'
import { CpcDepthLadder } from '@/components/adam/depth-ladder'
import { CpcWhyAdam } from '@/components/adam/why-adam'
import { CpcTeachingInAction } from '@/components/adam/teaching-in-action'
import { CpcCollabFormats } from '@/components/adam/collab-formats'
import { CpcInvitationForm } from '@/components/adam/invitation-form'

export const metadata: Metadata = {
  title: '陳宗民 Adam｜生成式 AI 全方位實戰講師｜華翼品牌策略',
  description:
    '不是只教一種 AI，更教底層邏輯思考。多種 AI 工具、八層深度、從基礎到轉型。品牌設計與策略 20 年、跨產業企業顧問經驗、生成式 AI 實務教學。邀請 Adam 授課。',
  openGraph: {
    title: '陳宗民 Adam｜生成式 AI 全方位實戰講師',
    description:
      '不是只教一種 AI，更教底層邏輯思考。多種 AI 工具、八層深度、從基礎到轉型。',
    url: 'https://huayi.tw/adam',
    siteName: '華翼品牌策略',
    locale: 'zh_TW',
    type: 'website',
  },
}

export default function AdamCpcPage() {
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
          <CpcHero />
          <CpcWhoIAm />
          <CpcCredentialProof />
          <CpcDepthLadder />
          <CpcWhyAdam />
          <CpcTeachingInAction />
          <CpcCollabFormats />
          <CpcInvitationForm />
        </main>
      </MotionProvider>
      <Footer />
    </>
  )
}
