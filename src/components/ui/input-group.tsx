import type {
  ComponentPropsWithoutRef,
  HTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function InputGroup({ className, ...props }: InputGroupProps) {
  return (
    <div
      className={cn(
        "input-group relative flex w-full items-stretch [&>.field__control]:rounded-l-none [&>.field__control]:focus:relative [&>.field__control]:focus:z-10",
        className
      )}
      {...props}
    />
  );
}

export interface InputGroupAddonProps extends HTMLAttributes<HTMLDivElement> {
  align?: "inline-start" | "inline-end" | "block-start" | "block-end";
  className?: string;
}

export function InputGroupAddon({
  align = "inline-start",
  className,
  ...props
}: InputGroupAddonProps) {
  return (
    <div
      className={cn(
        "input-group__addon flex h-10 items-center justify-center px-3.5 font-mono text-xs font-semibold tracking-wider text-[var(--fg-muted)] bg-[var(--surface-2)] border border-[var(--border-control)] select-none shrink-0 transition-colors",
        align === "inline-start" && "order-first border-r-0 rounded-l-[var(--radius-xs)]",
        align === "inline-end" && "order-last border-l-0 rounded-r-[var(--radius-xs)]",
        className
      )}
      {...props}
    />
  );
}

export function InputGroupText({ className, ...props }: ComponentPropsWithoutRef<"span">) {
  return <span className={cn("input-group__text font-mono text-xs", className)} {...props} />;
}

export function InputGroupInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "field__control input-group__input h-10 w-full min-w-0 rounded-l-none rounded-r-[var(--radius-xs)] border border-[var(--border-control)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] focus:relative focus:z-10 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function InputGroupTextarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "field__control field__textarea input-group__textarea min-h-[120px] w-full min-w-0 resize-y border-0 bg-transparent p-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg-faint)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
