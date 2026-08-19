import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface BackgroundImageTextureProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "noise" | "dots" | "grid";
  opacity?: number;
}

export function BackgroundImageTexture({
  variant = "noise",
  opacity = 0.035,
  className,
  ...props
}: BackgroundImageTextureProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-[-1] select-none",
        variant === "noise" && "bg-noise",
        className
      )}
      style={{
        opacity,
        backgroundImage:
          variant === "noise"
            ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            : undefined,
      }}
      {...props}
    />
  );
}
