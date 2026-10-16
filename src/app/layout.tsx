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
  title: "華翼品牌策略 HUAYI｜駐點建置，建好就走",
  description:
    "華翼以駐點顧問方式，協助台灣中小企業建立品牌與行銷團隊。診斷現場、建立團隊、駐點陪跑、移交撤離——讓現場能獨立運作。",
  keywords: ["品牌策略", "行銷團隊建置", "駐點顧問", "AI導入", "華翼"],
  openGraph: {
    title: "華翼品牌策略 HUAYI",
    description: "駐點建置，建好就走。協助企業建立品牌與行銷團隊。",
    siteName: "華翼品牌策略",
    locale: "zh_TW",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "華翼品牌策略 HUAYI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "華翼品牌策略 HUAYI｜駐點建置，建好就走",
    description: "以駐點顧問方式協助企業建立品牌與行銷團隊，讓現場能獨立運作。",
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
