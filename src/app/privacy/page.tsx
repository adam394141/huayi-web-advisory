import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隱私權政策｜華翼品牌策略",
  description: "華翼品牌策略網站隱私權政策，說明聯絡資料、Cookie 與網站使用資訊的處理方式。",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-[var(--color-fg)]">
      <p className="text-sm text-[var(--color-body)]">預覽草稿・正式發布前需確認</p>
      <h1 className="mt-4 font-serif text-3xl">隱私權政策</h1>
      <div className="mt-8 space-y-6 text-base leading-8">
        <p>本頁適用於華翼品牌策略新官網的預覽版本，不代表已核定的正式隱私權政策。</p>
        <h2 className="text-xl font-medium">網站偏好紀錄</h2>
        <p>按下「我知道了」後，本網站會使用瀏覽器本機儲存，記錄 Cookie 提示已關閉。清除本網站的瀏覽器儲存資料後，提示會再次顯示。此紀錄不是廣告或分析追蹤的同意。</p>
        <h2 className="text-xl font-medium">正式上線前的確認項目</h2>
        <p>網站營運者需確認實際使用的 Cookie、第三方服務、表單蒐集欄位、處理目的、保存期間與使用者權利管道，再完成正式政策。預覽版不應作為這些項目的完整聲明。</p>
        <h2 className="text-xl font-medium">聯繫方式</h2>
        <p>如有問題，請聯絡華翼品牌策略：<a className="underline" href="mailto:888@huayi.tw">888@huayi.tw</a>。</p>
        <Link href="/" className="inline-block underline">返回首頁</Link>
      </div>
    </section>
  );
}
