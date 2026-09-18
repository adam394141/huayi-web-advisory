import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const NAV_ITEMS = [
  { label: "關於華翼", href: "/about" },
  { label: "服務項目", href: "/services" },
  { label: "作品", href: "/works" },
  { label: "觀點", href: "/blog" },
  { label: "聯絡我們", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] px-[var(--space-page-x)]">
      <div className="mx-auto max-w-[1280px] py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Link href="/" className="inline-flex min-h-11 items-center"><BrandLogo /></Link>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-body)]">
              品牌決定方向，AI 決定速度
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="text-[12px] tracking-[0.15em] text-[var(--color-subtle)]">
              導覽
            </p>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[15px] text-[var(--color-body)] transition-colors hover:text-[var(--color-fg)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <p className="text-[12px] tracking-[0.15em] text-[var(--color-subtle)]">
              聯繫
            </p>
            <a
              href="mailto:888@huayi.tw"
              className="text-[15px] text-[var(--color-body)] transition-colors hover:text-[var(--color-fg)]"
            >
              888@huayi.tw
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-[var(--color-faint)]/30 pt-6">
          <p className="text-[12px] text-[var(--color-subtle)]">
            © 2026 華翼品牌策略 HUAYI. All rights reserved.
          </p>
          <Link
            href="/privacy"
            className="mt-3 inline-block text-[12px] text-[var(--color-subtle)] underline underline-offset-4 transition-colors hover:text-[var(--color-fg)]"
          >
            隱私權政策
          </Link>
        </div>
      </div>
    </footer>
  );
}
