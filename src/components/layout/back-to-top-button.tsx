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
      className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--fg-faint)] hover:text-[var(--accent)] active:scale-[0.96] transition-all cursor-pointer select-none group"
      aria-label="回到页面顶部"
    >
      <span>TOP // 回到顶部</span>
      <ArrowUp size={13} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
}
