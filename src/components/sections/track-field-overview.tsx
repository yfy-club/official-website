"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type { TrackOverviewData } from "@/content/track-overviews";
import { TechTag } from "@/components/ui/tech-tag";
import { cn } from "@/lib/utils";

interface TrackFieldOverviewProps {
  data: TrackOverviewData;
}

export function TrackFieldOverview({ data }: TrackFieldOverviewProps) {
  const reduceMotion = useReducedMotion();
  const [activePillar, setActivePillar] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <div className="w-full space-y-12">
      {/* 1. 纲领导引 */}
      <div className="pb-8 border-b border-[var(--border)]">
        <p className="text-base sm:text-lg text-[var(--fg-muted)] leading-relaxed font-sans max-w-4xl">
          {data.leadParagraph}
        </p>
      </div>

      {/* 2. 主攻领域无框全宽清单 (Swiss Editorial List) */}
      <div className="space-y-4">
        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {data.pillars.map((pillar, idx) => {
            const isSelected = activePillar === idx;
            return (
              <div
                key={pillar.code}
                onClick={() => setActivePillar(idx)}
                className={cn(
                  "py-8 sm:py-10 transition-[background-color,padding,opacity] duration-200 cursor-pointer select-none group",
                  isSelected
                    ? "opacity-100"
                    : "opacity-60 hover:opacity-100 hover:pl-2"
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* 左侧：序号与标题 */}
                  <div className="flex items-baseline gap-4 sm:gap-6 min-w-0">
                    <span
                      className={cn(
                        "font-mono text-lg sm:text-xl font-bold tracking-tight shrink-0 transition-colors",
                        isSelected ? "text-[var(--accent)]" : "text-[var(--fg-faint)] group-hover:text-[var(--fg)]"
                      )}
                    >
                      {`0${idx + 1}`}
                    </span>
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg sm:text-xl font-bold text-[var(--fg)] tracking-tight">
                          {pillar.title}
                        </h3>
                        <span className="font-mono text-xs text-[var(--fg-faint)]">
                          {pillar.code} · {pillar.subtitle}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed max-w-3xl font-sans">
                        {pillar.description}
                      </p>
                    </div>
                  </div>

                  {/* 右侧：技术标签 */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 pl-10 lg:pl-0">
                    {pillar.tags.map((tag) => (
                      <TechTag key={tag} name={tag} className="py-1 px-3 text-xs" />
                    ))}
                  </div>
                </div>

                {/* 展开的研发工程链路 (Progressive Detail) */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={reduceMotion ? {} : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={reduceMotion ? {} : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden pt-8 mt-6 border-t border-[var(--border)]"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {data.pipelineSteps.map((step, sIdx) => {
                          const isStepActive = activeStep === sIdx;
                          return (
                            <div
                              key={step.step}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveStep(sIdx);
                              }}
                              className={cn(
                                "p-5 rounded-[var(--radius-xs)] border transition-all duration-150 cursor-pointer active:scale-[0.98]",
                                isStepActive
                                  ? "border-[var(--accent)] bg-[var(--surface-2)] shadow-xs"
                                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
                              )}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-mono text-xs font-bold text-[var(--accent)]">
                                  {step.step}
                                </span>
                                <span className="text-xs font-mono text-[var(--fg-faint)]">
                                  PHASE 0{sIdx + 1}
                                </span>
                              </div>
                              <h4 className="text-sm sm:text-base font-bold text-[var(--fg)] mb-1">
                                {step.label}
                              </h4>
                              <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
