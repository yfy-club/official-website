"use client";

import { motion, useReducedMotion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import {
  CardFrame,
  CardFrameAction,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from "@/components/ui/card";
import type { Mechanism } from "@/content";

export function MechanismAccordion({ items }: { items: readonly Mechanism[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mechanism-grid grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const indexStr = item.index || String(idx + 1).padStart(2, "0");

        return (
          <motion.div
            key={item.title}
            className={isLast ? "md:col-span-2" : undefined}
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <CardFrame className="h-full border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all">
              <CardFrameHeader className="pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--accent)]">
                    {`${indexStr} //`}
                  </span>
                  <CardFrameTitle className="text-base sm:text-lg font-bold text-[var(--fg)] tracking-tight">
                    {item.title}
                  </CardFrameTitle>
                </div>
                {item.tag && (
                  <CardFrameAction>
                    <Badge variant="outline" className="font-mono text-[10px] px-2 py-0.5">
                      {item.tag}
                    </Badge>
                  </CardFrameAction>
                )}
              </CardFrameHeader>
              <CardPanel className="p-4 sm:p-5">
                <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed m-0">
                  {item.detail}
                </p>
              </CardPanel>
            </CardFrame>
          </motion.div>
        );
      })}
    </div>
  );
}
