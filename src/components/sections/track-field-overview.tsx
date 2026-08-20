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

  const selectedPillar = data.pillars[activePillar] || data.pillars[0];

  return (
    <div className="w-full space-y-8">
      {/* 1. 纲领导引 */}
      <div className="pb-6 border-b border-[var(--border)]">
        <p className="text-base sm:text-lg text-[var(--fg-muted)] leading-relaxed font-sans max-w-4xl">
          {data.leadParagraph}
        </p>
      </div>

      {/* 2. 左右排版工控研发图谱控制台 (Left: Pillars / Right: Pipeline Console) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* 左侧 (lg:col-span-6): 主攻领域清单 (Swiss Editorial List) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <span className="font-mono text-xs font-bold text-[var(--accent)] tracking-wider">
              01 // RESEARCH PILLARS
            </span>
            <span className="font-mono text-xs text-[var(--fg-faint)]">
              {data.pillars.length} DOMAINS
            </span>
          </div>

          <div className="divide-y divide-[var(--border)] flex-1 flex flex-col justify-between">
            {data.pillars.map((pillar, idx) => {
              const isSelected = activePillar === idx;
              return (
                <div
                  key={pillar.code}
                  onClick={() => setActivePillar(idx)}
                  className={cn(
                    "py-5 transition-[background-color,padding,opacity,border-color] duration-200 cursor-pointer select-none group",
                    isSelected
                      ? "opacity-100 pl-3 border-l-2 border-[var(--accent)] bg-[var(--surface-2)]/50 rounded-r-[var(--radius-xs)]"
                      : "opacity-65 hover:opacity-100 hover:pl-2"
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={cn(
                            "font-mono text-sm sm:text-base font-bold tracking-tight shrink-0 transition-colors",
                            isSelected ? "text-[var(--accent)]" : "text-[var(--fg-faint)] group-hover:text-[var(--fg)]"
                          )}
                        >
                          {`0${idx + 1}`}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-[var(--fg)] tracking-tight">
                          {pillar.title}
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-[var(--fg-faint)] shrink-0">
                        {pillar.code}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed font-sans line-clamp-2">
                      {pillar.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {pillar.tags.map((tag) => (
                        <TechTag key={tag} name={tag} className="py-0.5 px-2 text-[11px]" />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧 (lg:col-span-6): 研发工程链路控制台 (Pipeline & Milestones) */}
        <div className="lg:col-span-6">
          <div className="relative h-full min-h-[380px] rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:border-[var(--border-strong)] transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-[var(--accent)] tracking-wider">
                  02 // ENGINEERING PIPELINE
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[var(--fg)] tracking-tight">
                  {selectedPillar?.title} · 研发全链路
                </h4>
              </div>
              <span className="font-mono text-xs text-[var(--fg-muted)] px-2.5 py-1 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)]">
                {data.pipelineSteps.length} PHASES
              </span>
            </div>

            {/* 4 步研发工程链路卡片网格 (2x2 Grid) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1"
              >
                {data.pipelineSteps.map((step, sIdx) => {
                  const isStepActive = activeStep === sIdx;
                  return (
                    <div
                      key={step.step}
                      onClick={() => setActiveStep(sIdx)}
                      className={cn(
                        "p-4 rounded-[var(--radius-xs)] border transition-all duration-150 cursor-pointer active:scale-[0.98] flex flex-col justify-between space-y-2 select-none",
                        isStepActive
                          ? "border-[var(--accent)] bg-[var(--surface-2)] shadow-xs"
                          : "border-[var(--border)] bg-[var(--surface-2)]/30 hover:border-[var(--border-strong)]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[var(--accent)]">
                          {step.step}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--fg-faint)]">
                          PHASE 0{sIdx + 1}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-[var(--fg)] mb-1">
                          {step.label}
                        </h5>
                        <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed font-sans line-clamp-3">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
