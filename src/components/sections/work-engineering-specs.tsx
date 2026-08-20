"use client";

import { Activity, CheckCircle, ShieldCheck, Zap } from "lucide-react";

import {
  CutoutCard,
  CutoutCardAction,
  CutoutCardContent,
  CutoutCardPin,
  CutoutCorner,
} from "@/components/ui/cutout-card";
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
    <div className="work-engineering-specs space-y-4 my-6" data-reveal="group">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const statusKey = metric.status ?? (idx % 2 === 0 ? "verified" : "hardened");
          const status = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.verified;
          const progressVal = metric.progress ?? 100;
          const StatusIcon = status.icon;

          return (
            <CutoutCard
              key={metric.label}
              className="flex flex-col justify-between relative overflow-hidden bg-[var(--surface)] hover:border-[var(--border-strong)]"
            >
              {/* Cutout Top-Right Status Pin */}
              <CutoutCardPin className="top-0 right-0 rounded-bl-[14px] bg-[var(--surface-2)] border-b border-l border-[var(--border)] px-3 py-1.5 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass} animate-pulse`} />
                <span className={`font-mono text-[9px] font-bold tracking-wider ${status.textClass}`}>
                  {status.label}
                </span>
                <CutoutCorner className="absolute -left-[20px] top-0 text-[var(--surface-2)]" size={20} />
                <CutoutCorner className="absolute right-0 -bottom-[20px] text-[var(--surface-2)]" size={20} />
              </CutoutCardPin>

              {/* Metric Card Body */}
              <CutoutCardContent className="p-0 space-y-4">
                {/* Index tag */}
                <div className="font-mono text-[10px] text-[var(--accent)] font-bold tracking-wider">
                  0{idx + 1} {"//"} {metric.tag ?? "SPEC"}
                </div>

                {/* Big Metric Value */}
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--fg)] tracking-tight tabular leading-tight group-hover/cutout:text-[var(--accent)] transition-colors">
                    {metric.value}
                  </div>
                  <div className="text-xs font-mono font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                    {metric.label}
                  </div>
                </div>

                {/* Micro Gauge Meter */}
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
              </CutoutCardContent>

              {/* Hover Action Reveal */}
              <CutoutCardAction className="pt-3 border-t border-[var(--border)]/40 mt-3 flex items-center justify-between text-[10px] font-mono text-[var(--fg-muted)]">
                <span className="flex items-center gap-1 text-[var(--accent)]">
                  <StatusIcon className="h-3 w-3" />
                  <span>SPEC CERTIFIED</span>
                </span>
                <span>0{idx + 1} / 0{metrics.length}</span>
              </CutoutCardAction>
            </CutoutCard>
          );
        })}
      </div>
    </div>
  );
}
