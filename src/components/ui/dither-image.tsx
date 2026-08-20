"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface DitherImageProps extends Omit<ImageProps, "className"> {
  className?: string;
  imageClassName?: string;
  enableHoverReveal?: boolean;
}

export function DitherImage({
  className,
  imageClassName,
  enableHoverReveal = true,
  alt,
  ...props
}: DitherImageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "dither-image-frame group relative overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-2)]",
        className
      )}
      onMouseEnter={() => enableHoverReveal && setIsHovered(true)}
      onMouseLeave={() => enableHoverReveal && setIsHovered(false)}
    >
      <Image
        alt={alt}
        sizes={props.sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        className={cn(
          "h-full w-full object-cover transition-all duration-300",
          !isHovered && "grayscale contrast-125 brightness-95",
          isHovered && "grayscale-0 contrast-100 brightness-100 scale-[1.02]",
          imageClassName
        )}
        {...props}
      />

      {/* 半色调/点阵遮罩层 */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300",
          isHovered ? "opacity-0" : "opacity-30"
        )}
        style={{
          backgroundImage: `radial-gradient(circle, var(--fg) 1px, transparent 1px)`,
          backgroundSize: "4px 4px",
        }}
      />
    </div>
  );
}
