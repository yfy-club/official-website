"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Layers,
  Sparkles,
} from "lucide-react";

import { CutoutCorner } from "@/components/ui/cutout-card";
import { TrackArchitectureVisualizer } from "@/components/motion/track-architecture-visualizer";
import { Button } from "@/components/ui/button";
import { MathFormula } from "@/components/ui/math-formula";
import {
  Sheet,
  SheetBody,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { TrackDeepDive } from "@/content";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

interface TrackDeepArchitectureProps {
  deepDive: TrackDeepDive;
}

export function TrackDeepArchitecture({ deepDive }: TrackDeepArchitectureProps) {
  const [selectedConceptIndex, setSelectedConceptIndex] = useState<number | null>(null);
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const concepts = deepDive.concepts;
  const activeConcept = selectedConceptIndex !== null ? concepts[selectedConceptIndex] : null;

  return (
    <div className="w-full space-y-10">
      {/* 1. 交互式架构拓扑控制台 (默认空灵纯净展示) */}
      <div className="w-full">
        <TrackArchitectureVisualizer slug={deepDive.slug} />
      </div>

      {/* 2. 核心攻坚概念矩阵 (Cutout 机械切角工牌排版，点击呼出 Sheet 抽屉) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[var(--border)]">
        {concepts.map((concept, idx) => {
          const displayTitle = concept.shortTitle || concept.title.split("：")[0]?.trim() || concept.title;

          return (
            <div
              key={concept.code}
              onClick={() => setSelectedConceptIndex(idx)}
              className="relative p-6 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)]/40 hover:bg-[var(--surface-2)]/70 hover:border-[var(--border-strong)] transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-4 overflow-hidden active:scale-[0.98]"
            >
              {/* Cutout 45° 机械裁切角 */}
              <div className="absolute top-0 right-0 z-10 pointer-events-none">
                <CutoutCorner className="text-[var(--bg)]" size={26} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between pr-4">
                  <span className="font-mono text-xs font-bold text-[var(--accent)] tracking-wider">
                    {`0${idx + 1} // ${concept.code}`}
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-[var(--fg-faint)] group-hover:text-[var(--fg)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--fg)] tracking-tight group-hover:text-[var(--accent)] transition-colors">
                  {displayTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed line-clamp-2">
                  {concept.summary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border)]/60">
                {concept.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-2)] text-[10px] font-mono text-[var(--fg-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Coss Sheet 深度技术白皮书抽屉 (高密度承载公式、代码、排雷与权衡) */}
      <Sheet
        open={selectedConceptIndex !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedConceptIndex(null);
        }}
      >
        {activeConcept && (
          <SheetBody className="p-0 space-y-0 max-w-2xl bg-[var(--surface)]">
            <SheetHeader className="p-6 sm:p-8 bg-[var(--surface)] border-b border-[var(--border)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-[var(--accent)] tracking-wider">
                  {activeConcept.code}
                </span>
                <span className="text-[var(--fg-faint)]">/</span>
                <span className="font-mono text-xs text-[var(--fg-muted)]">ENGINEERING SPEC</span>
              </div>
              <SheetTitle>{activeConcept.title}</SheetTitle>
              <SheetDescription>{activeConcept.summary}</SheetDescription>
            </SheetHeader>

            <div className="p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-180px)]">
              {/* 核心机制解析 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--fg)]">
                  <Layers size={14} className="text-[var(--accent)]" aria-hidden="true" />
                  <span>核心机制原理</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed font-sans">
                  {activeConcept.mechanism}
                </p>
              </div>

              {/* 严谨数学公式推导 */}
              {activeConcept.formula && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--fg)]">
                    <Sparkles size={14} className="text-[var(--accent)]" aria-hidden="true" />
                    <span>数学模型与公式推导</span>
                  </div>
                  <div className="p-5 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/60 border border-[var(--border)] space-y-2">
                    <MathFormula formula={activeConcept.formula} displayMode />
                    {activeConcept.formulaDescription && (
                      <p className="text-[11px] font-mono text-[var(--fg-muted)] pt-1 border-t border-[var(--border)]">
                        {activeConcept.formulaDescription}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 生产级核心源码 */}
              {activeConcept.codeSnippet && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--fg)]">
                      <Code2 size={14} className="text-[var(--accent)]" aria-hidden="true" />
                      <span>{activeConcept.codeSnippet.description}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(activeConcept.codeSnippet?.code ?? "")}
                      className="h-7 px-2 text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    >
                      {isCopied ? (
                        <>
                          <Check size={12} className="text-emerald-500" aria-hidden="true" />
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
                  <div className="rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)] p-4 font-mono text-xs overflow-x-auto text-[var(--fg)] leading-relaxed">
                    <pre>
                      <code>{activeConcept.codeSnippet.code}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* 认知误区与排雷指南 */}
              {activeConcept.misconception && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--warn)]">
                    <AlertTriangle size={14} aria-hidden="true" />
                    <span>工程误区排雷</span>
                  </div>
                  <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--warn)]/5 border border-[var(--warn)]/20 space-y-1.5">
                    <p className="text-xs font-bold text-[var(--warn)] font-mono">
                      ❌ 误区：{activeConcept.misconception.myth}
                    </p>
                    <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                      💡 实际：{activeConcept.misconception.truth}
                    </p>
                  </div>
                </div>
              )}

              {/* 落地项目案例联动 */}
              {activeConcept.ourWork && (
                <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/50 border border-[var(--border)] flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-[var(--accent)] font-bold">
                      关联落地项目
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--fg)]">
                      {activeConcept.ourWork.title}
                    </h4>
                    <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                      {activeConcept.ourWork.evidence}
                    </p>
                  </div>
                  {activeConcept.ourWork.link && (
                    <Button asChild variant="ghost" size="sm" className="shrink-0 text-xs font-mono">
                      <Link href={activeConcept.ourWork.link}>
                        查看工程 <ArrowRight size={13} className="ml-1" aria-hidden="true" />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </SheetBody>
        )}
      </Sheet>
    </div>
  );
}
