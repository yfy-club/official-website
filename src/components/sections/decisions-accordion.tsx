"use client";

import { AlertCircle, CheckCircle2, Code2, Scale, Zap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CardFrame, CardFrameHeader, CardFrameTitle, CardPanel } from "@/components/ui/card";
import type { WorkDecision } from "@/content/schema";

type DecisionsAccordionProps = {
  decisions: WorkDecision[];
};

export function DecisionsAccordion({ decisions }: DecisionsAccordionProps) {
  return (
    <CardFrame className="decisions-frame my-6 border-[var(--border)] bg-[var(--surface)] shadow-xs">
      <CardFrameHeader className="py-3 px-4 sm:px-5 border-b border-[var(--border)] bg-[var(--surface-2)]/40 flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          <CardFrameTitle className="text-xs">
            05 // ARCHITECTURAL DECISIONS & HARDENED HIGHLIGHTS
          </CardFrameTitle>
        </div>
        <Badge variant="outline" className="font-mono text-[10px] py-0.5 px-2">
          {decisions.length} DECISIONS
        </Badge>
      </CardFrameHeader>

      <CardPanel className="p-2 sm:p-4">
        <Accordion type="multiple" defaultValue={[decisions[0]?.what ?? ""]} className="w-full">
          {decisions.map((decision, index) => (
            <AccordionItem
              key={decision.what}
              value={decision.what}
              className="border-b border-[var(--border)] last:border-0 px-2 sm:px-3 py-1"
            >
              <AccordionTrigger className="hover:no-underline py-3.5 group text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-left w-full pr-2">
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="font-mono text-xs font-bold text-[var(--accent)] tabular">
                      0{index + 1}
                    </span>
                    {decision.tag && (
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--fg-muted)] group-hover:border-[var(--accent)]/40 transition-colors">
                        {decision.tag}
                      </span>
                    )}
                  </div>
                  <span className="font-sans text-sm font-medium text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                    {decision.what}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="text-xs sm:text-sm text-[var(--fg-muted)] pl-2 sm:pl-7 leading-relaxed">
                {/* Rich Problem-Solution-Tradeoff structure if fields exist */}
                {decision.problem || decision.solution || decision.impact ? (
                  <div className="space-y-3 pt-1 pb-3">
                    {/* Problem / Context */}
                    {decision.problem && (
                      <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/30 border border-[var(--border)]/60">
                        <AlertCircle className="h-4 w-4 text-[var(--warn)] shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--warn)] font-semibold">
                            CONTEXT & CHALLENGE // 架构痛点
                          </p>
                          <p className="font-sans text-xs text-[var(--fg-muted)] leading-relaxed">
                            {decision.problem}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Solution */}
                    {decision.solution && (
                      <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/50 border border-[var(--border)]">
                        <Zap className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] font-semibold">
                            ARCHITECTURAL SOLUTION // 核心解法
                          </p>
                          <p className="font-sans text-xs text-[var(--fg)] leading-relaxed">
                            {decision.solution}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Impact & Trade-off */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {decision.impact && (
                        <div className="flex items-start gap-2 p-2.5 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/20 border border-[var(--border)]/50">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-mono text-[10px] uppercase text-[var(--success)] font-semibold">
                              QUANTIFIABLE IMPACT // 工程收益
                            </span>
                            <p className="font-sans text-xs text-[var(--fg-muted)] leading-relaxed">
                              {decision.impact}
                            </p>
                          </div>
                        </div>
                      )}

                      {decision.tradeoff && (
                        <div className="flex items-start gap-2 p-2.5 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/20 border border-[var(--border)]/50">
                          <Scale className="h-3.5 w-3.5 text-[var(--fg-faint)] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-mono text-[10px] uppercase text-[var(--fg-faint)] font-semibold">
                              TRADE-OFF & CONSTRAINT // 权衡边界
                            </span>
                            <p className="font-sans text-xs text-[var(--fg-muted)] leading-relaxed">
                              {decision.tradeoff}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Technical Highlight Code Chip */}
                    {decision.highlight && (
                      <div className="flex items-center gap-2 p-2 px-3 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[11px] text-[var(--fg)]">
                        <Code2 className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                        <span className="text-[var(--fg-faint)]">SPEC :: </span>
                        <code className="text-[var(--fg)] font-bold">{decision.highlight}</code>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Clean fallback if only why is available */
                  <div className="flex items-start gap-2 pt-1 pb-2">
                    <CheckCircle2 className="h-4 w-4 text-[var(--success)] shrink-0 mt-0.5" />
                    <p>{decision.why}</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardPanel>
    </CardFrame>
  );
}
