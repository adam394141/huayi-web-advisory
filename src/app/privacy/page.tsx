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
      <p className="text-sm text-[var(--color-body)]">最近更新：2026 年 9 月 18 日</p>
      <h1 className="mt-4 font-serif text-3xl">隱私權政策</h1>
      <div className="mt-8 space-y-6 text-base leading-8">
        <p>
          華翼品牌策略（以下稱「華翼」）重視您的個人資料。本政策說明您瀏覽本網站或使用聯絡表單時，華翼如何蒐集、處理、利用與保護相關資料。
        </p>

        <h2 className="text-xl font-medium">一、蒐集的資料</h2>
        <p>
          當您主動送出聯絡表單時，我們會蒐集姓名、Email、公司或品牌名稱（選填）、諮詢類型、訊息內容、同意時間，以及用於防止濫用的雜湊化請求指紋。請勿在訊息中提供身分證、金融帳號、醫療資料等敏感資訊。
        </p>

        <h2 className="text-xl font-medium">二、蒐集目的與使用方式</h2>
        <p>
          上述資料僅用於確認您的需求、回覆詢問、安排後續聯繫、維護表單安全，以及處理與本次詢問直接相關的必要作業。我們不會僅因您提交表單，就把資料用於與本次詢問無關的廣告名單。
        </p>

        <h2 className="text-xl font-medium">三、保存期間</h2>
        <p>
          一般洽詢資料原則上自最後一次聯繫起保存不超過兩年；若已建立合作關係、法令另有要求，或為處理爭議所必要，則在該目的所需期間內保存。目的消失或期限屆滿後，我們會刪除、停止處理或進行去識別化。
        </p>

        <h2 className="text-xl font-medium">四、服務供應商與跨境處理</h2>
        <p>
          本網站使用 Vercel 提供網站託管與運算服務，使用 Supabase 保存聯絡資料；若啟用通知信，會由 Resend 處理必要的寄信資料。這些服務可能在台灣以外的地區處理資料，華翼會依服務所需範圍與其安全機制使用，不會授權供應商自行行銷。
        </p>

        <h2 className="text-xl font-medium">五、Cookie 與瀏覽器儲存</h2>
        <p>
          目前本網站未使用廣告追蹤或行為分析 Cookie。按下 Cookie 提示的「我知道了」後，網站只會在您的瀏覽器本機儲存提示已關閉的紀錄；清除網站資料後，提示會再次顯示。若日後新增分析或廣告工具，本政策與同意機制會先行更新。
        </p>

        <h2 className="text-xl font-medium">六、您的權利</h2>
        <p>
          您可以依法請求查詢或閱覽、取得複製本、補充或更正、停止蒐集／處理／利用，以及刪除您的個人資料。提出請求時，我們可能需要先確認您的身分；若依法不能立即處理，我們會說明原因。
        </p>

        <h2 className="text-xl font-medium">七、資料安全與事件處理</h2>
        <p>
          我們採取權限控管、傳輸加密、資料庫存取限制與必要的操作紀錄，以降低未經授權存取、竄改、遺失或洩漏的風險。若發生影響您的個人資料安全事件，我們會依適用法令採取應變與通知措施。
        </p>

        <h2 className="text-xl font-medium">八、政策更新</h2>
        <p>
          本政策可能因網站功能、服務供應商或法規調整而更新；新版會公布於本頁並標示最近更新日期。重大變更將以網站上適當方式提醒。
        </p>

        <h2 className="text-xl font-medium">九、聯繫方式</h2>
        <p>
          若要行使個人資料權利或詢問本政策，請聯絡華翼品牌策略：
          <a className="underline" href="mailto:888@huayi.tw">888@huayi.tw</a>。
        </p>
        <p className="text-sm text-[var(--color-body)]">
          參考法規：
          <a
            className="underline"
            href="https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=I0050021"
            target="_blank"
            rel="noreferrer"
          >
            個人資料保護法
          </a>
          。
        </p>
        <Link href="/" className="inline-block underline">返回首頁</Link>
      </div>
    </section>
  );
}
