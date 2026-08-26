import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
}

export function Section({ children, className, id, dark = false }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "px-[var(--space-page-x)] py-[var(--space-section-y)]",
        dark
          ? "bg-[var(--color-ai-bg)] text-[var(--color-ai-text)]"
          : "",
        className
      )}
    >
      <div className="mx-auto max-w-[1280px]">{children}</div>
    </section>
  );
}
