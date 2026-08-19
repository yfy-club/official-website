"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface HoverFeatureCardItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  highlight: string;
  href?: string;
}

export interface HoverFeatureCardsProps {
  items: HoverFeatureCardItem[];
  className?: string;
}

export function HoverFeatureCards({ items, className }: HoverFeatureCardsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col lg:flex-row gap-3 min-h-[380px]">
        {items.map((item) => {
          const isActive = activeId === item.id;

          return (
            <motion.div
              key={item.id}
              layout
              onMouseEnter={() => setActiveId(item.id)}
              onFocus={() => setActiveId(item.id)}
              tabIndex={0}
              role="region"
              aria-label={item.title}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className={cn(
                "relative flex flex-col justify-between p-6 rounded-[var(--radius-sm)] border transition-all duration-300 outline-none cursor-pointer overflow-hidden shadow-xs",
                isActive
                  ? "lg:flex-[2.8] bg-[var(--surface)] border-[var(--border-strong)] ring-1 ring-[var(--accent)]/30"
                  : "lg:flex-1 bg-[var(--surface-2)]/50 border-[var(--border)] opacity-80 hover:opacity-100 hover:bg-[var(--surface)]"
              )}
            >
              {/* Card top metadata */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[11px] font-semibold text-[var(--accent)] tracking-wider">
                    {item.code} {"//"}
                  </span>
                  {isActive && (
                    <Badge variant="active" className="text-[10px]">
                      FOCUS
                    </Badge>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[var(--fg)] tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="font-mono text-xs text-[var(--fg-muted)] mb-3">
                  {item.subtitle}
                </p>

                {/* Expanded content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 pt-1"
                    >
                      <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
                        {item.description}
                      </p>

                      <div>
                        <div className="font-mono text-[10px] uppercase text-[var(--fg-faint)] tracking-wider mb-2">
                          核心突破领域 // DOMAIN TAGS
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--fg)] border border-[var(--border)]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Card Bottom highlight / Link */}
              <div className="pt-4 mt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-[var(--fg-muted)] truncate pr-2">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                  <span className="truncate">{item.highlight}</span>
                </div>

                {item.href && isActive && (
                  <Link
                    href={item.href}
                    className="text-[var(--accent)] font-semibold flex items-center gap-1 hover:underline shrink-0"
                  >
                    <span>详情</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
