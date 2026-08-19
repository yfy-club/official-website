"use client";

import { NumberTicker } from "@/components/ui/number-ticker";
import { club } from "@/content";

export function AwardsMetricsBar({ certCount = 9 }: { certCount?: number }) {
  const metrics = [
    {
      code: "METRIC 01",
      value: Number(club.annualAwards) || 10,
      suffix: "+",
      label: "省级及以上年均成果",
      detail: "持续多届立项与攻坚突破",
    },
    {
      code: "METRIC 02",
      value: 1,
      suffix: " 项",
      label: "iCAN 全国总决赛一等奖",
      detail: "AI 视觉挑战赛顶级权威殊荣",
    },
    {
      code: "METRIC 03",
      value: certCount,
      suffix: " 份",
      label: "真实已脱敏证书实存",
      detail: "官方发证凭证与图样可查",
    },
    {
      code: "METRIC 04",
      value: 7,
      suffix: "+ 项",
      label: "国家级/省级主流赛道覆盖",
      detail: "算法 / 创新 / 硬件 / 建模",
    },
  ];

  return (
    <section className="mb-12" aria-label="荣誉数据概览">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.code}
            className="flex flex-col justify-between p-5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-colors shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[11px] font-semibold text-[var(--fg-faint)] tracking-wider">
                {metric.code}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            </div>
            <div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[var(--fg)] tracking-tight mb-1">
                <NumberTicker value={metric.value} />
                <span className="text-base sm:text-lg font-normal text-[var(--fg-muted)] ml-0.5">
                  {metric.suffix}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[var(--fg)] mb-1">
                {metric.label}
              </div>
              <div className="text-[11px] text-[var(--fg-muted)]">
                {metric.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
