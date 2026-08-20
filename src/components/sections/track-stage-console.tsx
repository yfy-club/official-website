"use client";

import { useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Compass,
  FlaskConical,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
  const [activeStage, setActiveStage] = useState<0 | 1 | 2>(0);
  const [juniorChannel, setJuniorChannel] = useState<"employment" | "postgrad">("employment");

  const stageTabs = [
    { code: "STG-01", year: "FRESHMAN // 大一", label: "底层筑基与工程启蒙", status: "FOUNDATION" },
    { code: "STG-02", year: "SOPHOMORE // 大二", label: "方向攻坚与项目实战", status: "SPECIALIZATION" },
    { code: "STG-03", year: "JUNIOR // 大三", label: "就业/考研精准双通道", status: "DUAL TRACK" },
  ];

  const currentModule = modules[activeStage] || {
    stage: stageTabs[activeStage].code,
    title: stageTabs[activeStage].label,
    objective: "遵循循序渐进培养方针，完成扎实的工程进阶。",
    coreTopics: [],
    experiment: "完成本阶段规定的实训课题与综合答辩",
    reviewStandard: "通过导师组代码审查规范与结项测试",
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
    <div className="w-full space-y-8">
      {/* 1. 三年里程碑水平推进导航条 (Horizontal Milestone Bar) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stageTabs.map((tab, idx) => {
          const isActive = activeStage === idx;

          return (
            <button
              key={tab.code}
              type="button"
              onClick={() => setActiveStage(idx as 0 | 1 | 2)}
              className={cn(
                "relative text-left p-5 rounded-[var(--radius-sm)] border transition-all cursor-pointer",
                isActive
                  ? "border-[var(--accent)] bg-[var(--surface)] shadow-xs"
                  : "border-[var(--border)] bg-[var(--surface-2)]/60 hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)]",
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] font-bold text-[var(--accent)]">
                  {tab.year}
                </span>
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isActive ? "bg-[var(--accent)] ring-4 ring-[var(--accent)]/20" : "bg-[var(--border-strong)]",
                  )}
                />
              </div>
              <div className="text-base sm:text-lg font-bold text-[var(--fg)] tracking-tight">
                {tab.label}
              </div>
              <div className="text-xs font-mono text-[var(--fg-muted)] mt-1">
                {`STAGE 0${idx + 1} // ${tab.status}`}
              </div>

              {isActive && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--accent)] rounded-b-[var(--radius-sm)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. 阶段工作台主舱体 (Stage Workspace) */}
      <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 shadow-xs space-y-8">
        {/* 阶段标题与目标 */}
        <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b border-[var(--border)]">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[var(--accent)]">
                {stageTabs[activeStage].code} {"//"} CURRICULUM SYLLABUS
              </span>
              <Badge variant="active" className="text-[10px]">
                {stageTabs[activeStage].status}
              </Badge>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--fg)] tracking-tight">
              {currentModule.title}
            </h3>
            <p className="text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed pt-1">
              {currentModule.objective}
            </p>
          </div>

          {/* 大三阶段：就业与考研双通道切换器 */}
          {activeStage === 2 && (
            <div className="flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-[var(--radius-xs)] border border-[var(--border)]">
              <button
                type="button"
                onClick={() => setJuniorChannel("employment")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-[var(--radius-xs)] transition-all cursor-pointer",
                  juniorChannel === "employment"
                    ? "bg-[var(--surface)] text-[var(--fg)] font-bold shadow-xs border border-[var(--border-strong)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
                )}
              >
                <Briefcase size={13} className={juniorChannel === "employment" ? "text-[var(--accent)]" : ""} />
                <span>一线就业实习</span>
              </button>
              <button
                type="button"
                onClick={() => setJuniorChannel("postgrad")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-[var(--radius-xs)] transition-all cursor-pointer",
                  juniorChannel === "postgrad"
                    ? "bg-[var(--surface)] text-[var(--fg)] font-bold shadow-xs border border-[var(--border-strong)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
                )}
              >
                <GraduationCap size={13} className={juniorChannel === "postgrad" ? "text-[var(--accent)]" : ""} />
                <span>408 考研深造</span>
              </button>
            </div>
          )}
        </div>

        {/* 培养要点与课题矩阵 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 左列：核心学习与实训课题 */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Compass size={16} className="text-[var(--accent)]" />
                <h4 className="font-mono text-xs font-bold text-[var(--fg)]">
                  核心学习与实战课题
                </h4>
              </div>
              <div className="space-y-2.5">
                {currentModule.coreTopics.map((topic, i) => (
                  <div
                    key={topic}
                    className="flex items-start gap-3 p-3 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/60 border border-[var(--border)] text-xs sm:text-sm text-[var(--fg)] font-medium"
                  >
                    <span className="font-mono text-[11px] text-[var(--accent)] font-bold pt-0.5">
                      {`0${i + 1}.`}
                    </span>
                    <span className="leading-relaxed">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 阶梯路径 Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <h4 className="font-mono text-xs font-bold text-[var(--fg)]">
                  阶段达标清单
                </h4>
              </div>
              <div className="space-y-2">
                {currentRoadmap.items.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs text-[var(--fg-muted)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右列：阶段结项实训 & Code Review 准则 */}
          <div className="lg:col-span-5 space-y-6">
            {/* 阶段实训项目 */}
            <div className="p-5 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--fg)]">
                <FlaskConical size={15} className="text-[var(--accent)]" />
                <span>阶段结项实训</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--fg)] leading-relaxed">
                {currentModule.experiment}
              </p>
            </div>

            {/* 导师 Code Review 考核标准 */}
            <div className="p-5 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border-strong)] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent)]">
                <ShieldCheck size={15} />
                <span>代码审查标准</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
                {currentModule.reviewStandard}
              </p>
              <div className="pt-2 border-t border-[var(--border)] text-[11px] font-mono text-[var(--fg-faint)]">
                * 需提交标准 Git 提交历史，通过 ESLint/PEP8/Google Style 门禁与导师组现场答辩。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
