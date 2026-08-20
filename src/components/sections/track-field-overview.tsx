"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Activity, Layers, Sparkles, Workflow } from "lucide-react";

import type { TrackOverviewData } from "@/content/track-overviews";
import { TechTag } from "@/components/ui/tech-tag";
import { cn } from "@/lib/utils";

interface TrackFieldOverviewProps {
  data: TrackOverviewData;
}

export function TrackFieldOverview({ data }: TrackFieldOverviewProps) {
  const reduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activePillar, setActivePillar] = useState<number>(0);

  return (
    <div className="w-full space-y-12">
      {/* 1. 导引与产业趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-8 border-b border-[var(--border)]">
        <div className="lg:col-span-7">
          <p className="text-base sm:text-lg text-[var(--fg)] leading-relaxed font-medium">
            {data.leadParagraph}
          </p>
        </div>
        <div className="lg:col-span-5 p-5 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/60 border border-[var(--border)] space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--fg)]">
            <Sparkles size={14} className="text-[var(--accent)]" />
            <span>产业趋势</span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
            {data.industryTrend}
          </p>
        </div>
      </div>

      {/* 2. 主攻方向与研发链路 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* 左侧：主攻方向 */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-[var(--accent)]" />
            <h3 className="font-mono text-xs font-bold text-[var(--fg)]">
              主攻方向
            </h3>
          </div>

          <div className="space-y-6 divide-y divide-[var(--border)]">
            {data.pillars.map((pillar, idx) => {
              const isSelected = activePillar === idx;
              return (
                <div
                  key={pillar.code}
                  onClick={() => setActivePillar(idx)}
                  className={cn(
                    "pt-6 first:pt-0 space-y-3 cursor-pointer transition-colors group",
                    isSelected ? "opacity-100" : "opacity-75 hover:opacity-100",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "font-mono text-xs font-bold px-2 py-0.5 rounded-[var(--radius-2xs)] transition-colors",
                          isSelected
                            ? "bg-[var(--accent)] text-[var(--accent-fg,white)]"
                            : "bg-[var(--surface-2)] text-[var(--fg-muted)] group-hover:text-[var(--fg)]",
                        )}
                      >
                        {pillar.code}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-[var(--fg)] tracking-tight">
                        {pillar.title}
                      </h4>
                    </div>
                    <span className="font-mono text-xs text-[var(--fg-faint)] hidden sm:inline">
                      {pillar.subtitle}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed pl-1">
                    {pillar.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
                    {pillar.tags.map((tag) => (
                      <TechTag key={tag} name={tag} className="text-xs py-0.5 px-2" />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧：研发技术链路 */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Workflow size={15} className="text-[var(--accent)]" />
                <span className="font-mono text-xs font-bold text-[var(--fg)]">
                  研发技术链路
                </span>
              </div>
            </div>

            {/* 链路步骤 */}
            <div className="space-y-3">
              {data.pipelineSteps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={step.step}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={cn(
                      "w-full text-left p-3.5 rounded-[var(--radius-xs)] border transition-all cursor-pointer flex items-start gap-3",
                      isActive
                        ? "border-[var(--accent)] bg-[var(--surface-2)] shadow-xs"
                        : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]/50",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-xs font-bold px-1.5 py-0.5 rounded-[var(--radius-2xs)] shrink-0 mt-0.5",
                        isActive
                          ? "bg-[var(--accent)] text-[var(--accent-fg,white)]"
                          : "bg-[var(--surface-2)] text-[var(--fg-muted)]",
                      )}
                    >
                      {step.step}
                    </span>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-[var(--fg)]">
                          {step.label}
                        </span>
                        {isActive && (
                          <motion.span
                            initial={reduceMotion ? {} : { scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                          />
                        )}
                      </div>
                      <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 落地项目 */}
            <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/70 border border-[var(--border)] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-emerald-500" />
                  <span className="text-xs font-mono font-bold text-[var(--fg)]">
                    {data.practicalApplication.domain}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-[var(--accent)]">
                  {data.practicalApplication.metric}
                </span>
              </div>
              <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                {data.practicalApplication.summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
