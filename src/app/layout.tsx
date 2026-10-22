import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CookieNotice } from "@/components/cookie-notice";
import { ChatWidget } from "@/components/chat-widget";
import { getCanonicalSiteUrl, isIndexableEnvironment } from "@/lib/site-url";
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
  metadataBase: new URL(getCanonicalSiteUrl()),
  alternates: { canonical: "/" },
  title: "華翼品牌策略 HUAYI｜從你最頭痛的那件事開始",
  description:
    "華翼從企業的經營痛點出發，透過 AI 導入、流程改善與品牌行銷，協助你找到最適合的解決路徑——內部建置、外部支援或混合協作。",
  keywords: ["企業顧問", "AI導入", "品牌策略", "流程改善", "團隊建置", "華翼"],
  openGraph: {
    title: "華翼品牌策略 HUAYI",
    description: "從你最頭痛的那件事開始。AI 導入、流程改善與品牌行銷顧問。",
    siteName: "華翼品牌策略",
    locale: "zh_TW",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "華翼品牌策略 HUAYI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "華翼品牌策略 HUAYI｜從你最頭痛的那件事開始",
    description: "從企業經營痛點出發，透過 AI 導入、流程改善與品牌行銷，找到最適合的解決路徑。",
    images: ["/og-default.png"],
  },
  robots: isIndexableEnvironment() ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#FDFCFA",
};

const motionInitScript = `(function(){var p=new URLSearchParams(window.location.search);var f=p.get("motion")==="force";var r=window.matchMedia("(prefers-reduced-motion:reduce)").matches;document.documentElement.dataset.motion=f?"force":r?"reduce":"normal"})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant-TW"
      suppressHydrationWarning
      className={`${notoSansTC.variable} ${notoSerifTC.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5WV3BP96');`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5WV3BP96"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <script dangerouslySetInnerHTML={{ __html: motionInitScript }} />
        <Header />
        <main className="pt-[60px] md:pt-[72px]">{children}</main>
        <Footer />
        <CookieNotice />
        <ChatWidget />
      </body>
    </html>
  );
}
