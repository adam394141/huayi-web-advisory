import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { MotionProvider } from '@/components/adam/motion'
import { CpcHero } from '@/components/adam/hero'
import { CpcBrandCase } from '@/components/adam/brand-case'
import { CpcAiTraining } from '@/components/adam/ai-training'
import { CpcWhoIAm } from '@/components/adam/who-i-am'
import { CpcTeachingInAction } from '@/components/adam/teaching-in-action'
import { CpcInvitationForm } from '@/components/adam/invitation-form'

export const metadata: Metadata = {
  title: '陳宗民 Adam｜品牌策略顧問・企業 AI 內訓｜華翼品牌策略',
  description:
    '陳宗民 Adam 協助中小企業與接班團隊釐清品牌方向，也提供企業 AI 導入與內訓。查看華翼品牌案例、課綱與合作方式。',
  openGraph: {
    title: '陳宗民 Adam｜品牌策略顧問・企業 AI 內訓｜華翼品牌策略',
    description:
      '陳宗民 Adam 協助中小企業與接班團隊釐清品牌方向，也提供企業 AI 導入與內訓。查看華翼品牌案例、課綱與合作方式。',
    url: 'https://huayi.tw/adam',
    siteName: '華翼品牌策略',
    locale: 'zh_TW',
    type: 'website',
    images: [{ url: '/adam/adam-professional.jpg', width: 1200, height: 630, alt: '陳宗民 Adam｜品牌策略顧問・企業 AI 內訓' }],
  },
}

export default function AdamPage() {
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
          <CpcBrandCase />
          <CpcAiTraining />
          <CpcTeachingInAction />
          <CpcWhoIAm />
          <CpcInvitationForm />
        </main>
      </MotionProvider>
    </>
  )
}
