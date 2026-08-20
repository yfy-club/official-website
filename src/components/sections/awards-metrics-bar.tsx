"use client";

import { CardFrame, CardPanel } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { club } from "@/content";

export function AwardsMetricsBar({ certCount = 9 }: { certCount?: number }) {
  const metrics = [
    {
      code: "METRIC-01 //",
      value: Number(club.annualAwards) || 10,
      suffix: "+",
      label: "省级及以上年均成果",
      detail: "持续多届立项与竞赛攻坚",
    },
    {
      code: "METRIC-02 //",
      value: 1,
      suffix: " 项",
      label: "iCAN 全国总决赛一等奖",
      detail: "AI 视觉挑战赛国家级一等奖",
    },
    {
      code: "METRIC-03 //",
      value: certCount,
      suffix: " 份",
      label: "已脱敏官方证书存档",
      detail: "官方发证凭证与图样可查",
    },
    {
      code: "METRIC-04 //",
      value: 7,
      suffix: "+ 项",
      label: "主流赛道全面覆盖",
      detail: "算法 · 创新 · 智能车 · 建模",
    },
  ];

  return (
    <CardFrame className="awards-metrics mb-12 overflow-hidden border-[var(--border)] bg-[var(--surface)] shadow-2xs">
      <CardPanel className="p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
          {metrics.map((metric) => (
            <div
              key={metric.code}
              className="p-5 flex flex-col justify-between hover:bg-[var(--surface-2)]/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-[var(--accent)] font-bold tracking-wider">
                  {metric.code}
                </span>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-[var(--fg)] tracking-tight mb-1 tabular">
                  <NumberTicker value={metric.value} />
                  <span className="text-base sm:text-lg font-normal text-[var(--fg-muted)] ml-0.5">
                    {metric.suffix}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--fg)] mb-1 font-sans">
                  {metric.label}
                </div>
                <div className="text-[11px] text-[var(--fg-muted)] font-sans line-clamp-1">
                  {metric.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardPanel>
    </CardFrame>
  );
}
