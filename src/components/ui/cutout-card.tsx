import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface CutoutCardProps extends HTMLAttributes<HTMLDivElement> {
  cornerStyle?: "chamfer" | "inset" | "tech";
  hasPins?: boolean;
}

export function CutoutCard({
  className,
  children,
  cornerStyle = "tech",
  hasPins = true,
  ...props
}: CutoutCardProps) {
  return (
    <div
      className={cn(
        "cutout-card relative rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 transition-all duration-200 hover:border-[var(--border-strong)] hover:shadow-xs",
        cornerStyle === "chamfer" && "before:absolute before:top-0 before:left-0 before:w-3 before:h-3 before:border-t-2 before:border-l-2 before:border-[var(--accent)]",
        className
      )}
      {...props}
    >
      {/* 机械十字螺栓紧固印 (Corner Pins) */}
      {hasPins && (
        <>
          <span
            className="pointer-events-none absolute top-1.5 left-2 font-mono text-[9px] font-bold text-[var(--fg-faint)] select-none"
            aria-hidden="true"
          >
            +
          </span>
          <span
            className="pointer-events-none absolute top-1.5 right-2 font-mono text-[9px] font-bold text-[var(--fg-faint)] select-none"
            aria-hidden="true"
          >
            +
          </span>
          <span
            className="pointer-events-none absolute bottom-1.5 left-2 font-mono text-[9px] font-bold text-[var(--fg-faint)] select-none"
            aria-hidden="true"
          >
            +
          </span>
          <span
            className="pointer-events-none absolute bottom-1.5 right-2 font-mono text-[9px] font-bold text-[var(--fg-faint)] select-none"
            aria-hidden="true"
          >
            +
          </span>
        </>
      )}

      {children}
    </div>
  );
}

export function CutoutCardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border)]", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CutoutCardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base sm:text-lg font-bold text-[var(--fg)] tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CutoutCardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pt-3 text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed", className)} {...props}>
      {children}
    </div>
  );
}
