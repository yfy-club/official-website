"use client";

import { NumberTicker } from "@/components/ui/number-ticker";
import type { Track } from "@/content/schema";

export function TrackMetricsBar({ metrics }: { metrics: NonNullable<Track["metrics"]> }) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <section className="mb-12" aria-label="技术方向核心指标">
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
                {metric.suffix && (
                  <span className="text-base sm:text-lg font-normal text-[var(--fg-muted)] ml-0.5">
                    {metric.suffix}
                  </span>
                )}
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
