"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  GitCompare,
  GraduationCap,
  Kanban,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import type { Mechanism } from "@/content";
import { cn } from "@/lib/utils";

const ICONS = [Users, GraduationCap, GitCompare, Clock, Kanban, Sparkles, ShieldAlert];

export function MechanismAccordion({ items }: { items: readonly Mechanism[] }) {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  const total = items.length;
  const currentItem = items[activeIndex] ?? items[0];
  const CurrentIcon = ICONS[activeIndex % ICONS.length] ?? Users;

  const handleSelect = useCallback(
    (newIdx: number) => {
      setDirection(newIdx > activeIndex ? 1 : -1);
      setActiveIndex(newIdx);
    },
    [activeIndex]
  );

  const handlePrev = useCallback(() => {
    handleSelect((activeIndex - 1 + total) % total);
  }, [activeIndex, handleSelect, total]);

  const handleNext = useCallback(() => {
    handleSelect((activeIndex + 1) % total);
  }, [activeIndex, handleSelect, total]);

  // 全局快捷键：[ ↑ / ↓ ] / [ ← / → ] / [ 1..7 ]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (/^[1-7]$/.test(e.key)) {
        const num = parseInt(e.key, 10) - 1;
        if (num < total) {
          e.preventDefault();
          handleSelect(num);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, handleSelect, total]);

  return (
    <div className="mechanism-deck">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* 左侧：7 个机制纵向导航轨 */}
        <div className="lg:col-span-4 p-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-1)]/80 backdrop-blur-md">
          <div
            role="tablist"
            aria-label="运转机制快速切换"
            className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-1 lg:pb-0"
          >
            {items.map((item, idx) => {
              const IconComponent = ICONS[idx % ICONS.length] ?? Users;
              const isActive = activeIndex === idx;
              const indexStr = item.index || String(idx + 1).padStart(2, "0");

              return (
                <button
                  key={item.title}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => handleSelect(idx)}
                  className={cn(
                    "relative z-10 flex items-center justify-between gap-2 px-3 py-2.5 rounded-[var(--radius-xs)] font-mono text-xs transition-colors cursor-pointer select-none shrink-0 lg:shrink text-left w-full active:scale-[0.98]",
                    isActive
                      ? "text-[var(--fg)] font-bold shadow-xs"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]/50"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <IconComponent className="w-3.5 h-3.5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                    <span className="text-[11px] text-[var(--accent)] font-semibold shrink-0">{indexStr}</span>
                    <span className="truncate">{item.title}</span>
                  </div>

                  {item.tag && (
                    <span className="hidden xl:inline-block text-[10px] text-[var(--fg-faint)] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)]">
                      {item.tag}
                    </span>
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="mech-active-capsule"
                      className="absolute inset-0 rounded-[var(--radius-xs)] bg-[var(--surface)] border border-[var(--border-strong)] -z-10 shadow-xs"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 450, damping: 32 }
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 右侧：单项高精密电影级仪表舱 (Console) */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col justify-between min-h-[380px]">
          {/* 背景大号等宽水印编号 */}
          <div
            className="pointer-events-none absolute right-6 top-6 font-mono text-7xl sm:text-9xl font-black text-[var(--fg)] opacity-[0.03] select-none"
            aria-hidden="true"
          >
            {currentItem.index || String(activeIndex + 1).padStart(2, "0")}
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentItem.title}
              custom={direction}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: direction * 16, filter: "blur(4px)" }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, filter: "blur(0px)" }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: direction * -16, filter: "blur(4px)" }
              }
              transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
              className="relative flex-1 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-6">
                {/* 顶部遥测状态栏 */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[11px] text-[var(--accent)] font-bold">
                      <CurrentIcon className="w-3 h-3 text-[var(--accent)]" />
                      {`${currentItem.index || String(activeIndex + 1).padStart(2, "0")} // PROTOCOL`}
                    </span>
                    {currentItem.tag && (
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {currentItem.tag}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-[var(--fg-muted)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                    <span>制度常态化运行中</span>
                  </div>
                </div>

                {/* 标题 */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[var(--fg)] tracking-tight">
                    {currentItem.title}。
                  </h3>
                </div>

                {/* 核心描述 */}
                <div className="p-4 sm:p-5 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/60 border border-[var(--border)]">
                  <p className="text-sm sm:text-base text-[var(--fg)] leading-relaxed m-0 max-w-prose">
                    {currentItem.detail}
                  </p>
                </div>
              </div>

              {/* 底部控制器 */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border)] font-mono text-xs text-[var(--fg-muted)] mt-6">
                {/* 进度刻度 */}
                <div className="flex items-center gap-2">
                  <span className="text-[var(--fg)] font-bold">
                    0{activeIndex + 1}
                  </span>
                  <div className="w-24 h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden border border-[var(--border)]">
                    <motion.div
                      className="h-full bg-[var(--accent)] rounded-full"
                      animate={{ width: `${((activeIndex + 1) / total) * 100}%` }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  </div>
                  <span>/ 0{total}</span>
                </div>

                {/* 上下翻动切换按钮组 */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/60 text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] active:scale-95 transition-all cursor-pointer select-none"
                    aria-label="上一个机制"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/60 text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] active:scale-95 transition-all cursor-pointer select-none"
                    aria-label="下一个机制"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
