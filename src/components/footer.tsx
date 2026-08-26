import Link from "next/link";

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
            <Link href="/" className="inline-flex items-baseline gap-2">
              <span className="font-serif text-[20px] font-semibold text-[var(--color-fg)]">
                華翼
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[var(--color-subtle)]">
                HUAYI
              </span>
            </Link>
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--color-body)]">
              品牌決定方向，AI 決定速度
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="text-[11px] tracking-[0.15em] text-[var(--color-subtle)]">
              導覽
            </p>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] text-[var(--color-body)] transition-colors hover:text-[var(--color-fg)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <p className="text-[11px] tracking-[0.15em] text-[var(--color-subtle)]">
              聯繫
            </p>
            <a
              href="mailto:hy24687418@gmail.com"
              className="text-[13px] text-[var(--color-body)] transition-colors hover:text-[var(--color-fg)]"
            >
              hy24687418@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-[var(--color-faint)]/30 pt-6">
          <p className="text-[11px] text-[var(--color-subtle)]">
            © 2026 華翼品牌形象設計 HUAYI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
