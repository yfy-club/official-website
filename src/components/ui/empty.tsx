import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface EmptyProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Empty({ className, ...props }: EmptyProps) {
  return (
    <div
      className={cn(
        "empty-state flex flex-col items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-[var(--border-strong)] bg-[var(--surface)]/40 p-8 text-center",
        className
      )}
      {...props}
    />
  );
}

export function EmptyHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("empty-state__header flex flex-col items-center gap-2", className)} {...props} />;
}

export function EmptyMedia({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: "default" | "icon" }) {
  return (
    <div
      className={cn(
        "empty-state__media flex items-center justify-center text-[var(--fg-faint)]",
        variant === "icon" && "h-10 w-10 rounded-full border border-[var(--border)] bg-[var(--surface-2)]",
        className
      )}
      {...props}
    />
  );
}

export function EmptyTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn("empty-state__title font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]", className)} {...props} />;
}

export function EmptyDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("empty-state__description max-w-sm font-sans text-xs text-[var(--fg-faint)] leading-relaxed", className)} {...props} />;
}

export function EmptyContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("empty-state__content mt-4", className)} {...props} />;
}
