"use client";

import { CheckCircle2, ChevronDown, Code2, FlaskConical, ShieldCheck } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";

import { Badge } from "@/components/ui/badge";
import { CardFrame, CardFrameHeader, CardFrameTitle, CardPanel } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import type { Track } from "@/content/schema";

export function TrackCurriculumAccordion({
  modules,
}: {
  modules: NonNullable<Track["curriculumModules"]>;
}) {
  if (!modules || modules.length === 0) return null;

  return (
    <Accordion.Root
      type="multiple"
      defaultValue={modules.map((m) => m.stage)}
      className="space-y-4"
      data-reveal="group"
    >
      {modules.map((item, index) => (
        <Accordion.Item
          key={item.stage}
          value={item.stage}
          className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs data-[state=open]:border-[var(--border-strong)] transition-colors"
        >
          <Accordion.Header className="flex">
            <Accordion.Trigger className="group flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-[var(--surface-2)]/50 focus-visible:outline-none">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs font-bold text-[var(--accent)] select-none">
                  {item.stage} {"//"}
                </span>
                <span className="text-base sm:text-lg font-bold text-[var(--fg)] tracking-tight">
                  {item.title}
                </span>
                <Badge
                  variant={index === 0 ? "active" : index === 1 ? "warning" : "success"}
                  className="ml-1"
                >
                  {index === 0 ? "FOUNDATION" : index === 1 ? "SPECIALIZATION" : "PRODUCTION & DUAL TRACK"}
                </Badge>
              </div>
              <ChevronDown
                size={18}
                className="text-[var(--fg-muted)] shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                aria-hidden="true"
              />
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content className="border-t border-[var(--border)] p-5 sm:p-6 bg-[var(--surface-2)]/20 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="mb-5">
              <p className="text-sm font-medium text-[var(--fg)] leading-relaxed flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                <span><strong className="text-[var(--fg)]">阶段目标：</strong>{item.objective}</span>
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--fg-faint)] uppercase tracking-wider mb-3">
                <Code2 size={14} className="text-[var(--accent)]" />
                <span>核心知识模块与实训考点</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {item.coreTopics.map((topic, topicIdx) => (
                  <div
                    key={topic}
                    className="flex items-start gap-2.5 p-3 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--fg)]"
                  >
                    <span className="font-mono text-[11px] font-bold text-[var(--accent)] shrink-0 select-none">
                      0{topicIdx + 1}
                    </span>
                    <span className="leading-snug text-[var(--fg-muted)]">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)]">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--accent)] mb-2">
                  <FlaskConical size={14} />
                  <span>必做实验与交付物</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
                  {item.experiment}
                </p>
              </div>

              <div className="p-4 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)]">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--success)] mb-2">
                  <ShieldCheck size={14} />
                  <span>代码审查与验收答辩标准</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
                  {item.reviewStandard}
                </p>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
