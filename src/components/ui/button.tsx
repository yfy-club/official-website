import * as Slot from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  size?: "sm" | "md";
  variant?: "primary" | "accent" | "ghost" | "link";
};

export function Button({
  asChild = false,
  className = "",
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Slot : "button";
  return (
    <Comp
      className={cn(
        "button",
        `button--${variant}`,
        `button--${size}`,
        "rounded-[var(--radius-xs)] font-mono text-xs font-semibold tracking-wide transition-all active:scale-[0.98] cursor-pointer",
        className
      )}
      {...props}
    />
  );
}
