"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "關於華翼", href: "/about" },
  { label: "服務項目", href: "/services" },
  { label: "作品", href: "/works" },
  { label: "觀點", href: "/blog" },
  { label: "聯絡我們", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setMenuOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-warm-white)]/90 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[60px] max-w-[1280px] items-center justify-between px-[var(--space-page-x)] md:h-[72px]">
        <Link href="/" className="flex min-h-11 items-center" aria-label="華翼首頁"><BrandLogo /></Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative pb-1 text-[15px] tracking-wider transition-colors duration-200 ${
                  isActive
                    ? "text-[var(--color-fg)]"
                    : "text-[var(--color-body)] hover:text-[var(--color-fg)]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--color-gold)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden"
          aria-label={menuOpen ? "關閉選單" : "開啟選單"}
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-[1.5px] w-5 bg-[var(--color-fg)] transition-all duration-300 ${
              menuOpen ? "translate-y-[6.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[1.5px] w-5 bg-[var(--color-fg)] transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[1.5px] w-5 bg-[var(--color-fg)] transition-all duration-300 ${
              menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 top-[60px] z-40 bg-[var(--color-warm-white)] md:hidden"
          >
            <nav className="flex flex-col gap-1 px-[var(--space-page-x)] pt-8">
              {NAV_ITEMS.map((item, i) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`block rounded-xl px-4 py-3.5 text-[16px] tracking-wider transition-colors ${
                        isActive
                          ? "bg-[var(--color-surface)] text-[var(--color-fg)]"
                          : "text-[var(--color-body)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
