"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Binary,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";

import { TechTag } from "@/components/ui/tech-tag";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import type { WorkPrinciple } from "@/content/schema";

interface WorkPrincipleWorkbenchProps {
  principles?: WorkPrinciple[];
  fallbackStack?: Record<string, string[]>;
}

const CATEGORY_ICONS: Record<string, typeof Binary> = {
  "代数消元内核": Binary,
  "谱理论代数化": Cpu,
  "教学溯源系统": Layers,
  "契约驱动架构": Code2,
  "实时事件引擎": Zap,
  "时序与仿真底座": Terminal,
  "图谱渲染引擎": Layers,
  "双轨流式架构": Zap,
  "容灾调度机制": ShieldCheck,
};

export function WorkPrincipleWorkbench({
  principles,
  fallbackStack,
}: WorkPrincipleWorkbenchProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  // If principles are provided in schema, use them; otherwise fallback to stack items
  const items: WorkPrinciple[] =
    principles && principles.length > 0
      ? principles
      : Object.entries(fallbackStack ?? {}).map(([key, tags], idx) => ({
          code: `SPEC_0${idx + 1}`,
          name: key,
          category: "核心技术模块",
          summary: `系统 ${key} 关键底层运行机制与工程选型编排。`,
          mechanism: `负责 ${key} 模块的抽象封装、数据结构定义与高可靠执行。`,
          tags,
        }));

  const activeItem = items[activeIndex] || items[0];

  return (
    <div className="work-principle-workbench space-y-4 my-6" data-reveal="group">
      {/* Workbench Dual-Pane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Column: Principle Selector Rail (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-2 p-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <div className="px-3 py-2 border-b border-[var(--border)]/60 flex items-center justify-between font-mono text-[10px] text-[var(--fg-muted)]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="font-bold text-[var(--fg)] tracking-wider uppercase">
                CORE PRINCIPLES
              </span>
            </div>
            <span>0{items.length} PILLARS</span>
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            {items.map((item, idx) => {
              const isSelected = activeIndex === idx;
              const Icon = CATEGORY_ICONS[item.category] || Binary;

              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`group relative flex flex-col items-start gap-1 p-3.5 rounded-[var(--radius-xs)] text-left transition-all border ${
                    isSelected
                      ? "bg-[var(--surface-2)] text-[var(--fg)] border-[var(--border-strong)] shadow-xs"
                      : "text-[var(--fg-muted)] border-transparent hover:bg-[var(--surface-2)]/40 hover:text-[var(--fg)]"
                  }`}
                >
                  {/* Active highlight pill */}
                  {isSelected && (
                    <motion.div
                      layoutId="active-principle-indicator"
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[var(--accent)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center justify-between w-full font-mono text-[10px]">
                    <span
                      className={`font-bold ${
                        isSelected ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"
                      }`}
                    >
                      0{idx + 1} {"//"} {item.code}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--fg-faint)] text-[9px] truncate max-w-[100px]">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <Icon
                      className={`h-3.5 w-3.5 shrink-0 ${
                        isSelected ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"
                      }`}
                    />
                    <h4
                      className={`font-sans text-xs font-semibold leading-snug truncate ${
                        isSelected ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"
                      }`}
                    >
                      {item.name}
                    </h4>
                  </div>

                  <p className="text-[11px] text-[var(--fg-faint)] font-sans line-clamp-1 pt-0.5">
                    {item.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Inspection Cockpit (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xs relative overflow-hidden backdrop-blur-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.code}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="space-y-5"
            >
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-xs)] bg-[var(--accent)] text-black font-bold text-xs">
                    0{activeIndex + 1}
                  </span>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-[var(--accent)] font-semibold">
                      {activeItem.category}
                    </span>
                    <h3 className="font-sans text-base sm:text-lg font-bold text-[var(--fg)] tracking-tight">
                      {activeItem.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--success)] font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                  <span>ENGINE VERIFIED</span>
                </div>
              </div>

              {/* Rationale & Mechanism */}
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-[var(--fg)] font-sans leading-relaxed font-medium">
                  {activeItem.summary}
                </p>
                <p className="text-xs text-[var(--fg-muted)] font-sans leading-relaxed">
                  {activeItem.mechanism}
                </p>
              </div>

              {/* Mathematical Formula Callout */}
              {activeItem.formula && (
                <div className="p-3 sm:p-3.5 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/60 border border-[var(--border)] space-y-1">
                  <div className="flex items-center justify-between font-mono text-[10px] text-[var(--fg-faint)]">
                    <span className="text-[var(--accent)] font-bold">MATHEMATICAL FORMULATION</span>
                    <span>RECURRENCE RELATION</span>
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-[var(--fg)] overflow-x-auto py-1 font-semibold">
                    <code>{activeItem.formula}</code>
                  </div>
                </div>
              )}

              {/* Code Snippet / Protocol Window */}
              {activeItem.codeSnippet && (
                <div className="rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/40 overflow-hidden shadow-xs">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--surface-2)] border-b border-[var(--border)] font-mono text-[10px] text-[var(--fg-muted)]">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="h-3 w-3 text-[var(--accent)]" />
                      <span>RUNTIME SPECIFICATION</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(activeItem.codeSnippet ?? "")}
                      className="px-2 py-0.5 rounded bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--fg)] transition-colors border border-[var(--border)]"
                    >
                      {isCopied ? "已复制 ✓" : "复制代码"}
                    </button>
                  </div>

                  <div className="p-3 sm:p-4 font-mono text-[11px] leading-relaxed overflow-x-auto text-[var(--fg)] max-h-56 scrollbar-thin">
                    <pre>
                      <code>{activeItem.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Quantifiable Benefit & Tags */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[var(--border)]/60">
                {activeItem.keyBenefit ? (
                  <div className="flex items-center gap-2 font-mono text-xs text-[var(--fg)]">
                    <CheckCircle2 className="h-4 w-4 text-[var(--success)] shrink-0" />
                    <span className="text-[var(--fg-muted)]">收益：</span>
                    <span className="font-semibold text-[var(--fg)]">{activeItem.keyBenefit}</span>
                  </div>
                ) : (
                  <div />
                )}

                <div className="flex flex-wrap items-center gap-1.5">
                  {(activeItem.tags ?? []).map((tag: string) => (
                    <TechTag key={tag} name={tag} />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
