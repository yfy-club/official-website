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
  alt,
  ...props
}: DitherImageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "dither-image-frame group relative h-full w-full overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] shadow-xs",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        alt={alt}
        sizes={props.sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        className={cn(
          "h-full w-full object-cover transition-transform duration-300",
          isHovered ? "scale-[1.02]" : "scale-100",
          imageClassName
        )}
        {...props}
      />
    </div>
  );
}
