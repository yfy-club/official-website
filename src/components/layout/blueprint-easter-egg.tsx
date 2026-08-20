"use client";

import { useBlueprintEasterEgg } from "@/hooks/use-blueprint-easter-egg";

export function BlueprintEasterEgg() {
  const { isActive, handleTriggerClick } = useBlueprintEasterEgg();

  return (
    <button
      type="button"
      onClick={handleTriggerClick}
      title={isActive ? "点击退出蓝图模式 (或按 ESC)" : "Code by Dawn (连续点击 5 次)"}
      aria-label="Code by Dawn 蓝图彩蛋"
      className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--fg-faint)] hover:text-[var(--accent)] active:scale-95 transition-all duration-150 cursor-pointer select-none tracking-wider rounded-sm px-1 py-0.5"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" aria-hidden="true" />
      <span className="font-semibold underline decoration-dotted decoration-[var(--border-strong)] underline-offset-4 hover:decoration-[var(--accent)]">
        Code by Dawn
      </span>
      {isActive && (
        <span className="ml-1 inline-flex items-center px-1 py-0.2 text-[9px] font-bold uppercase tracking-widest bg-[var(--accent)] text-[var(--accent-fg)] rounded-xs animate-pulse">
          5S CAD
        </span>
      )}
    </button>
  );
}
