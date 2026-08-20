"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  GitCompare,
  GraduationCap,
  Kanban,
  LayoutGrid,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import {
  CutoutCard,
  CutoutCardContent,
  CutoutCardHeader,
  CutoutCardTitle,
} from "@/components/ui/cutout-card";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import type { Mechanism } from "@/content";
import { cn } from "@/lib/utils";

const ICONS = [Users, GraduationCap, GitCompare, Clock, Kanban, Sparkles, ShieldAlert];

export function MechanismAccordion({ items }: { items: readonly Mechanism[] }) {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"console" | "grid">("console");

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

  // 全局快捷键：[ ← ] / [ → ] / [ 1..7 ]
  useEffect(() => {
    if (viewMode !== "console") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
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
  }, [handleNext, handlePrev, handleSelect, total, viewMode]);

  return (
    <div className="mechanism-deck space-y-6">
      {/* 顶部 Cult UI 风格 Expandable Floating Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-1)]/80 backdrop-blur-md">
        {/* 7 个机制流体微胶囊导航轨 */}
        <div
          role="tablist"
          aria-label="运转机制快速切换"
          className="flex flex-wrap items-center gap-1"
        >
          {items.map((item, idx) => {
            const IconComponent = ICONS[idx % ICONS.length] ?? Users;
            const isActive = viewMode === "console" && activeIndex === idx;
            const indexStr = item.index || String(idx + 1).padStart(2, "0");

            return (
              <button
                key={item.title}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => {
                  setViewMode("console");
                  handleSelect(idx);
                }}
                className={cn(
                  "relative z-10 flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-xs)] font-mono text-xs transition-colors cursor-pointer select-none",
                  isActive
                    ? "text-[var(--fg)] font-bold shadow-xs"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]/50"
                )}
              >
                <IconComponent className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="text-[10px] text-[var(--accent)] font-semibold">{indexStr}</span>
                <span className="hidden sm:inline-block">{item.title}</span>

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

        {/* 视图模式切换 */}
        <div className="flex items-center gap-1 border-l border-[var(--border)] pl-3">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "console" ? "grid" : "console")}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/60 text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border-strong)] transition-all cursor-pointer select-none"
            title="切换精控仪表舱与全览矩阵"
          >
            {viewMode === "console" ? (
              <>
                <LayoutGrid className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                <span className="hidden md:inline">全览矩阵</span>
              </>
            ) : (
              <>
                <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                <span className="hidden md:inline">精控仪表舱</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 主展示区：模式 A - 单项高精密电影级仪表舱 (Console) */}
      {viewMode === "console" && (
        <div className="relative overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-10 shadow-sm">
          {/* 流光边框 */}
          <BorderBeam
            size={120}
            duration={8}
            colorFrom="var(--accent)"
            colorTo="var(--fg-muted)"
            borderWidth={1.5}
          />

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
                  : { opacity: 0, x: direction * 24, filter: "blur(4px)" }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, x: 0, filter: "blur(0px)" }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * -24, filter: "blur(4px)" }
              }
              transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
              className="relative space-y-6"
            >
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

              {/* 底部控制器与键盘指引 */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border)] font-mono text-xs text-[var(--fg-muted)]">
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

                {/* 切换按钮与快捷键提示 */}
                <div className="flex items-center gap-3">
                  {/* 快捷键元数据指示 */}
                  <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[var(--fg-faint)]">
                    <KbdGroup>
                      <Kbd>←</Kbd>
                      <Kbd>→</Kbd>
                    </KbdGroup>
                  </div>

                  {/* 触感步进按钮组 */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/60 text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] active:scale-95 transition-all cursor-pointer select-none"
                      aria-label="上一个机制"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/60 text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] active:scale-95 transition-all cursor-pointer select-none"
                      aria-label="下一个机制"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* 主展示区：模式 B - 全览工业卡片矩阵 (Grid) */}
      {viewMode === "grid" && (
        <div className="mechanism-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, idx) => {
            const IconComponent = ICONS[idx % ICONS.length] ?? Users;
            const isLast = idx === items.length - 1;
            const indexStr = item.index || String(idx + 1).padStart(2, "0");

            return (
              <motion.div
                key={item.title}
                className={isLast ? "md:col-span-2" : undefined}
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <CutoutCard className="h-full">
                  <CutoutCardHeader>
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                      <span className="font-mono text-xs font-bold text-[var(--accent)]">
                        {`${indexStr} //`}
                      </span>
                      <CutoutCardTitle>
                        {item.title}
                      </CutoutCardTitle>
                    </div>
                    {item.tag && (
                      <Badge variant="outline" className="font-mono text-[10px] px-2 py-0.5">
                        {item.tag}
                      </Badge>
                    )}
                  </CutoutCardHeader>
                  <CutoutCardContent>
                    <p className="m-0">
                      {item.detail}
                    </p>
                  </CutoutCardContent>
                </CutoutCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
