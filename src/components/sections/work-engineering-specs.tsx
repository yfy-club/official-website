import { Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricItem {
  label: string;
  value: string;
  description?: string;
}

interface WorkEngineeringSpecsProps {
  metrics: MetricItem[];
}

export function WorkEngineeringSpecs({ metrics }: WorkEngineeringSpecsProps) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-reveal="group">
      {metrics.map((metric, idx) => (
        <Card
          key={metric.label}
          corners
          variant="frame"
          className="relative flex flex-col justify-between overflow-hidden border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all shadow-xs p-5"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="font-mono text-xs font-semibold text-[var(--accent)] tracking-wider">
              0{idx + 1} {"//"} SPEC
            </span>
            <Activity className="h-3.5 w-3.5 text-[var(--fg-faint)]" aria-hidden="true" />
          </div>

          <div className="my-2">
            <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--fg)] tracking-tight leading-tight">
              {metric.value}
            </div>
            <div className="text-xs font-mono font-medium text-[var(--fg-muted)] mt-1.5 uppercase tracking-wider">
              {metric.label}
            </div>
          </div>

          {metric.description && (
            <p className="text-xs text-[var(--fg-muted)] leading-relaxed mt-3 pt-3 border-t border-[var(--border)] font-normal">
              {metric.description}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
