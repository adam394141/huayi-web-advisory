import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "第三方軟體授權聲明｜華翼品牌策略",
  description: "華翼品牌策略網站所使用第三方軟體套件的授權聲明與授權全文。",
  alternates: { canonical: "/legal/third-party-notices" },
  robots: { index: false, follow: false },
};

function readNotices() {
  const path = join(process.cwd(), "THIRD_PARTY_NOTICES.md");
  return readFileSync(path, "utf-8");
}

export default function ThirdPartyNoticesPage() {
  const notices = readNotices();

  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-[var(--color-fg)]">
      <h1 className="font-serif text-3xl">第三方軟體授權聲明</h1>
      <pre className="mt-8 whitespace-pre-wrap break-words font-mono text-[13px] leading-6 text-[var(--color-body)]">
        {notices}
      </pre>
    </section>
  );
}
