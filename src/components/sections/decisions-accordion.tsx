"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, CheckCircle2, ChevronRight, Scale, Wrench } from "lucide-react";
import { useState } from "react";

import type { WorkDecision } from "@/content/schema";

interface DecisionsAccordionProps {
  decisions: WorkDecision[];
}

const SPRING = { type: "spring" as const, stiffness: 360, damping: 34, mass: 0.8 };

export function DecisionsAccordion({ decisions }: DecisionsAccordionProps) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (decisions.length === 0) return null;

  const active = activeIndex === null ? null : decisions[activeIndex];

  return (
    <div className="choice-lens" data-reveal="group">
      <div className="choice-lens__rail" aria-label="架构取舍">
        {decisions.map((decision, index) => {
          const selected = activeIndex === index;
          return (
            <button
              type="button"
              key={decision.what}
              className="choice-lens__choice active:scale-[0.98] transition-transform"
              data-active={selected || undefined}
              aria-pressed={selected}
              onClick={() => setActiveIndex(selected ? null : index)}
            >
              {selected && (
                <motion.span
                  className="choice-lens__marker"
                  layoutId="choice-lens-marker"
                  transition={SPRING}
                  aria-hidden="true"
                />
              )}
              <span className="choice-lens__number tabular">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="choice-lens__label">
                <span className="caps">{decision.tag ?? "技术取舍"}</span>
                <strong>{decision.what}</strong>
              </span>
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <div className="choice-lens__stage" data-empty={!active || undefined}>
        <AnimatePresence mode="wait" initial={false}>
          {active ? (
            <motion.div
              key={active.what}
              className="choice-lens__detail"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
              transition={reduceMotion ? { duration: 0.01 } : { duration: 0.2 }}
            >
              <header>
                <span className="caps">为什么这样选</span>
                <h3>{active.why}</h3>
              </header>
              <div className="choice-lens__path">
                {active.problem && (
                  <div>
                    <ArrowDownRight size={16} aria-hidden="true" />
                    <span className="caps">先遇到</span>
                    <p>{active.problem}</p>
                  </div>
                )}
                {active.solution && (
                  <div>
                    <Wrench size={16} aria-hidden="true" />
                    <span className="caps">于是这样做</span>
                    <p>{active.solution}</p>
                  </div>
                )}
                {active.impact && (
                  <div>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    <span className="caps">得到</span>
                    <p>{active.impact}</p>
                  </div>
                )}
                {active.tradeoff && (
                  <div>
                    <Scale size={16} aria-hidden="true" />
                    <span className="caps">同时接受</span>
                    <p>{active.tradeoff}</p>
                  </div>
                )}
              </div>
              {active.highlight && <code className="choice-lens__signature">{active.highlight}</code>}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="choice-lens__empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="tabular">{String(decisions.length).padStart(2, "0")}</span>
              <p>几次关键取舍，共同守住同一套工程约束。</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
