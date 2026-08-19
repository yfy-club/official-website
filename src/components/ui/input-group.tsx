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
        "input-group relative flex w-full items-center rounded-[var(--radius-xs)] border border-[var(--border-control)] bg-[var(--surface)] transition-colors focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)] [&>.field__control]:border-0 [&>.field__control]:bg-transparent [&>.field__control]:rounded-none [&>.field__control]:focus:outline-none [&>.field__control]:focus:ring-0",
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
        "input-group__addon flex items-center px-2.5 font-mono text-xs text-[var(--fg-faint)] select-none shrink-0",
        align === "inline-start" && "order-first border-r border-[var(--border)]",
        align === "inline-end" && "order-last border-l border-[var(--border)]",
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
        "field__control input-group__input h-10 w-full min-w-0 border-0 bg-transparent px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-faint)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
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
