"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import type { WorkMetric } from "@/content/schema";

interface WorkEngineeringSpecsProps {
  metrics?: WorkMetric[];
}

const STATUS_LABELS: Record<string, string> = {
  verified: "测试覆盖",
  realtime: "实时通道",
  benchmark: "运行边界",
  hardened: "工程约束",
};

export function WorkEngineeringSpecs({ metrics }: WorkEngineeringSpecsProps) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="spec-ruler" data-reveal="group">
      <div className="spec-ruler__axis" aria-hidden="true">
        {Array.from({ length: 25 }, (_, index) => <i key={index} />)}
      </div>
      <div className="spec-ruler__rows">
        {metrics.map((metric, index) => {
          const isOpen = activeIndex === index;
          const panelId = `spec-reading-${index}`;
          return (
            <motion.div
              layout={!reduceMotion}
              key={metric.label}
              className="spec-reading"
              data-open={isOpen || undefined}
            >
              <button
                type="button"
                className="spec-reading__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setActiveIndex(isOpen ? null : index)}
              >
                <span className="spec-reading__index tabular">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="spec-reading__label">
                  <span className="caps">{metric.tag ?? "工程读数"}</span>
                  <span>{metric.label}</span>
                </span>
                <strong className="spec-reading__value tabular">{metric.value}</strong>
                <span className="spec-reading__state">
                  {STATUS_LABELS[metric.status ?? "verified"] ?? "实现确认"}
                </span>
                <ChevronDown size={16} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && metric.description && (
                  <motion.div
                    id={panelId}
                    className="spec-reading__detail"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    transition={{ duration: reduceMotion ? 0.01 : 0.18 }}
                  >
                    <span className="caps">读数口径</span>
                    <p>{metric.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
