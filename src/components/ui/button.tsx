import * as Slot from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";

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
      className={`button button--${variant} button--${size} ${className}`.trim()}
      {...props}
    />
  );
}
