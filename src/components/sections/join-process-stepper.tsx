"use client";

import { useReducedMotion } from "motion/react";
import { useState } from "react";

import { CardCorners, CardFrame } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "报名与宣讲",
    desc: "提交线上报名问卷，参加秋季招新宣讲会，全面了解社团培养体系与各研发方向。",
  },
  {
    step: "02",
    title: "笔试考核",
    desc: "开展基础编程思维与 C/C++ 基础代码考核，检验自学能力与计算机底层素养。",
  },
  {
    step: "03",
    title: "技术面试",
    desc: "与指导教师及各方向技术骨干面对面沟通，评估工程意愿、团队沟通与动手潜力。",
  },
  {
    step: "04",
    title: "课设实操验收",
    desc: "完成阶段大作业与基础工程实操任务，由高年级骨干师傅逐行 Code Review 纠偏指导。",
  },
  {
    step: "05",
    title: "导师配对",
    desc: "通过实操考核正式入社，一对一配对高年级骨干导师，制定专属进阶学习与研发路线。",
  },
  {
    step: "06",
    title: "综合转正分流",
    desc: "阶段综合评定后正式入驻科技园专属工位，参与工业级真实项目研发与算法竞赛梯队。",
  },
] as const;

export function JoinProcessStepper({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <CardFrame
      className={cn(
        "join-process-stepper border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden",
        className
      )}
    >
      <CardCorners />

      {/* 流程主表头 */}
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 sm:px-6 border-b border-[var(--border)] bg-[var(--surface-2)]/35 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[var(--accent)]">04.1 //</span>
          <span className="font-semibold uppercase tracking-wider text-[var(--fg)]">
            培养与选拔流程
          </span>
        </div>
        <span className="text-[10px] text-[var(--fg-faint)] tabular">
          06 MILESTONES
        </span>
      </div>

      {/* 贯通式垂直折线时间轴清单 */}
      <ol className="divide-y divide-[var(--border)] list-none p-0 m-0">
        {PROCESS_STEPS.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const isDimmed = !shouldReduceMotion && hoveredIdx !== null && !isHovered;
          const isFirst = idx === 0;
          const isLast = idx === PROCESS_STEPS.length - 1;

          return (
            <li
              key={item.step}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={cn(
                "group/step relative flex items-stretch transition-all duration-200",
                isHovered && "bg-[var(--surface-2)]/40",
                isDimmed && "opacity-60"
              )}
            >
              {/* 左侧贯通主干折线与电路节点 */}
              <div
                className="w-14 sm:w-20 flex flex-col items-center justify-center relative shrink-0 border-r border-[var(--border)] bg-[var(--surface-2)]/15"
                aria-hidden="true"
              >
                {/* 贯穿垂直 1px 导轨线 */}
                <div
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2 w-[1px] bg-[var(--border)] transition-colors duration-200",
                    isFirst ? "top-1/2 bottom-0" : isLast ? "top-0 bottom-1/2" : "top-0 bottom-0",
                    isHovered && "bg-[var(--accent)]/60"
                  )}
                />

                {/* 节点圆环徽标 */}
                <div
                  className={cn(
                    "relative z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-center justify-center font-mono text-[10px] sm:text-[11px] font-bold transition-all duration-200 shadow-2xs",
                    isLast
                      ? "border-[var(--success)] text-[var(--success)] bg-[var(--surface)] ring-2 ring-[var(--success)]/20"
                      : isHovered
                        ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)] ring-2 ring-[var(--accent)]/25 scale-105"
                        : "border-[var(--border-control)] text-[var(--fg-faint)] bg-[var(--surface)]"
                  )}
                >
                  {isLast ? "✓" : item.step}
                </div>
              </div>

              {/* 右侧阶段核心内容 */}
              <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-center">
                {/* 阶段名称与编号 */}
                <div className="md:col-span-4 flex items-center gap-3">
                  <span
                    className={cn(
                      "font-mono text-xs font-bold tracking-wider transition-colors shrink-0",
                      isHovered ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"
                    )}
                  >
                    {item.step} {"//"}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--fg)] tracking-tight m-0">
                    {item.title}
                  </h3>
                </div>

                {/* 阶段具体培养与考核说明 */}
                <div className="md:col-span-8">
                  <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed m-0">
                    {item.desc}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* 底部审计元数据栏 */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 sm:px-6 border-t border-[var(--border)] bg-[var(--surface-2)]/25 font-mono text-[11px] text-[var(--fg-faint)]">
        <span>BENCHMARK // RECRUITMENT & INCUBATION PIPELINE</span>
        <span className="tabular">06 STAGES</span>
      </div>
    </CardFrame>
  );
}
