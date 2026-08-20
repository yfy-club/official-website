"use client";

import { ArrowUp } from "lucide-react";

export function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-[var(--fg-muted)] hover:text-[var(--accent)] active:scale-[0.96] transition-all cursor-pointer select-none group py-1"
      aria-label="回到页面顶部"
    >
      <span>TOP // 回到顶部</span>
      <ArrowUp size={15} aria-hidden="true" className="transition-transform group-hover:-translate-y-1 text-[var(--accent)]" />
    </button>
  );
}
