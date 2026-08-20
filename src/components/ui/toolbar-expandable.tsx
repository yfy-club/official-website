"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ToolbarStep {
  id: string;
  title: string;
  tag?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  content: ReactNode;
}

export interface ToolbarExpandableProps {
  steps: ToolbarStep[];
  badgeText?: string;
  className?: string;
  defaultActiveStep?: string;
}

// Native ResizeObserver measure hook
function useMeasure(): [(node: HTMLElement | null) => void, { height: number }] {
  const [bounds, setBounds] = useState({ height: 0 });
  const [node, setNode] = useState<HTMLElement | null>(null);
  const observer = useRef<ResizeObserver | null>(null);

  const ref = useCallback((newNode: HTMLElement | null) => {
    setNode(newNode);
  }, []);

  useEffect(() => {
    if (!node) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect) {
        setBounds({ height: entry.contentRect.height });
      }
    });

    observer.current.observe(node);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [node]);

  return [ref, bounds];
}

export function ToolbarExpandable({
  steps,
  badgeText,
  className,
  defaultActiveStep,
}: ToolbarExpandableProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeStepId, setActiveStepId] = useState<string | null>(
    defaultActiveStep ?? (steps[0]?.id ?? null)
  );
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const [contentRef, { height }] = useMeasure();

  const activeStep = useMemo(
    () => steps.find((s) => s.id === activeStepId),
    [steps, activeStepId]
  );

  const handleToggleStep = (stepId: string) => {
    if (activeStepId === stepId && isOpen) {
      setIsOpen(false);
    } else {
      setActiveStepId(stepId);
      setIsOpen(true);
    }
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Shell with Theme Tokens */}
      <div className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden backdrop-blur-md">
        {/* Expandable Inspector Body */}
        <AnimatePresence initial={false}>
          {isOpen && activeStep && (
            <motion.div
              key="expanded-content"
              initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={{ height: height || "auto", opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="overflow-hidden border-b border-[var(--border)]/70 bg-[var(--surface-2)]/30"
            >
              <div ref={contentRef} className="p-5 sm:p-6 md:p-7 space-y-4">
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--border)]/50">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-[var(--accent)] font-bold">
                      DECISION 0{steps.findIndex((s) => s.id === activeStep.id) + 1}
                    </span>
                    {activeStep.tag && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface)] text-[var(--fg-muted)] border border-[var(--border)]">
                        {activeStep.tag}
                      </span>
                    )}
                  </div>

                  {badgeText && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--fg-faint)]">
                      {badgeText}
                    </span>
                  )}
                </div>

                {/* Main Content */}
                <div className="space-y-3">{activeStep.content}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Horizontal Step Selector Bar */}
        <div className="flex items-center gap-1.5 p-2 sm:p-2.5 overflow-x-auto scrollbar-none bg-[var(--surface-2)]/50">
          {steps.map((step, idx) => {
            const isActive = activeStepId === step.id && isOpen;
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleToggleStep(step.id)}
                className={cn(
                  "relative z-10 flex items-center gap-2 px-3.5 py-2 rounded-[var(--radius-xs)] text-xs font-mono whitespace-nowrap transition-all shrink-0",
                  isActive
                    ? "bg-[var(--surface)] text-[var(--fg)] font-semibold shadow-xs border border-[var(--border-strong)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)] border border-transparent"
                )}
              >
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-[var(--radius-xs)] text-[10px] font-bold border transition-colors",
                    isActive
                      ? "bg-[var(--accent)] text-black border-[var(--accent)]"
                      : "bg-[var(--surface-2)] text-[var(--fg-muted)] border-[var(--border)]"
                  )}
                >
                  {Icon ? <Icon className="h-3 w-3" /> : `0${idx + 1}`}
                </div>

                <span className="truncate max-w-[140px] sm:max-w-none">{step.title}</span>

                {isActive && (
                  <ChevronRight className="h-3 w-3 text-[var(--accent)] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
