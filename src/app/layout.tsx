import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CookieNotice } from "@/components/cookie-notice";
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
  icons: { icon: "/brand/huayi-logo.svg" },
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
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','610346002895370');fbq('track','PageView');`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=610346002895370&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: motionInitScript }} />
        <Header />
        <main className="pt-[60px] md:pt-[72px]">{children}</main>
        <Footer />
        <CookieNotice />
      </body>
    </html>
  );
}
