"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  Layers,
  Sparkles,
} from "lucide-react";

import { TrackArchitectureVisualizer } from "@/components/motion/track-architecture-visualizer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TrackDeepDive } from "@/content";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface TrackDeepArchitectureProps {
  deepDive: TrackDeepDive;
}

export function TrackDeepArchitecture({ deepDive }: TrackDeepArchitectureProps) {
  const [activeConceptIndex, setActiveConceptIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const concepts = deepDive.concepts;
  const currentConcept = concepts[activeConceptIndex] || concepts[0];

  const handleConceptChange = (index: number) => {
    setActiveConceptIndex(index);
  };

  const handleCopyCode = (code: string) => {
    copyToClipboard(code);
  };

  return (
    <div className="w-full space-y-10">
      {/* 1. 交互式架构可视化总览台 */}
      <div className="space-y-4">
        <TrackArchitectureVisualizer slug={deepDive.slug} />
      </div>

      {/* 2. 核心原理渐进式探索中枢 (Progressive Disclosure Dossier) */}
      <div className="space-y-6">
        {/* 概念切换选项卡 */}
        <div className="flex items-center gap-2 p-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)] overflow-x-auto no-scrollbar">
          {concepts.map((concept, idx) => {
            const isActive = activeConceptIndex === idx;
            const shortTitle = concept.title.split("：")[0]?.trim() || concept.title;

            return (
              <button
                key={concept.code}
                type="button"
                onClick={() => handleConceptChange(idx)}
                className={cn(
                  "relative z-10 flex-1 min-w-[160px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-[var(--radius-xs)] text-xs sm:text-sm font-mono transition-all whitespace-nowrap cursor-pointer",
                  isActive
                    ? "text-[var(--fg)] font-bold shadow-xs"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
                )}
              >
                <span className="text-[11px] text-[var(--accent)] font-semibold">{`0${idx + 1} //`}</span>
                <span>{shortTitle}</span>

                {isActive && (
                  <motion.div
                    layoutId="deep-concept-active-pill"
                    className="absolute inset-0 bg-[var(--surface)] border border-[var(--border-strong)] rounded-[var(--radius-xs)] -z-10 shadow-xs"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 概念主卡片（默认低密度、大气松散、大字排版；点击可展开高密度讲义与源码） */}
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 shadow-xs space-y-8 transition-all">
          {/* 顶栏元数据 */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[var(--accent)] tracking-wider">
                DOSSIER 0{activeConceptIndex + 1} {"//"} {currentConcept.code}
              </span>
              <Badge variant="outline" className="font-mono text-[10px]">
                THEORY & SYSTEM
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {currentConcept.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-2)] text-[10px] font-mono text-[var(--fg-muted)] border border-[var(--border)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 灵魂提问（大字号、强冲击力、呼吸感排版） */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-xs font-mono text-[var(--accent)] font-semibold">
              <Sparkles size={13} />
              <span>CORE ENGINEERING QUESTION</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--fg)] tracking-tight leading-snug">
              {currentConcept.question}
            </h3>
            <p className="text-base sm:text-lg text-[var(--fg-muted)] leading-relaxed max-w-4xl pt-1">
              {currentConcept.summary}
            </p>
          </div>

          {/* 核心公式紧凑预览栏 (Formula Preview) */}
          {currentConcept.formula && (
            <div className="p-4 sm:p-5 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-[var(--fg-faint)] uppercase tracking-wider block">
                  MATHEMATICAL PRINCIPLE // 数学定义
                </span>
                <div className="font-mono text-sm sm:text-base font-bold text-[var(--fg)] tracking-wide">
                  {currentConcept.formula}
                </div>
              </div>
              {currentConcept.formulaDescription && (
                <span className="text-xs text-[var(--fg-muted)] font-mono sm:text-right max-w-xs">
                  {currentConcept.formulaDescription}
                </span>
              )}
            </div>
          )}

          {/* 展开/收起 深度工程讲义与源码交互按钮 */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full h-12 rounded-[var(--radius-xs)] flex items-center justify-center gap-2 font-mono text-xs sm:text-sm border border-[var(--border-strong)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--surface-2)] text-[var(--fg)] cursor-pointer transition-all shadow-xs"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={16} className="text-[var(--accent)]" />
                  <span>收起深度工程讲义与代码 // COLLAPSE DEEP DIVE</span>
                </>
              ) : (
                <>
                  <ChevronDown size={16} className="text-[var(--accent)]" />
                  <span>展开深度工程机制、源码与误区排雷 // EXPAND DEEP DIVE</span>
                </>
              )}
            </button>
          </div>

          {/* 展开后呈现的高密度硬核内容 (Collapsible High-Density Dossier) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                key={`expanded-${currentConcept.code}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden space-y-8 pt-4 border-t border-[var(--border)]"
              >
                {/* 1. 底层机制解析 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-[var(--accent)]" />
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--fg)]">
                      底层机制与系统推演 // MECHANISM DEEP DIVE
                    </h4>
                  </div>
                  <p className="text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed">
                    {currentConcept.mechanism}
                  </p>
                </div>

                {/* 2. 真实生产/教学源码实现 */}
                {currentConcept.codeSnippet && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Code2 size={16} className="text-[var(--accent)]" />
                        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--fg)]">
                          核心工程源码实现 // CODE IMPLEMENTATION ({currentConcept.codeSnippet.language.toUpperCase()})
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-[var(--fg-faint)]">
                        {currentConcept.codeSnippet.description}
                      </span>
                    </div>

                    <div className="relative rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border-strong)] p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                      <button
                        type="button"
                        onClick={() => handleCopyCode(currentConcept.codeSnippet?.code || "")}
                        className="absolute top-3 right-3 p-2 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border-strong)] transition-all cursor-pointer"
                        aria-label="复制代码"
                      >
                        {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                      <pre className="text-[var(--fg)] leading-relaxed pr-10">
                        <code>{currentConcept.codeSnippet.code}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* 3. 常见认知误区排雷 */}
                {currentConcept.misconception && (
                  <div className="p-5 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/60 border border-amber-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-bold">
                      <AlertTriangle size={15} />
                      <span>COMMON MISCONCEPTION // 常见认知误区排雷</span>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <p className="text-[var(--fg-muted)]">
                        <strong className="text-amber-400/90 font-mono">误区直觉：</strong>{" "}
                        {currentConcept.misconception.myth}
                      </p>
                      <p className="text-[var(--fg)]">
                        <strong className="text-[var(--accent)] font-mono">工程真相：</strong>{" "}
                        {currentConcept.misconception.truth}
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. 社团实战成果与作品联动 */}
                {currentConcept.ourWork && (
                  <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between flex-wrap gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[var(--accent)] font-bold">
                        YFY LAB PRACTICAL CASE // 社团落地成果
                      </span>
                      <div className="text-xs sm:text-sm text-[var(--fg)] font-semibold">
                        {currentConcept.ourWork.title}：{currentConcept.ourWork.evidence}
                      </div>
                    </div>
                    <Button asChild size="sm" variant="ghost" className="font-mono text-xs gap-1.5 h-8 border border-[var(--border)]">
                      <Link href={currentConcept.ourWork.link}>
                        <span>查看关联项目</span>
                        <ArrowRight size={13} />
                      </Link>
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
