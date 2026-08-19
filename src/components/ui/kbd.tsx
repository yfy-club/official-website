import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  className?: string;
}

export function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "kbd inline-flex items-center justify-center rounded-[var(--radius-xs)] border border-[var(--border-strong)] bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[11px] font-medium text-[var(--fg-muted)] select-none shadow-xs",
        className
      )}
      {...props}
    />
  );
}

export interface KbdGroupProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

export function KbdGroup({ className, ...props }: KbdGroupProps) {
  return (
    <span
      className={cn("kbd-group inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}
