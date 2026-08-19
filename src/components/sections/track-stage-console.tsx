"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Code2, FlaskConical, GraduationCap, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { StageIndicator } from "@/components/ui/stage-indicator";
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

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 24 : -24,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 24 : -24,
    opacity: 0,
  }),
};

export function TrackStageConsole({ modules = [], roadmap }: TrackStageConsoleProps) {
  const [[activeStage, direction], setStage] = useState<[0 | 1 | 2, number]>([0, 0]);
  const [juniorChannel, setJuniorChannel] = useState<"employment" | "postgrad">("employment");

  const stageTabs = [
    { code: "STG-01", label: "大一 · 打基础", status: "FOUNDATION" },
    { code: "STG-02", label: "大二 · 攻技术", status: "SPECIALIZATION" },
    { code: "STG-03", label: "大三 · 双通道", status: "DUAL TRACK" },
  ];

  const handleStageChange = (newStage: 0 | 1 | 2) => {
    if (newStage === activeStage) return;
    setStage([newStage, newStage > activeStage ? 1 : -1]);
  };

  // Map module to stage index
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
    <div className="w-full space-y-6">
      {/* 顶部三阶段控制台选项卡 */}
      <div className="flex items-center gap-1.5 p-1 rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)] overflow-x-auto no-scrollbar">
        {stageTabs.map((tab, idx) => {
          const isActive = activeStage === idx;

          return (
            <button
              key={tab.code}
              onClick={() => handleStageChange(idx as 0 | 1 | 2)}
              type="button"
              className={cn(
                "relative z-10 flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-[var(--radius-xs)] text-xs font-mono transition-colors whitespace-nowrap cursor-pointer",
                isActive
                  ? "text-[var(--fg)] font-bold shadow-xs"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              )}
            >
              <span className="text-[10px] text-[var(--accent)]">{`${tab.code} //`}</span>
              <span>{tab.label}</span>

              {isActive && (
                <motion.div
                  layoutId="stage-console-active-pill"
                  className="absolute inset-0 bg-[var(--surface)] border border-[var(--border-strong)] rounded-[var(--radius-xs)] -z-10 shadow-xs"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 阶段工作台主面板（方向感知滑动） */}
      <div className="overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={activeStage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xs"
          >
          {/* 面板头部 */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[var(--border)]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[var(--accent)] tracking-wider">
                  {`${stageTabs[activeStage].code} //`}
                </span>
                <Badge variant={activeStage === 2 ? "active" : "success"} className="text-[10px]">
                  {stageTabs[activeStage].status}
                </Badge>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--fg)] tracking-tight">
                {currentModule.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <StageIndicator active={activeStage + 1} total={3} label={stageTabs[activeStage].label} />
            </div>
          </div>

          {/* 阶段核心目标 */}
          <div className="mb-6 p-4 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/60 border border-[var(--border)] text-sm leading-relaxed">
            <span className="font-mono text-xs font-bold text-[var(--accent)] block mb-1">
              STAGE OBJECTIVE // 阶段核心目标
            </span>
            <p className="text-[var(--fg)]">{currentModule.objective}</p>
          </div>

          {/* 双列布局：左侧实训交付与审查标准，右侧知识考点与路线要点 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 左列：必做实验交付与代码审查标准 */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)] space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--fg)]">
                  <FlaskConical className="h-4 w-4 text-[var(--accent)]" />
                  <span>阶段综合实验与交付物</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed pl-6 border-l-2 border-[var(--accent)]">
                  {currentModule.experiment}
                </p>
              </div>

              <div className="p-5 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)] space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--fg)]">
                  <ShieldCheck className="h-4 w-4 text-[var(--success)]" />
                  <span>代码审查与结项答辩标准</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed pl-6 border-l-2 border-[var(--success)]">
                  {currentModule.reviewStandard}
                </p>
              </div>
            </div>

            {/* 右列：阶梯知识模块与成长要点 */}
            <div className="lg:col-span-6 space-y-4">
              {/* 大三阶段增加就业/考研双通道切换 */}
              {activeStage === 2 && (
                <div className="flex items-center gap-2 p-1 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setJuniorChannel("employment")}
                    className={cn(
                      "flex-1 py-1.5 px-3 rounded text-xs font-mono flex items-center justify-center gap-1.5 transition-colors",
                      juniorChannel === "employment"
                        ? "bg-[var(--surface)] text-[var(--fg)] font-bold shadow-xs border border-[var(--border)]"
                        : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    )}
                  >
                    <BriefcaseIcon className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>就业通道 · 实习交付</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setJuniorChannel("postgrad")}
                    className={cn(
                      "flex-1 py-1.5 px-3 rounded text-xs font-mono flex items-center justify-center gap-1.5 transition-colors",
                      juniorChannel === "postgrad"
                        ? "bg-[var(--surface)] text-[var(--fg)] font-bold shadow-xs border border-[var(--border)]"
                        : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    )}
                  >
                    <GraduationCap className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>升学通道 · 408考研科研</span>
                  </button>
                </div>
              )}

              <div className="p-5 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)] space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--fg)]">
                  <Code2 className="h-4 w-4 text-[var(--accent)]" />
                  <span>核心实训知识模块与执行要点</span>
                </div>

                <ul className="space-y-2.5 pt-1">
                  {(currentModule.coreTopics.length > 0
                    ? currentModule.coreTopics
                    : currentRoadmap.items
                  ).map((topic: string, i: number) => (
                    <li
                      key={topic}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed group"
                    >
                      <span className="font-mono text-[11px] font-bold text-[var(--accent)] shrink-0 mt-0.5">
                        {`0${i + 1} //`}
                      </span>
                      <span className="group-hover:text-[var(--fg)] transition-colors">
                        {topic}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  );
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
