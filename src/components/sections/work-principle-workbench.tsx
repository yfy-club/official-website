"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Braces, Check, ChevronRight, Copy, Terminal } from "lucide-react";
import { useState } from "react";

import type { WorkPrinciple } from "@/content/schema";
import { MathFormula } from "@/components/ui/math-formula";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface WorkPrincipleWorkbenchProps {
  principles?: WorkPrinciple[];
  fallbackStack?: Record<string, string[]>;
}

const SPRING = { type: "spring" as const, stiffness: 360, damping: 34, mass: 0.8 };

export function WorkPrincipleWorkbench({
  principles,
  fallbackStack,
}: WorkPrincipleWorkbenchProps) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const items: WorkPrinciple[] =
    principles && principles.length > 0
      ? principles
      : Object.entries(fallbackStack ?? {}).map(([name, tags], index) => ({
          code: `CORE_${String(index + 1).padStart(2, "0")}`,
          name,
          category: "实现切面",
          summary: `${name} 的关键实现与运行边界。`,
          mechanism: `这一层负责 ${name} 的数据结构、执行路径与错误边界。`,
          tags,
        }));

  if (items.length === 0) return null;

  const currentItem = items[activeIndex] ?? items[0];

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    toast({
      title: "已复制源码切片",
      description: "代码片段已成功复制到剪贴板。",
    });
  };

  return (
    <div className="kernel-slices" data-reveal="group">
      {/* 顶部元数据栏 */}
      <div className="kernel-slices__intro">
        <div className="flex items-center gap-2">
          <span className="caps font-mono text-xs font-bold text-[var(--accent)] tracking-wider">
            04 // ARCHITECTURE SLICES
          </span>
          <span className="text-[var(--fg-faint)] text-xs font-mono hidden sm:inline">
            · 架构切面与实现机制
          </span>
        </div>
        <span className="kernel-slices__count tabular font-mono text-xs text-[var(--fg-muted)]">
          {String(items.length).padStart(2, "0")} {"//"} SLICES
        </span>
      </div>

      {/* 左右分栏架构工作台 */}
      <div className="kernel-slices__workbench">
        {/* 左栏：切面清单导航 */}
        <div
          role="tablist"
          aria-label="实现切面列表"
          className="kernel-slices__nav divide-y divide-[var(--border)]"
        >
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            const tabId = `slice-tab-${item.code.toLowerCase()}`;
            const panelId = `slice-panel-${item.code.toLowerCase()}`;

            return (
              <button
                key={item.code}
                id={tabId}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={panelId}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "kernel-slices__item group relative text-left p-4 sm:p-5 transition-all cursor-pointer outline-none active:scale-[0.99]",
                  isActive
                    ? "bg-[var(--accent-quiet)] text-[var(--fg)]"
                    : "bg-transparent text-[var(--fg-muted)] hover:bg-[var(--surface-2)]/60 hover:text-[var(--fg)]"
                )}
              >
                {/* 活跃状态指示条 */}
                {isActive && (
                  <motion.div
                    layoutId="kernel-slice-active-pill"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)]"
                    transition={SPRING}
                    aria-hidden="true"
                  />
                )}

                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--accent)]">
                      {String(index + 1).padStart(2, "0")} {"//"}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--fg-faint)]">
                      {item.category}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[var(--fg-faint)] opacity-70">
                    {item.code}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={cn(
                      "text-sm sm:text-base font-semibold leading-snug tracking-tight transition-colors",
                      isActive ? "text-[var(--fg)]" : "text-[var(--fg-muted)] group-hover:text-[var(--fg)]"
                    )}
                  >
                    {item.name}
                  </h4>
                  <ChevronRight
                    size={16}
                    className={cn(
                      "shrink-0 transition-transform duration-200",
                      isActive
                        ? "translate-x-0.5 text-[var(--accent)]"
                        : "text-[var(--fg-faint)] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5"
                    )}
                    aria-hidden="true"
                  />
                </div>

                <p className="text-xs text-[var(--fg-muted)] line-clamp-2 leading-relaxed mt-1.5 font-sans">
                  {item.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* 右栏：当前切面详情与源码/递推公式工作台 */}
        <div className="kernel-slices__stage p-5 sm:p-7 lg:p-8 bg-[var(--surface)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.code}
              id={`slice-panel-${currentItem.code.toLowerCase()}`}
              role="tabpanel"
              aria-labelledby={`slice-tab-${currentItem.code.toLowerCase()}`}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-6"
            >
              {/* 头部元数据 */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[var(--border)] font-mono text-xs text-[var(--fg-faint)]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] font-semibold text-[var(--accent)]">
                      {currentItem.category}
                    </span>
                    <span className="font-bold tracking-wide">{currentItem.code}</span>
                  </div>
                  <span className="tabular font-medium">
                    {`SLICE 0${activeIndex + 1} / 0${items.length}`}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--fg)] mb-3 leading-snug">
                  {currentItem.name}
                </h3>

                <p className="text-sm text-[var(--fg-muted)] leading-relaxed font-sans">
                  {currentItem.mechanism}
                </p>
              </div>

              {/* 验证结论 / 核心收益 */}
              {currentItem.keyBenefit && (
                <div className="p-3.5 sm:p-4 rounded-[var(--radius-xs)] border-l-4 border-l-[var(--success)] border border-[var(--success)]/20 bg-[var(--success)]/8 dark:bg-[var(--success)]/12">
                  <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--success)] mb-1">
                    PROOF // 验证结论
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--fg)] font-medium leading-relaxed m-0">
                    {currentItem.keyBenefit}
                  </p>
                </div>
              )}

              {/* 关联技术标签 */}
              {currentItem.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[11px] text-[var(--fg-faint)] mr-1">TECH //</span>
                  {currentItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-[var(--radius-xs)] font-mono text-[11px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--fg-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 递推公式或源码工作台 */}
              {(currentItem.formula || currentItem.codeSnippet) && (
                <div className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface-2)]/40 overflow-hidden shadow-2xs">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--surface-2)] border-b border-[var(--border)] font-mono text-xs text-[var(--fg-faint)]">
                    <span className="inline-flex items-center gap-2 font-medium text-[var(--fg)]">
                      {currentItem.formula ? (
                        <Braces size={14} className="text-[var(--accent)]" />
                      ) : (
                        <Terminal size={14} className="text-[var(--accent)]" />
                      )}
                      {currentItem.formula ? "递推关系 (LaTeX Formula)" : "源码切片 (Source Excerpt)"}
                    </span>
                    {currentItem.codeSnippet && (
                      <button
                        type="button"
                        onClick={() => handleCopy(currentItem.codeSnippet ?? "")}
                        title="复制源码"
                        aria-label={`复制${currentItem.name}源码`}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius-xs)] bg-[var(--surface)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[11px] font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] active:scale-95 transition-all cursor-pointer"
                      >
                        {isCopied ? <Check size={12} className="text-[var(--success)] stroke-[2.5]" /> : <Copy size={12} />}
                        <span>{isCopied ? "已复制" : "复制"}</span>
                      </button>
                    )}
                  </div>

                  {currentItem.formula && (
                    <div className="p-4 bg-[var(--surface)] overflow-x-auto">
                      <MathFormula formula={currentItem.formula} displayMode={true} />
                    </div>
                  )}

                  {currentItem.codeSnippet && (
                    <pre className="p-4 m-0 max-h-[320px] overflow-auto font-mono text-xs leading-relaxed text-[var(--fg)] bg-[var(--bg)]/90 border-t border-[var(--border)]">
                      <code>{currentItem.codeSnippet}</code>
                    </pre>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
