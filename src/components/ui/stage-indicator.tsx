import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type StageIndicatorProps = {
  active: number;
  caption?: string;
  className?: string;
  label: string;
  tone?: "accent" | "success" | "warning";
  total?: number;
};

export function StageIndicator({
  active,
  caption,
  className,
  label,
  tone = "accent",
  total = 4,
}: StageIndicatorProps) {
  const normalizedTotal = Math.max(1, total);
  const normalizedActive = Math.min(normalizedTotal, Math.max(0, active));

  return (
    <div
      className={cn("stage-indicator", className)}
      data-tone={tone}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={normalizedTotal}
      aria-valuenow={normalizedActive}
      aria-valuetext={`${label}，第 ${normalizedActive} 阶段，共 ${normalizedTotal} 阶段`}
    >
      <span className="stage-indicator__caption">
        <span>{caption ?? label}</span>
        <span className="tabular">{normalizedActive}/{normalizedTotal}</span>
      </span>
      <span className="stage-indicator__segments" aria-hidden="true">
        {Array.from({ length: normalizedTotal }, (_, index) => (
          <Progress key={index} value={index < normalizedActive ? 100 : 0} aria-hidden="true" />
        ))}
      </span>
    </div>
  );
}
