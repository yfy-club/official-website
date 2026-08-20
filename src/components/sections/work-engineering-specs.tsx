"use client";

import { Activity, CheckCircle, ShieldCheck, Zap } from "lucide-react";

import { CardFrame, CardPanel } from "@/components/ui/card";
import type { WorkMetric } from "@/content/schema";

interface WorkEngineeringSpecsProps {
  metrics?: WorkMetric[];
}

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: typeof CheckCircle; dotClass: string; textClass: string }
> = {
  verified: {
    label: "VERIFIED",
    icon: ShieldCheck,
    dotClass: "bg-[var(--success)]",
    textClass: "text-[var(--success)]",
  },
  realtime: {
    label: "REALTIME",
    icon: Zap,
    dotClass: "bg-[var(--accent)]",
    textClass: "text-[var(--accent)]",
  },
  benchmark: {
    label: "BENCHMARK",
    icon: Activity,
    dotClass: "bg-[var(--warn)]",
    textClass: "text-[var(--warn)]",
  },
  hardened: {
    label: "HARDENED",
    icon: CheckCircle,
    dotClass: "bg-[var(--success)]",
    textClass: "text-[var(--success)]",
  },
};

export function WorkEngineeringSpecs({ metrics }: WorkEngineeringSpecsProps) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="work-engineering-specs space-y-4" data-reveal="group">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const statusKey = metric.status ?? (idx % 2 === 0 ? "verified" : "hardened");
          const status = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.verified;
          const progressVal = metric.progress ?? 100;

          return (
            <CardFrame
              key={metric.label}
              className="group/spec-card flex flex-col justify-between border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all shadow-xs overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 px-4 py-3 bg-[var(--surface-2)]/35 border-b border-[var(--border)] font-mono text-[10px]">
                <span className="font-bold text-[var(--accent)] tracking-wider">
                  0{idx + 1} {"//"} {metric.tag ?? "SPEC"}
                </span>

                <div className="flex items-center gap-1.5 font-semibold">
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass} animate-pulse`} />
                  <span className={status.textClass}>{status.label}</span>
                </div>
              </div>

              {/* Metric Body */}
              <CardPanel className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3">
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--fg)] tracking-tight tabular leading-tight group-hover/spec-card:text-[var(--accent)] transition-colors">
                    {metric.value}
                  </div>
                  <div className="text-xs font-mono font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                    {metric.label}
                  </div>
                </div>

                {/* Coss-inspired Industrial Meter Gauge */}
                <div className="space-y-1 pt-1" aria-hidden="true">
                  <div className="h-1.5 w-full bg-[var(--surface-2)] rounded-full overflow-hidden border border-[var(--border)]/50">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--success)] rounded-full transition-all duration-700"
                      style={{ width: `${progressVal}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-[9px] text-[var(--fg-faint)]">
                    <span>BASELINE</span>
                    <span>{progressVal}% TOLERANCE</span>
                  </div>
                </div>

                {/* Description */}
                {metric.description && (
                  <p className="text-xs text-[var(--fg-muted)] leading-relaxed pt-2.5 border-t border-[var(--border)]/60 font-sans">
                    {metric.description}
                  </p>
                )}
              </CardPanel>
            </CardFrame>
          );
        })}
      </div>
    </div>
  );
}
