"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  Users2,
} from "lucide-react";
import { useState } from "react";

import { CutoutCard } from "@/components/ui/cutout-card";
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
    title: "导师配对",
    icon: GraduationCap,
    desc: "通过考核正式入社，一对一配对高年级骨干师傅，制定专属阶段带学路线。",
    tag: "MENTORSHIP",
  },
  {
    step: "05",
    title: "课设实操验收",
    icon: CheckCircle2,
    desc: "完成阶段大作业与基础工程实操任务，由师傅逐行 Code Review 纠偏指导。",
    tag: "PRACTICE",
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
    <div className={cn("join-process-stepper space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROCESS_STEPS.map((item, idx) => {
          const Icon = item.icon;
          const isHovered = hoveredIdx === idx;

          return (
            <motion.div
              key={item.step}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative flex flex-col justify-between"
            >
              <CutoutCard
                className={cn(
                  "h-full flex flex-col justify-between p-5 transition-all duration-200",
                  isHovered && "border-[var(--accent)] shadow-xs"
                )}
              >
                <div>
                  {/* 卡片头部：编号、图标与阶段标签 */}
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--accent)]">
                        {`${item.step} //`}
                      </span>
                      <h3 className="text-base font-bold text-[var(--fg)] tracking-tight">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--fg-muted)] bg-[var(--surface-2)] px-2 py-0.5 rounded-[var(--radius-xs)] border border-[var(--border)]">
                      <Icon className="w-3 h-3 text-[var(--accent)]" aria-hidden="true" />
                      <span>{item.tag}</span>
                    </div>
                  </div>

                  {/* 阶段描述 */}
                  <p className="mt-3 text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed m-0">
                    {item.desc}
                  </p>
                </div>

                {/* 底部微型导轨指示 */}
                <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between font-mono text-[11px] text-[var(--fg-muted)]">
                  <span>STAGE {idx + 1} OF 6</span>
                  {idx < 5 && (
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                  )}
                </div>
              </CutoutCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
