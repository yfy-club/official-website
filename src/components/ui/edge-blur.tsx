import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface EdgeBlurProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical" | "left" | "right" | "top" | "bottom";
  intensity?: "sm" | "md" | "lg";
}

export function EdgeBlur({
  direction = "horizontal",
  intensity = "md",
  className,
  ...props
}: EdgeBlurProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10",
        direction === "horizontal" && "inset-y-0 inset-x-0 flex justify-between",
        direction === "vertical" && "inset-x-0 inset-y-0 flex flex-col justify-between",
        direction === "left" && "inset-y-0 left-0",
        direction === "right" && "inset-y-0 right-0",
        direction === "top" && "inset-x-0 top-0",
        direction === "bottom" && "inset-x-0 bottom-0",
        className
      )}
      {...props}
    >
      {(direction === "horizontal" || direction === "left") && (
        <div
          className={cn(
            "h-full bg-gradient-to-r from-[var(--bg)] to-transparent",
            intensity === "sm" && "w-12 sm:w-16",
            intensity === "md" && "w-16 sm:w-28 md:w-36",
            intensity === "lg" && "w-24 sm:w-40 md:w-56"
          )}
        />
      )}

      {(direction === "horizontal" || direction === "right") && (
        <div
          className={cn(
            "h-full bg-gradient-to-l from-[var(--bg)] to-transparent",
            intensity === "sm" && "w-12 sm:w-16",
            intensity === "md" && "w-16 sm:w-28 md:w-36",
            intensity === "lg" && "w-24 sm:w-40 md:w-56"
          )}
        />
      )}

      {(direction === "vertical" || direction === "top") && (
        <div
          className={cn(
            "w-full bg-gradient-to-b from-[var(--bg)] to-transparent",
            intensity === "sm" && "h-12 sm:h-16",
            intensity === "md" && "h-16 sm:h-28 md:h-36",
            intensity === "lg" && "h-24 sm:h-40 md:h-56"
          )}
        />
      )}

      {(direction === "vertical" || direction === "bottom") && (
        <div
          className={cn(
            "w-full bg-gradient-to-t from-[var(--bg)] to-transparent",
            intensity === "sm" && "h-12 sm:h-16",
            intensity === "md" && "h-16 sm:h-28 md:h-36",
            intensity === "lg" && "h-24 sm:h-40 md:h-56"
          )}
        />
      )}
    </div>
  );
}
