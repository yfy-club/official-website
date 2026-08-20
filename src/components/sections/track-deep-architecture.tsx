"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, ArrowRight, ArrowUpRight, Check, Code2, Copy, FileText, Sigma } from "lucide-react";

import { CONCEPT_VISUALS } from "@/components/motion/track-visuals";
import { Button } from "@/components/ui/button";
import { MathFormula } from "@/components/ui/math-formula";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { TrackDeepDive } from "@/content";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface TrackDeepArchitectureProps {
  deepDive: TrackDeepDive;
}

/**
 * 以「概念」为主轴的深度架构台。
 *
 * 三幕结构：选概念 → 看它的专属拓扑图 → 读机制与推导。
 * 图由 CONCEPT_VISUALS 按 concept.code 分发，和文字讲的是同一件事；
 * 抽屉只承载完整规格（源码、公式推导、误区、关联工程），不再是唯一入口。
 */
export function TrackDeepArchitecture({ deepDive }: TrackDeepArchitectureProps) {
  const concepts = deepDive.concepts;
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [specOpen, setSpecOpen] = useState(false);
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  if (concepts.length === 0) return null;

  const active = concepts[activeIndex];
  const Visual = CONCEPT_VISUALS[active.code];
  const panelId = `concept-panel-${active.code.toLowerCase()}`;

  return (
    <div className="w-full space-y-8">
      {/* ── 幕一：概念索引条 ─────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="核心概念"
        className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3"
      >
        {concepts.map((concept, index) => {
          const isActive = index === activeIndex;
          const displayTitle =
            concept.shortTitle || concept.title.split("：")[0]?.trim() || concept.title;

          return (
            <button
              key={concept.code}
              type="button"
              role="tab"
              id={`concept-tab-${concept.code.toLowerCase()}`}
              aria-selected={isActive}
              aria-controls={panelId}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "group relative cursor-pointer p-5 text-left transition-colors duration-200",
                isActive
                  ? "bg-[var(--surface-2)]"
                  : "bg-[var(--surface)] hover:bg-[var(--surface-2)]/60",
              )}
            >
              {/* 选中态顶栏 */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 top-0 h-[2px] transition-colors",
                  isActive ? "bg-[var(--accent)]" : "bg-transparent",
                )}
              />

              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "font-mono text-[10px] font-bold tracking-wider transition-colors",
                    isActive ? "text-[var(--accent)]" : "text-[var(--fg-faint)]",
                  )}
                >
                  {String(index + 1).padStart(2, "0")} {"//"} {concept.code}
                </span>
                <ArrowUpRight
                  size={14}
                  aria-hidden="true"
                  className={cn(
                    "transition-all",
                    isActive
                      ? "text-[var(--accent)]"
                      : "text-[var(--fg-faint)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                  )}
                />
              </div>

              <h3
                className={cn(
                  "mt-2 text-base font-bold tracking-tight transition-colors sm:text-lg",
                  isActive ? "text-[var(--fg)]" : "text-[var(--fg-muted)]",
                )}
              >
                {displayTitle}
              </h3>

              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--fg-muted)]">
                {concept.summary}
              </p>
            </button>
          );
        })}
      </div>

      {/* ── 幕二 + 幕三：舞台 ───────────────────────────────────── */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.code}
          id={panelId}
          role="tabpanel"
          aria-labelledby={`concept-tab-${active.code.toLowerCase()}`}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.22, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* 这一节到底在回答什么问题 —— 全章最该被看见的一句 */}
          <div className="flex gap-4 border-l-2 border-[var(--accent)] pl-4 sm:pl-6">
            <p className="text-lg leading-snug font-bold tracking-tight text-balance text-[var(--fg)] sm:text-xl md:text-2xl">
              {active.question}
            </p>
          </div>

          {/* 概念专属拓扑图 */}
          {Visual && <Visual />}

          {/* 机制 · 公式 · 误区 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <div className="space-y-2">
                <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-[var(--fg-faint)]">
                  MECHANISM {"//"} 核心机制
                </span>
                <p className="text-sm leading-relaxed text-[var(--fg-muted)]">{active.mechanism}</p>
              </div>

              {active.misconception && (
                <div className="space-y-1.5 rounded-[var(--radius-xs)] border border-[var(--warn)]/25 bg-[var(--warn)]/5 p-4">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider text-[var(--warn)]">
                    <AlertTriangle size={12} aria-hidden="true" />
                    常见误区
                  </span>
                  <p className="text-xs leading-relaxed font-bold text-[var(--fg)]">
                    {active.misconception.myth}
                  </p>
                  <p className="text-xs leading-relaxed text-[var(--fg-muted)]">
                    {active.misconception.truth}
                  </p>
                </div>
              )}

              <ul className="flex flex-wrap gap-1.5">
                {active.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[10px] text-[var(--fg-muted)]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 lg:col-span-5">
              {active.formula && (
                <div className="space-y-2 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/60 p-4">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-[0.12em] text-[var(--fg-faint)]">
                    <Sigma size={12} aria-hidden="true" />
                    MODEL {"//"} 数学形式
                  </span>
                  <MathFormula formula={active.formula} displayMode />
                  {active.formulaDescription && (
                    <p className="border-t border-[var(--border)] pt-2 font-mono text-[10px] leading-relaxed text-[var(--fg-muted)]">
                      {active.formulaDescription}
                    </p>
                  )}
                </div>
              )}

              {active.ourWork && (
                <div className="space-y-1.5 rounded-[var(--radius-xs)] border border-[var(--border)] p-4">
                  <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-[var(--accent)]">
                    IN PRODUCTION {"//"} 我们的落地
                  </span>
                  <h4 className="text-sm font-bold text-[var(--fg)]">{active.ourWork.title}</h4>
                  <p className="text-xs leading-relaxed text-[var(--fg-muted)]">
                    {active.ourWork.evidence}
                  </p>
                  {active.ourWork.link && (
                    <Link
                      href={active.ourWork.link}
                      className="inline-flex items-center gap-1 pt-1 font-mono text-[11px] font-bold text-[var(--fg)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
                    >
                      查看工程
                      <ArrowRight size={12} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              )}

              <Button
                variant="ghost"
                onClick={() => setSpecOpen(true)}
                className="w-full justify-between rounded-[var(--radius-xs)] border border-[var(--border-strong)] font-mono text-xs active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  <FileText size={13} aria-hidden="true" />
                  完整技术规格与源码
                </span>
                <ArrowRight size={13} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── 完整规格抽屉（二级动作，不再是唯一入口） ───────────────── */}
      <Sheet open={specOpen} onOpenChange={setSpecOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl">
          <SheetHeader className="border-b border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <div className="mb-2 flex items-center gap-2 font-mono text-xs">
              <span className="font-bold tracking-wider text-[var(--accent)]">{active.code}</span>
              <span className="text-[var(--fg-faint)]">/</span>
              <span className="text-[var(--fg-muted)]">ENGINEERING SPEC</span>
            </div>
            <SheetTitle>{active.title}</SheetTitle>
            <SheetDescription>{active.summary}</SheetDescription>
          </SheetHeader>

          <SheetBody className="flex-1 space-y-8 overflow-y-auto p-6 sm:p-8">
            <section className="space-y-2">
              <h4 className="font-mono text-xs font-bold text-[var(--fg)]">核心机制原理</h4>
              <p className="text-sm leading-relaxed text-[var(--fg-muted)]">{active.mechanism}</p>
            </section>

            {active.formula && (
              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-[var(--fg)]">数学模型与公式推导</h4>
                <div className="rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/60 p-5">
                  <MathFormula formula={active.formula} displayMode />
                  {active.formulaDescription && (
                    <p className="border-t border-[var(--border)] pt-2 font-mono text-[11px] text-[var(--fg-muted)]">
                      {active.formulaDescription}
                    </p>
                  )}
                </div>
              </section>
            )}

            {active.codeSnippet && (
              <section className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--fg)]">
                    <Code2 size={13} className="text-[var(--accent)]" aria-hidden="true" />
                    {active.codeSnippet.description}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(active.codeSnippet?.code ?? "")}
                    className="h-7 px-2 font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  >
                    {isCopied ? (
                      <>
                        <Check size={12} className="text-[var(--success)]" aria-hidden="true" />
                        <span>已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} aria-hidden="true" />
                        <span>复制代码</span>
                      </>
                    )}
                  </Button>
                </div>
                <pre className="overflow-x-auto rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)] p-4 font-mono text-xs leading-relaxed text-[var(--fg)]">
                  <code>{active.codeSnippet.code}</code>
                </pre>
              </section>
            )}

            {active.misconception && (
              <section className="space-y-2">
                <h4 className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--warn)]">
                  <AlertTriangle size={13} aria-hidden="true" />
                  工程误区排雷
                </h4>
                <div className="space-y-1.5 rounded-[var(--radius-xs)] border border-[var(--warn)]/25 bg-[var(--warn)]/5 p-4">
                  <p className="font-mono text-xs font-bold text-[var(--warn)]">
                    误区：{active.misconception.myth}
                  </p>
                  <p className="text-xs leading-relaxed text-[var(--fg-muted)]">
                    实际：{active.misconception.truth}
                  </p>
                </div>
              </section>
            )}

            {active.ourWork && (
              <section className="flex items-center justify-between gap-4 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/50 p-4">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-bold text-[var(--accent)]">关联落地项目</span>
                  <h4 className="text-sm font-bold text-[var(--fg)]">{active.ourWork.title}</h4>
                  <p className="text-xs leading-relaxed text-[var(--fg-muted)]">
                    {active.ourWork.evidence}
                  </p>
                </div>
                {active.ourWork.link && (
                  <Button asChild variant="ghost" size="sm" className="shrink-0 font-mono text-xs">
                    <Link href={active.ourWork.link}>
                      查看工程
                      <ArrowRight size={13} className="ml-1" aria-hidden="true" />
                    </Link>
                  </Button>
                )}
              </section>
            )}
          </SheetBody>
        </SheetContent>
      </Sheet>
    </div>
  );
}
