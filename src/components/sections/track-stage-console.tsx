"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Briefcase,
  CheckCircle2,
  Compass,
  GraduationCap,
} from "lucide-react";

import type { Stage, TrackCurriculumModule } from "@/content";
import { cn } from "@/lib/utils";

export interface TrackStageConsoleProps {
  modules?: TrackCurriculumModule[];
  roadmap: {
    freshman: Stage;
    sophomore: Stage;
    junior: {
      employment: Stage;
      postgrad: Stage;
    };
  };
}

export function TrackStageConsole({ modules = [], roadmap }: TrackStageConsoleProps) {
  const reduceMotion = useReducedMotion();
  const [activeStage, setActiveStage] = useState<0 | 1 | 2>(0);
  const [juniorChannel, setJuniorChannel] = useState<"employment" | "postgrad">("employment");

  const stageTabs = [
    { code: "01", year: "大一", label: "底层筑基与工程启蒙" },
    { code: "02", year: "大二", label: "方向攻坚与项目实战" },
    { code: "03", year: "大三", label: "就业与考研双通道" },
  ];

  const currentModule = modules[activeStage] || {
    stage: stageTabs[activeStage].code,
    title: stageTabs[activeStage].label,
    objective: "遵循循序渐进培养方针，完成扎实的工程进阶。",
    coreTopics: [],
  };

  const currentRoadmap =
    activeStage === 0
      ? roadmap.freshman
      : activeStage === 1
      ? roadmap.sophomore
      : juniorChannel === "employment"
      ? roadmap.junior.employment
      : roadmap.junior.postgrad;

  return (
    <div className="w-full space-y-12">
      {/* 1. 横向全宽阶梯跃迁轴 (Swiss Precision Leap) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-[var(--border)] gap-2 pb-1">
        {stageTabs.map((tab, idx) => {
          const isActive = activeStage === idx;

          return (
            <button
              key={tab.code}
              type="button"
              onClick={() => setActiveStage(idx as 0 | 1 | 2)}
              className={cn(
                "relative flex-1 py-4 px-2 text-left sm:text-center transition-colors cursor-pointer select-none group",
                isActive ? "text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              )}
            >
              <div className="flex sm:flex-col items-baseline sm:items-center justify-between sm:justify-center gap-2">
                <span className={cn(
                  "font-mono text-xs font-bold transition-colors",
                  isActive ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"
                )}>
                  {`STAGE 0${idx + 1}`}
                </span>
                <span className="text-sm sm:text-base font-bold tracking-tight">
                  {tab.year} · {tab.label}
                </span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="stage-active-line"
                  className="absolute inset-x-0 -bottom-[1px] h-0.5 bg-[var(--accent)]"
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. 阶段工作台详情 (无重叠卡片，松散大字排版) */}
      <div className="space-y-8">
        {/* 阶段标题与双通道切换 */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[var(--border)]">
          <div className="space-y-2 max-w-3xl">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--fg)] tracking-tight">
              {currentModule.title}
            </h3>
            <p className="text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed font-sans pt-1">
              {currentModule.objective}
            </p>
          </div>

          {/* 大三双通道切换 */}
          {activeStage === 2 && (
            <div className="inline-flex items-center gap-1.5 p-1 rounded-[var(--radius-full)] bg-[var(--surface-2)] border border-[var(--border)] shrink-0 self-start">
              <button
                type="button"
                onClick={() => setJuniorChannel("employment")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-[var(--radius-full)] transition-all cursor-pointer",
                  juniorChannel === "employment"
                    ? "bg-[var(--surface)] text-[var(--fg)] font-bold shadow-xs border border-[var(--border-strong)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                )}
              >
                <Briefcase size={13} className={juniorChannel === "employment" ? "text-[var(--accent)]" : ""} />
                <span>一线就业</span>
              </button>
              <button
                type="button"
                onClick={() => setJuniorChannel("postgrad")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-[var(--radius-full)] transition-all cursor-pointer",
                  juniorChannel === "postgrad"
                    ? "bg-[var(--surface)] text-[var(--fg)] font-bold shadow-xs border border-[var(--border-strong)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                )}
              >
                <GraduationCap size={13} className={juniorChannel === "postgrad" ? "text-[var(--accent)]" : ""} />
                <span>考研深造</span>
              </button>
            </div>
          )}
        </div>

        {/* 双栏里程碑 (左栏：课题攻坚，右栏：交付达标) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* 左栏：核心实训课题 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--fg)]">
              <Compass size={15} className="text-[var(--accent)]" aria-hidden="true" />
              <span>专项实训课题</span>
            </div>
            <div className="space-y-3">
              {currentModule.coreTopics && currentModule.coreTopics.length > 0 ? (
                currentModule.coreTopics.map((topic, i) => (
                  <div
                    key={topic}
                    className="flex items-start gap-4 p-4 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)]/50 hover:bg-[var(--surface-2)]/50 transition-colors"
                  >
                    <span className="font-mono text-xs text-[var(--accent)] font-bold pt-0.5">
                      {`0${i + 1}`}
                    </span>
                    <span className="text-sm font-medium text-[var(--fg)] leading-relaxed">
                      {topic}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-xs text-[var(--fg-muted)] font-mono">
                  专项课题持续迭代中
                </div>
              )}
            </div>
          </div>

          {/* 右栏：阶段交付达标 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--fg)]">
              <CheckCircle2 size={15} className="text-emerald-500" aria-hidden="true" />
              <span>阶段达标标准</span>
            </div>
            <div className="space-y-3">
              {currentRoadmap.items.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 p-4 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)]/30 hover:bg-[var(--surface-2)]/50 transition-colors"
                >
                  <span className="font-mono text-xs text-emerald-500 font-bold pt-0.5">
                    ✓
                  </span>
                  <span className="text-sm font-medium text-[var(--fg)] leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
