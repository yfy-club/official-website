"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Braces, Check, ChevronDown, Copy, Terminal } from "lucide-react";
import { useState } from "react";

import type { WorkPrinciple } from "@/content/schema";
import { MathFormula } from "@/components/ui/math-formula";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

interface WorkPrincipleWorkbenchProps {
  principles?: WorkPrinciple[];
  fallbackStack?: Record<string, string[]>;
}

const SPRING = { type: "spring" as const, stiffness: 360, damping: 34, mass: 0.8 };

export function WorkPrincipleWorkbench({
  principles,
  fallbackStack,
}: WorkPrincipleWorkbenchProps) {
  const reduceMotion = useReducedMotion();
  const [openCode, setOpenCode] = useState<string | null>(null);
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const items: WorkPrinciple[] =
    principles && principles.length > 0
      ? principles
      : Object.entries(fallbackStack ?? {}).map(([name, tags], index) => ({
          code: `CORE_${String(index + 1).padStart(2, "0")}`,
          name,
          category: "实现切面",
          summary: `${name} 的关键实现与运行边界。`,
          mechanism: `这一层负责 ${name} 的数据结构、执行路径与错误边界。`,
          tags,
        }));

  if (items.length === 0) return null;

  return (
    <div className="kernel-slices" data-reveal="group">
      <div className="kernel-slices__intro">
        <span className="caps">实现切面</span>
        <span className="kernel-slices__count tabular font-mono">
          {String(items.length).padStart(2, "0")} {"//"} SLICES
        </span>
      </div>

      <div className="kernel-slices__list">
        {items.map((item, index) => {
          const isOpen = openCode === item.code;
          const panelId = `kernel-slice-${item.code.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

          return (
            <motion.article
              layout={!reduceMotion}
              key={item.code}
              className="kernel-slice"
              data-open={isOpen || undefined}
              transition={SPRING}
            >
              {isOpen && (
                <motion.div
                  layoutId="kernel-slice-active"
                  className="kernel-slice__active"
                  transition={SPRING}
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                className="kernel-slice__trigger active:scale-[0.99] transition-transform"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenCode(isOpen ? null : item.code)}
              >
                <span className="kernel-slice__index tabular">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="kernel-slice__heading">
                  <span className="caps">{item.category}</span>
                  <strong>{item.name}</strong>
                </span>
                <span className="kernel-slice__summary">{item.summary}</span>
                <span className="kernel-slice__toggle" aria-hidden="true">
                  <ChevronDown size={17} />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    className="kernel-slice__body"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={reduceMotion ? { duration: 0.01 } : { duration: 0.2 }}
                  >
                    <div className="kernel-slice__explanation">
                      <p>{item.mechanism}</p>
                      {item.keyBenefit && (
                        <div className="kernel-slice__proof">
                          <span className="caps">验证结论</span>
                          <strong>{item.keyBenefit}</strong>
                        </div>
                      )}
                      {item.tags.length > 0 && (
                        <ul className="kernel-slice__tags clean-list" aria-label="相关技术">
                          {item.tags.map((tag) => <li key={tag}>{tag}</li>)}
                        </ul>
                      )}
                    </div>

                    {(item.formula || item.codeSnippet) && (
                      <div className="kernel-slice__artifact">
                        <div className="kernel-slice__artifact-head">
                          <span>
                            {item.formula ? <Braces size={14} /> : <Terminal size={14} />}
                            {item.formula ? "递推关系" : "源码摘录"}
                          </span>
                          {item.codeSnippet && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(item.codeSnippet ?? "")}
                              aria-label={`复制${item.name}源码摘录`}
                              className="active:scale-[0.92] transition-transform cursor-pointer"
                            >
                              {isCopied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          )}
                        </div>
                        {item.formula && (
                          <div className="kernel-slice__formula py-2 px-3 rounded-[var(--radius-2xs)] bg-[var(--surface-2)] border border-[var(--border)] overflow-x-auto my-2">
                            <MathFormula formula={item.formula} displayMode={true} />
                          </div>
                        )}
                        {item.codeSnippet && <pre><code>{item.codeSnippet}</code></pre>}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
