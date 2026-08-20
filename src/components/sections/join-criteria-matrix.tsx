"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useState } from "react";

import { CardCorners, CardFrame } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CriteriaDimension = {
  index: string;
  dimension: string;
  suitable: string;
  unsuitable: string;
};

const CRITERIA_DIMENSIONS: readonly CriteriaDimension[] = [
  {
    index: "01",
    dimension: "研发动机",
    suitable: "对计算机技术与编程实践有浓厚兴趣，乐于动手构建实际工程项目",
    unsuitable: "仅寻求挂名履历，缺乏实际投入意愿与时间保障",
  },
  {
    index: "02",
    dimension: "工位时间",
    suitable: "能保证每周 16～22 小时在实验室工位专注投入学习与研发",
    unsuitable: "无法保障基本学习打卡时间，抗拒阶段考核与代码审阅",
  },
  {
    index: "03",
    dimension: "代码追求",
    suitable: "注重代码规范与底层原理，愿意接受日常代码审阅与阶段实操考核",
    unsuitable: "过度依赖 AI 工具盲目生成代码，不求甚解底层原理",
  },
];

export function JoinCriteriaMatrix({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <CardFrame
      className={cn(
        "join-criteria-matrix border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden",
        className
      )}
    >
      <CardCorners />

      {/* 双轨对照表头 */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border)] border-b border-[var(--border)] bg-[var(--surface-2)]/35">
        {/* 左表头：适合加入 */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[var(--success)]">03.1 //</span>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg)]">
              适合加入
            </span>
          </div>
          <span className="font-mono text-[10px] text-[var(--success)] bg-[var(--success)]/10 px-2 py-0.5 rounded-[var(--radius-xs)] border border-[var(--success)]/30 shrink-0">
            STATUS // FIT
          </span>
        </div>

        {/* 右表头：暂不适合 */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[var(--fg-muted)]">03.2 //</span>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
              暂不适合
            </span>
          </div>
          <span className="font-mono text-[10px] text-[var(--fg-muted)] bg-[var(--surface-2)] px-2 py-0.5 rounded-[var(--radius-xs)] border border-[var(--border)] shrink-0">
            STATUS // UNFIT
          </span>
        </div>
      </div>

      {/* 三维双轨对照清单 */}
      <div className="divide-y divide-[var(--border)]">
        {CRITERIA_DIMENSIONS.map((item, idx) => {
          const isHovered = hoveredRow === idx;
          const isDimmed = !shouldReduceMotion && hoveredRow !== null && !isHovered;

          return (
            <div
              key={item.index}
              onMouseEnter={() => setHoveredRow(idx)}
              onMouseLeave={() => setHoveredRow(null)}
              className={cn(
                "group/row relative grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border)] transition-all duration-200",
                isHovered && "bg-[var(--surface-2)]/40",
                isDimmed && "opacity-60"
              )}
            >
              {/* 左侧：适合维度 */}
              <div className="p-5 sm:p-6 flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between font-mono text-xs text-[var(--success)]">
                  <span className="font-semibold tracking-wider">
                    {item.index} // {item.dimension}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5 stroke-[2.2]"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium text-[var(--fg)] leading-relaxed m-0">
                    {item.suitable}
                  </p>
                </div>
              </div>

              {/* 右侧：暂不适合维度 */}
              <div className="p-5 sm:p-6 flex flex-col justify-between gap-3 bg-[var(--surface-2)]/15 md:bg-transparent">
                <div className="flex items-center justify-between font-mono text-xs text-[var(--fg-faint)]">
                  <span className="tracking-wider">
                    {item.index} // 对照
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle
                    className="w-4 h-4 text-[var(--fg-muted)] shrink-0 mt-0.5 stroke-[2]"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-[var(--fg-muted)] leading-relaxed m-0">
                    {item.unsuitable}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部审计元数据栏 */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 sm:px-6 border-t border-[var(--border)] bg-[var(--surface-2)]/25 font-mono text-[11px] text-[var(--fg-faint)]">
        <span>BENCHMARK // YFY-FIT-2026</span>
        <span className="tabular">03 DIMENSIONS</span>
      </div>
    </CardFrame>
  );
}
