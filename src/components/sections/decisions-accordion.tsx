"use client";

import { AlertCircle, CheckCircle2, Code2, Scale, Zap } from "lucide-react";

import { ToolbarExpandable, type ToolbarStep } from "@/components/ui/toolbar-expandable";
import type { WorkDecision } from "@/content/schema";

interface DecisionsAccordionProps {
  decisions: WorkDecision[];
}

export function DecisionsAccordion({ decisions }: DecisionsAccordionProps) {
  if (!decisions || decisions.length === 0) return null;

  const steps: ToolbarStep[] = decisions.map((decision, index) => ({
    id: `decision-${index}`,
    title: decision.what,
    tag: decision.tag,
    content: (
      <div className="space-y-4">
        {/* Title & Core Reason */}
        <div className="space-y-1">
          <h4 className="text-base sm:text-lg font-bold tracking-tight text-[var(--fg)]">
            {decision.what}
          </h4>
          {decision.why && (
            <p className="text-xs sm:text-sm text-[var(--fg-muted)] font-sans leading-relaxed">
              {decision.why}
            </p>
          )}
        </div>

        {/* Problem-Solution-Tradeoff Blocks */}
        {decision.problem || decision.solution || decision.impact ? (
          <div className="space-y-3 pt-1">
            {/* Problem / Context */}
            {decision.problem && (
              <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-xs)] bg-[var(--surface)] border border-[var(--border)]">
                <AlertCircle className="h-4 w-4 text-[var(--warn)] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
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
              <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-xs)] bg-[var(--surface)] border border-[var(--border)]">
                <Zap className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
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
                <div className="flex items-start gap-2 p-2.5 rounded-[var(--radius-xs)] bg-[var(--surface)] border border-[var(--border)]">
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
                <div className="flex items-start gap-2 p-2.5 rounded-[var(--radius-xs)] bg-[var(--surface)] border border-[var(--border)]">
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
              <div className="flex items-center gap-2 p-2 px-3 rounded-[var(--radius-xs)] bg-[var(--surface)] border border-[var(--border)] font-mono text-[11px] text-[var(--fg)]">
                <Code2 className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                <span className="text-[var(--fg-faint)]">SPEC :: </span>
                <code className="text-[var(--fg)] font-bold">{decision.highlight}</code>
              </div>
            )}
          </div>
        ) : null}
      </div>
    ),
  }));

  return (
    <div className="decisions-toolbar-section my-4" data-reveal="group">
      <ToolbarExpandable
        steps={steps}
        badgeText={`${decisions.length} ARCHITECTURAL DECISIONS`}
        defaultActiveStep="decision-0"
      />
    </div>
  );
}
