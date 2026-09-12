import { type ReactNode } from "react";
import { ScrollReveal } from "./scroll-reveal";

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  dark?: boolean;
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({ label, title, description, dark = false, className, children }: SectionHeaderProps) {
  return (
    <ScrollReveal className={className}>
      <p className="text-[12px] font-medium tracking-[0.22em]" style={{ color: dark ? "var(--color-gold)" : "var(--color-body)" }}>{label}</p>
      <div className="mt-3 h-[2px] w-10 bg-[var(--color-gold)]" aria-hidden="true" />
      <h2 className="mt-4 font-serif text-[1.8rem] font-semibold leading-snug md:text-[2.5rem]" style={{ color: dark ? "var(--color-ai-text)" : "var(--color-fg)" }}>{title}</h2>
      {description && <p className="mt-5 max-w-[560px] text-[16px] leading-relaxed" style={{ color: dark ? "var(--color-ai-muted)" : "var(--color-body)" }}>{description}</p>}
      {children}
    </ScrollReveal>
  );
}
