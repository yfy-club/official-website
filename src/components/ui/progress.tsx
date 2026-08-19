"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function Progress({
  className,
  value = 0,
  ...props
}: ComponentProps<typeof ProgressPrimitive.Root>) {
  const normalizedValue = Math.min(100, Math.max(0, value ?? 0));

  return (
    <ProgressPrimitive.Root
      className={cn("progress", className)}
      data-slot="progress"
      value={normalizedValue}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="progress__indicator"
        data-slot="progress-indicator"
        style={{ transform: `translateX(-${100 - normalizedValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
