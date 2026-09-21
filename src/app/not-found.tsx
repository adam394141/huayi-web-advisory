import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-[12px] tracking-[0.3em] text-[var(--color-subtle)]">404</p>
      <h1 className="mt-4 font-serif text-[2rem] font-semibold text-[var(--color-fg)] md:text-[2.8rem]">
        找不到頁面
      </h1>
      <p className="mt-4 max-w-[400px] text-[16px] leading-relaxed text-[var(--color-body)]">
        您要找的頁面不存在或已被移動。
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-block rounded-[var(--radius-button)] bg-[var(--color-fg)] px-8 py-3 text-[15px] tracking-wider text-white transition-colors hover:bg-[var(--color-gold-dark)]"
        >
          回首頁
        </Link>
        <Link
          href="/contact"
          className="inline-block rounded-[var(--radius-button)] border border-[var(--color-faint)] px-8 py-3 text-[15px] tracking-wider text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg)]"
        >
          聯絡我們
        </Link>
      </div>
      <nav className="mt-12">
        <ul className="flex flex-wrap justify-center gap-6 text-[14px] text-[var(--color-subtle)]">
          <li><Link href="/about" className="hover:text-[var(--color-fg)]">關於華翼</Link></li>
          <li><Link href="/services" className="hover:text-[var(--color-fg)]">服務項目</Link></li>
          <li><Link href="/works" className="hover:text-[var(--color-fg)]">作品集</Link></li>
          <li><Link href="/blog" className="hover:text-[var(--color-fg)]">觀點</Link></li>
        </ul>
      </nav>
    </section>
  );
}
