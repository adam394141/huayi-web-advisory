import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PhotoGallery } from './gallery'

export const metadata: Metadata = {
  title: '授課紀錄｜陳宗民 Adam｜華翼品牌策略',
  description:
    '陳宗民 Adam 真實授課現場照片，涵蓋企業內訓、公開講座、AI 實作工作坊與結訓成果。',
}

const allPhotos = [
  '/adam_cpc/teaching-v-03.jpg',
  '/adam_cpc/teaching-v-04.jpg',
  '/adam_cpc/teaching-v-05.jpg',
  '/adam_cpc/teaching-v-06.jpg',
  '/adam_cpc/teaching-v-07.jpg',
  '/adam_cpc/teaching-v-08.jpg',
  '/adam_cpc/teaching-v-12.jpg',
  '/adam_cpc/teaching-v-13.jpg',
  '/adam_cpc/teaching-v-14.jpg',
  '/adam_cpc/teaching-v-15.jpg',
  '/adam_cpc/teaching-v-16.jpg',
  '/adam_cpc/teaching-v-17.jpg',
]

export default function TeachingRecordsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-adam-navy pb-8 pt-32 md:pb-12 md:pt-36">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <Link
              href="/adam_cpc"
              className="inline-flex items-center gap-2 text-[14px] text-adam-gold transition-colors hover:text-adam-gold/80"
            >
              ← 返回講師頁
            </Link>
            <h1 className="mt-6 text-[32px] font-bold text-white md:text-[40px]">
              授課紀錄
            </h1>
          </div>
        </section>

        <section className="bg-adam-ivory py-8 md:py-12">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <PhotoGallery photos={allPhotos} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
