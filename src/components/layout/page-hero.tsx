import { ArrowDown } from "lucide-react";
import type { ReactNode } from "react";

export function PageHero({
  id,
  eyebrow,
  title,
  subtitle,
  intro,
  scrollToId,
  scrollLabel,
  children,
  className,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  intro?: string;
  scrollToId?: string;
  scrollLabel?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header
      id={id}
      className={`relative w-full text-left min-h-[calc(100svh-14rem)] flex flex-col justify-between py-12 sm:py-16 border-b border-[var(--border)] mb-16 sm:mb-24 ${
        className ?? ""
      }`}
    >
      <div className="space-y-6 max-w-5xl my-auto">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs sm:text-sm font-bold text-[var(--accent)] tracking-widest uppercase">
            {eyebrow}
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-normal leading-[0.95] tracking-tight text-[var(--fg)]">
            {title}
          </h1>
          <p className="text-2xl sm:text-4xl font-bold text-[var(--fg)] tracking-tight font-display">
            {subtitle}
          </p>
        </div>

        {intro && (
          <p className="text-base sm:text-xl text-[var(--fg-muted)] leading-relaxed max-w-4xl font-sans font-normal pt-2">
            {intro}
          </p>
        )}

        {children}
      </div>

      {scrollToId && (
        <div className="pt-8 shrink-0">
          <a
            href={`#${scrollToId}`}
            className="inline-flex items-center gap-2 font-mono text-xs text-[var(--fg-faint)] hover:text-[var(--fg)] transition-colors select-none group cursor-pointer"
            aria-label={scrollLabel ?? "向下滚动查看内容"}
          >
            <span className="tracking-widest">SCROLL</span>
            <ArrowDown
              size={13}
              className="text-[var(--accent)] group-hover:translate-y-0.5 transition-transform animate-bounce"
              aria-hidden="true"
            />
          </a>
        </div>
      )}
    </header>
  );
}
