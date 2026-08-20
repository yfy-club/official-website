"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════
   概念可视化的公共底座。
   所有 15 个概念图共用同一套外壳：顶栏标签 / 网格底 / 页脚读数条，
   保证「核心拓扑」这一节里每张图的骨架完全一致，只有主体不同。
   ══════════════════════════════════════════════════════════════════ */

export function GridBackdrop({ size = 16 }: { size?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.35] bg-[radial-gradient(var(--border)_1px,transparent_1px)]"
      style={{ backgroundSize: `${size}px ${size}px` }}
    />
  );
}

interface VisualFrameProps {
  /** 顶栏左侧的机器标签，全大写 mono */
  label: string;
  /** 顶栏右侧插槽：模式切换、状态灯、单一控制器 */
  control?: ReactNode;
  /** 页脚读数条：key → value 的等宽数字 */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function VisualFrame({ label, control, footer, children, className }: VisualFrameProps) {
  return (
    <figure
      className={cn(
        "relative m-0 w-full overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)]",
        className,
      )}
    >
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-2)]/40 px-4 py-2.5 sm:px-5">
        <span className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.12em] text-[var(--fg-muted)]">
          <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          {label}
        </span>
        {control}
      </figcaption>

      <div className="relative p-4 sm:p-6">
        <GridBackdrop />
        <div className="relative">{children}</div>
      </div>

      {footer && (
        <div className="border-t border-[var(--border)] bg-[var(--surface-2)]/40 px-4 py-2.5 sm:px-5">
          {footer}
        </div>
      )}
    </figure>
  );
}

/* ── 分段控制器（顶栏唯一允许的模式切换形态） ───────────────────── */

export interface SegOption {
  value: string;
  label: string;
}

export function SegControl({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: SegOption[];
  value: string;
  onChange: (next: string) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex items-center gap-0.5 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)] p-0.5"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "cursor-pointer rounded-[calc(var(--radius-xs)-2px)] px-2.5 py-1 font-mono text-[11px] transition-colors active:scale-[0.97]",
              isActive
                ? "bg-[var(--fg)] font-bold text-[var(--bg)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── 页脚读数条 ─────────────────────────────────────────────────── */

export interface ReadoutItem {
  k: string;
  v: ReactNode;
  tone?: "default" | "accent" | "warn" | "danger" | "success";
}

const TONE_CLASS: Record<NonNullable<ReadoutItem["tone"]>, string> = {
  default: "text-[var(--fg)]",
  accent: "text-[var(--accent)]",
  warn: "text-[var(--warn)]",
  danger: "text-[var(--danger)]",
  success: "text-[var(--success)]",
};

export function Readout({ items }: { items: ReadoutItem[] }) {
  return (
    <dl className="flex flex-wrap items-center gap-x-6 gap-y-1.5 font-mono text-[11px]">
      {items.map((item) => (
        <div key={item.k} className="flex items-center gap-2">
          <dt className="tracking-wide text-[var(--fg-faint)]">{item.k}</dt>
          <dd className={cn("tabular font-bold", TONE_CLASS[item.tone ?? "default"])}>{item.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ── 图例 ──────────────────────────────────────────────────────── */

export function Legend({ items }: { items: { swatch: string; label: string }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[10px] text-[var(--fg-muted)]">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={cn("inline-block h-2 w-2 shrink-0 rounded-[1px]", item.swatch)} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

/* ── 水平量条（延迟、权重、占比通用） ──────────────────────────── */

export function Bar({
  ratio,
  tone = "accent",
  className,
}: {
  ratio: number;
  tone?: "accent" | "warn" | "danger" | "muted";
  className?: string;
}) {
  const fill =
    tone === "warn"
      ? "bg-[var(--warn)]"
      : tone === "danger"
        ? "bg-[var(--danger)]"
        : tone === "muted"
          ? "bg-[var(--border-strong)]"
          : "bg-[var(--accent)]";

  const percent = Number(Math.max(0, Math.min(100, ratio * 100)).toFixed(2));

  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)]", className)}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-300 ease-out", fill)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

/* ── 节点盒：拓扑图里反复出现的「一个方块 + 标题 + 明细」 ────────── */

export function NodeBox({
  title,
  meta,
  active,
  tone = "accent",
  children,
  className,
}: {
  title: ReactNode;
  meta?: ReactNode;
  active?: boolean;
  tone?: "accent" | "warn" | "danger";
  children?: ReactNode;
  className?: string;
}) {
  const activeBorder =
    tone === "warn"
      ? "border-[var(--warn)]"
      : tone === "danger"
        ? "border-[var(--danger)]"
        : "border-[var(--accent)]";

  return (
    <div
      className={cn(
        "rounded-[var(--radius-xs)] border bg-[var(--surface)] p-3 transition-all duration-200",
        active
          ? cn(activeBorder, "bg-[var(--surface-2)]")
          : "border-[var(--border)] text-[var(--fg-muted)] opacity-60",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className={cn("font-mono text-[11px] font-bold", active ? "text-[var(--fg)]" : "text-[var(--fg-muted)]")}>
          {title}
        </span>
        {meta && <span className="font-mono text-[10px] text-[var(--fg-faint)]">{meta}</span>}
      </div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}
