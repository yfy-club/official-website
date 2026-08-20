"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Code2,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  Users2,
} from "lucide-react";
import { useState } from "react";

import { CardCorners, CardFrame } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "报名与宣讲",
    icon: FileSpreadsheet,
    desc: "提交线上报名问卷，参加秋季招新宣讲会，全面了解社团方向与带学体系。",
    tag: "ORIENTATION",
  },
  {
    step: "02",
    title: "笔试考核",
    icon: Code2,
    desc: "开展基础编程思维与 C/C++ 基础考核，检验学习主动性与自学能力。",
    tag: "EVALUATION",
  },
  {
    step: "03",
    title: "技术面试",
    icon: Users2,
    desc: "与指导教师及各方向技术骨干双向沟通，评估动手潜力与工程意愿。",
    tag: "INTERVIEW",
  },
  {
    step: "04",
    title: "课设实操验收",
    icon: CheckCircle2,
    desc: "完成阶段大作业与基础工程实操任务，由师傅逐行 Code Review 纠偏指导。",
    tag: "PRACTICE",
  },
  {
    step: "05",
    title: "导师配对",
    icon: GraduationCap,
    desc: "通过考核正式入社，一对一配对高年级骨干师傅，制定专属阶段带学路线。",
    tag: "MENTORSHIP",
  },
  {
    step: "06",
    title: "综合转正分流",
    icon: Sparkles,
    desc: "阶段考核通过后正式入驻科技园专属工位，参与真实研发项目与竞赛梯队。",
    tag: "OFFICIAL",
  },
] as const;

export function JoinProcessStepper({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className={cn("join-process-stepper relative", className)}>
      {/* 桌面端 3 列 × 2 行工业电路回路网格 */}
      <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0">
        {PROCESS_STEPS.map((item, idx) => {
          const Icon = item.icon;
          const isHovered = hoveredIdx === idx;
          const isLast = idx === PROCESS_STEPS.length - 1;
          const isRowEnd = idx === 2; // 第 1 排末尾 (03)
          const isRowStart = idx === 3; // 第 2 排开头 (04)

          return (
            <motion.li
              key={item.step}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative flex flex-col justify-between"
            >
              <CardFrame
                className={cn(
                  "h-full flex flex-col justify-between border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-200 shadow-xs",
                  isHovered ? "border-[var(--accent)] shadow-md" : "hover:border-[var(--border-strong)]"
                )}
              >
                <CardCorners />

                <div>
                  {/* 模块头部：等宽标号、标题与阶段芯片 */}
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-mono text-xs font-bold transition-colors",
                          isHovered ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"
                        )}
                      >
                        {`${item.step} //`}
                      </span>
                      <h3 className="text-base font-bold text-[var(--fg)] tracking-tight m-0">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--fg-muted)] bg-[var(--surface-2)] px-2 py-0.5 rounded-[var(--radius-xs)] border border-[var(--border)] shrink-0">
                      <Icon
                        className={cn(
                          "w-3 h-3 transition-colors",
                          isHovered ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"
                        )}
                        aria-hidden="true"
                      />
                      <span>{item.tag}</span>
                    </div>
                  </div>

                  {/* 阶段描述 */}
                  <p className="mt-3.5 text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed m-0">
                    {item.desc}
                  </p>
                </div>

                {/* 底部端口与导轨状态 */}
                <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between font-mono text-[11px] text-[var(--fg-faint)]">
                  <span>STAGE {item.step} / 06</span>
                  {isLast ? (
                    <span className="text-[var(--success)] font-semibold flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                      TERMINAL
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[var(--fg-faint)] group-hover:text-[var(--accent)]">
                      NODE {item.step}
                    </span>
                  )}
                </div>
              </CardFrame>

              {/* ── 桌面端横向电路连接器 (01 ➔ 02, 02 ➔ 03, 04 ➔ 05, 05 ➔ 06) ── */}
              {idx !== 2 && idx !== 5 && (
                <div
                  className="hidden lg:flex absolute top-1/2 -right-5 -translate-y-1/2 z-10 items-center justify-center pointer-events-none w-5"
                  aria-hidden="true"
                >
                  <div className="h-[1px] w-full bg-[var(--border-control)] relative">
                    <ArrowRight
                      size={10}
                      className={cn(
                        "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 transition-colors",
                        isHovered ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"
                      )}
                    />
                  </div>
                </div>
              )}

              {/* ── 桌面端 03 ➔ 04 跨排直角折线过桥回路指示 ── */}
              {isRowEnd && (
                <div
                  className="hidden lg:flex absolute -bottom-5 right-1/2 translate-x-1/2 z-10 items-center justify-center pointer-events-none h-5"
                  aria-hidden="true"
                >
                  <div className="w-[1px] h-full bg-[var(--border-control)] relative">
                    <ArrowDown
                      size={10}
                      className={cn(
                        "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 transition-colors",
                        isHovered ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"
                      )}
                    />
                  </div>
                </div>
              )}
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
