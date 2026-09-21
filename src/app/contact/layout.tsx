import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "聯絡我們｜華翼品牌策略",
  description: "聯絡華翼品牌策略，洽詢品牌定位、企業 AI 導入、品牌行銷與品牌體驗顧問服務。",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "聯絡我們｜華翼品牌策略",
    description: "洽詢品牌定位、企業 AI 導入、品牌行銷與品牌體驗顧問服務。",
  },
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
