import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-noto-serif-tc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "華翼品牌策略 HUAYI｜品牌顧問 × AI 導入",
  description:
    "華翼品牌策略為台灣中小企業與二代接班人，提供品牌策略定位、企業 AI 導入、品牌行銷與商業成長、品牌體驗與設計的專業顧問服務。",
  keywords: ["品牌策略", "AI導入", "品牌顧問", "品牌設計", "華翼"],
  openGraph: {
    title: "華翼品牌策略 HUAYI",
    description: "品牌決定企業方向，AI 決定企業速度",
    siteName: "華翼品牌策略",
    locale: "zh_TW",
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#FDFCFA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant-TW"
      className={`${notoSansTC.variable} ${notoSerifTC.variable}`}
    >
      <body className="font-sans antialiased">
        <Header />
        <main className="pt-[60px] md:pt-[72px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
