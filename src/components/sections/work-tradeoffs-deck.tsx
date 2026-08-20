"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";

interface TradeoffItem {
  title: string;
  detail: string;
  boundary?: string;
  next?: string;
}

interface WorkTradeoffsDeckProps {
  tradeoffs: TradeoffItem[];
}

export function WorkTradeoffsDeck({ tradeoffs }: WorkTradeoffsDeckProps) {
  const reduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (tradeoffs.length === 0) return null;

  return (
    <div className="evolution-log" data-reveal="group">
      <div className="evolution-log__line" aria-hidden="true" />
      {tradeoffs.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `evolution-note-${index}`;
        return (
          <motion.article
            layout={!reduceMotion}
            key={item.title}
            className="evolution-note"
            data-open={isOpen || undefined}
          >
            <button
              type="button"
              className="evolution-note__trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span className="evolution-note__node tabular">{String(index + 1).padStart(2, "0")}</span>
              <span>
                <span className="caps">一次回看</span>
                <strong>{item.title}</strong>
              </span>
              <ChevronDown size={17} aria-hidden="true" />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  className="evolution-note__body"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
                >
                  <div className="evolution-note__current">
                    <span className="caps">现在坚持</span>
                    <p>{item.detail}</p>
                  </div>
                  {(item.boundary || item.next) && (
                    <div className="evolution-note__shift">
                      {item.boundary && (
                        <div>
                          <span className="caps">清楚的边界</span>
                          <p>{item.boundary}</p>
                        </div>
                      )}
                      {item.next && (
                        <>
                          <ArrowRight size={18} aria-hidden="true" />
                          <div>
                            <span className="caps">下一步</span>
                            <p>{item.next}</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        );
      })}
    </div>
  );
}
