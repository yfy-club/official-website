"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const CORNER_PATH = "M0 200C155.996 199.961 200.029 156.308 200 0V200H0Z";

interface CutoutCardContextValue {
  hovered: boolean;
  setHovered: (next: boolean) => void;
}

const CutoutCardContext = createContext<CutoutCardContextValue | null>(null);

export function useCutoutCard() {
  const ctx = useContext(CutoutCardContext);
  if (!ctx) {
    throw new Error("useCutoutCard must be used within <CutoutCard>");
  }
  return ctx;
}

export type CutoutCardProps = ComponentProps<typeof motion.div> & {
  hovered?: boolean;
  onHoveredChange?: (hovered: boolean) => void;
  children: ReactNode;
};

export function CutoutCard({
  className,
  hovered: controlledHovered,
  onHoveredChange,
  children,
  ...props
}: CutoutCardProps) {
  const [internalHovered, setInternalHovered] = useState(false);
  const hovered = controlledHovered !== undefined ? controlledHovered : internalHovered;

  const setHoveredStable = useCallback(
    (next: boolean) => {
      if (onHoveredChange) onHoveredChange(next);
      else setInternalHovered(next);
    },
    [onHoveredChange]
  );

  const ctx = useMemo<CutoutCardContextValue>(
    () => ({
      hovered,
      setHovered: setHoveredStable,
    }),
    [hovered, setHoveredStable]
  );

  return (
    <CutoutCardContext.Provider value={ctx}>
      <motion.div
        className={cn(
          "group/cutout relative cursor-pointer overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-5 transition-all shadow-xs hover:border-[var(--border-strong)] hover:shadow-md",
          className
        )}
        onMouseEnter={() => setHoveredStable(true)}
        onMouseLeave={() => setHoveredStable(false)}
        {...props}
      >
        {children}
      </motion.div>
    </CutoutCardContext.Provider>
  );
}

export type CutoutCornerProps = ComponentProps<"svg"> & {
  size?: number;
};

export function CutoutCorner({
  className,
  size = 24,
  viewBox = "0 0 200 200",
  ...props
}: CutoutCornerProps) {
  return (
    <svg
      aria-hidden
      className={cn(className)}
      height={size}
      viewBox={viewBox}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d={CORNER_PATH} fill="currentColor" />
    </svg>
  );
}

export type CutoutCardPinProps = HTMLAttributes<HTMLDivElement>;

export function CutoutCardPin({ className, ...props }: CutoutCardPinProps) {
  return (
    <div
      className={cn("absolute top-0 right-0 z-10", className)}
      {...props}
    />
  );
}

export type CutoutCardContentProps = HTMLAttributes<HTMLDivElement>;

export function CutoutCardContent({ className, ...props }: CutoutCardContentProps) {
  return (
    <div className={cn("space-y-3", className)} {...props} />
  );
}

export function CutoutCardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5", className)} {...props} />;
}

export function CutoutCardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-semibold text-base leading-none tracking-tight", className)} {...props} />;
}

export type CutoutCardActionProps = ComponentProps<typeof motion.div> & {
  revealOnHover?: boolean;
};

export function CutoutCardAction({
  className,
  revealOnHover = true,
  children,
  ...props
}: CutoutCardActionProps) {
  const { hovered } = useCutoutCard();
  const reduceMotion = useReducedMotion();
  const visible = !revealOnHover || hovered;

  return (
    <motion.div
      animate={
        visible
          ? { opacity: 1, transform: "translateY(0px)" }
          : { opacity: 0, transform: "translateY(6px)" }
      }
      className={cn(
        "pt-2 flex items-center justify-between",
        revealOnHover && !visible && "pointer-events-none",
        className
      )}
      transition={
        reduceMotion
          ? { duration: 0.15 }
          : { duration: 0.22, ease: "easeOut" }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
