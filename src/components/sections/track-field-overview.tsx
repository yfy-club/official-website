"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

import type { TrackOverviewData } from "@/content/track-overviews";
import { CardCorners, CardFrame } from "@/components/ui/card";
import { TechTag } from "@/components/ui/tech-tag";
import { cn } from "@/lib/utils";

interface TrackFieldOverviewProps {
  data: TrackOverviewData;
}

export function TrackFieldOverview({ data }: TrackFieldOverviewProps) {
  const reduceMotion = useReducedMotion();
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);

  return (
    <div className="w-full space-y-6">
      {/* 1. 三大主攻领域（全宽纵向 Swiss Editorial 流线清单） */}
      <CardFrame className="border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden">
        <CardCorners />

        {/* 领域表头 */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 sm:px-6 border-b border-[var(--border)] bg-[var(--surface-2)]/35 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--accent)]">03.1 //</span>
            <span className="font-semibold uppercase tracking-wider text-[var(--fg)]">
              主攻研究领域
            </span>
          </div>
          <span className="text-[10px] text-[var(--fg-faint)] tabular">
            {data.pillars.length} DOMAINS
          </span>
        </div>

        {/* 纵向流线行清单 */}
        <div className="divide-y divide-[var(--border)]">
          {data.pillars.map((pillar, idx) => {
            const isHovered = hoveredPillar === idx;
            const isDimmed = !reduceMotion && hoveredPillar !== null && !isHovered;

            return (
              <div
                key={pillar.code}
                onMouseEnter={() => setHoveredPillar(idx)}
                onMouseLeave={() => setHoveredPillar(null)}
                className={cn(
                  "group/row relative p-5 sm:p-6 transition-all duration-200 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center",
                  isHovered && "bg-[var(--surface-2)]/40",
                  isDimmed && "opacity-60"
                )}
              >
                {/* 标号与主攻领域名称 */}
                <div className="lg:col-span-4 flex items-center gap-3">
                  <span
                    className={cn(
                      "font-mono text-xs sm:text-sm font-bold tracking-wider shrink-0 transition-colors",
                      isHovered ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"
                    )}
                  >
                    0{idx + 1} {"//"}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--fg)] tracking-tight m-0">
                      {pillar.title}
                    </h3>
                    <p className="font-mono text-[11px] text-[var(--fg-faint)] uppercase tracking-wider mt-0.5 m-0">
                      {pillar.subtitle}
                    </p>
                  </div>
                </div>

                {/* 核心攻坚原理与指标 */}
                <div className="lg:col-span-5">
                  <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed m-0 font-sans">
                    {pillar.description}
                  </p>
                </div>

                {/* 关键技术栈标签 */}
                <div className="lg:col-span-3 flex flex-wrap items-center gap-1.5 lg:justify-end">
                  {pillar.tags.map((tag) => (
                    <TechTag key={tag} name={tag} className="py-0.5 px-2 text-[11px]" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardFrame>

      {/* 2. 研发工程全链路（全宽横向贯通流水线） */}
      <CardFrame className="border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden">
        <CardCorners />

        {/* 链路表头 */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 sm:px-6 border-b border-[var(--border)] bg-[var(--surface-2)]/35 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--accent)]">03.2 //</span>
            <span className="font-semibold uppercase tracking-wider text-[var(--fg)]">
              研发工程全链路
            </span>
          </div>
          <span className="text-[10px] text-[var(--fg-faint)] tabular">
            {data.pipelineSteps.length} PHASES
          </span>
        </div>

        {/* 4 阶段全宽平铺流水线网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
          {data.pipelineSteps.map((step, sIdx) => {
            return (
              <div
                key={step.step}
                className="p-5 sm:p-6 flex flex-col justify-between space-y-3 bg-[var(--surface)] hover:bg-[var(--surface-2)]/40 transition-colors group/step"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[var(--accent)]">
                    {step.step} {"//"}
                  </span>
                  <span className="text-[10px] text-[var(--fg-faint)]">
                    PHASE 0{sIdx + 1}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-[var(--fg)] tracking-tight">
                    {step.label}
                  </h4>
                  <p className="text-xs text-[var(--fg-muted)] leading-relaxed m-0">
                    {step.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-[var(--fg-faint)] border-t border-[var(--border)]/60">
                  <span>STEP 0{sIdx + 1}</span>
                  {sIdx < data.pipelineSteps.length - 1 ? (
                    <ArrowRight size={11} className="text-[var(--accent)]/70 group-hover/step:translate-x-0.5 transition-transform" />
                  ) : (
                    <span className="text-[var(--success)] font-semibold">DELIVERY</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardFrame>
    </div>
  );
}
