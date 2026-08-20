"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ChevronDown,
  Cpu,
  Database,
  Layers,
  Network,
  Play,
  RotateCcw,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";

import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardHeader,
  ExpandableContent,
} from "@/components/ui/expandable";
import { TechTag } from "@/components/ui/tech-tag";
import type { WorkArchitecture } from "@/content/schema";

interface WorkArchitectureStackProps {
  stack: Record<string, string[]>;
  architecture?: WorkArchitecture;
}

const TIER_ICONS = [Layers, Network, Cpu, Database];

export function WorkArchitectureStack({ stack, architecture }: WorkArchitectureStackProps) {
  const shouldReduceMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<"expandable" | "dataflow">("expandable");
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlayingFlow, setIsPlayingFlow] = useState<boolean>(false);

  // Fallback tiers if architecture is not explicitly defined in data
  const tiers = architecture?.tiers ?? Object.entries(stack).map(([label, items], idx) => ({
    code: `TIER_0${idx + 1}`,
    name: label,
    role: `负责系统 ${label} 核心功能模块与组件编排`,
    techTags: items,
    features: [`${label} 模块化构建`, "类型安全与工程规范"],
  }));

  const dataflow = architecture?.dataflow ?? [];
  const hasDataflow = dataflow.length > 0;

  // Auto-play dataflow step when in flow mode and playing
  useEffect(() => {
    if (viewMode !== "dataflow" || !isPlayingFlow || dataflow.length === 0) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % dataflow.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [viewMode, isPlayingFlow, dataflow.length]);

  return (
    <div className="work-architecture-stack select-none space-y-4" data-reveal="group">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--fg)]">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="font-semibold uppercase tracking-wider">
            {viewMode === "dataflow" ? "PIPELINE TOPOLOGY" : "EXPANDABLE ARCHITECTURE"}
          </span>
          <span className="text-[var(--fg-faint)]">/</span>
          <span className="text-[var(--fg-muted)]">
            {viewMode === "dataflow" ? `${dataflow.length} STAGES` : `${tiers.length} LAYERS`}
          </span>
        </div>

        {hasDataflow && (
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[var(--surface-2)]/70 border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setViewMode("expandable")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all ${
                viewMode === "expandable"
                  ? "bg-[var(--surface)] text-[var(--fg)] font-semibold shadow-xs border border-[var(--border)]"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              <Layers className="h-3 w-3 text-[var(--accent)]" />
              <span>分层展开</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode("dataflow");
                setActiveStep(0);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all ${
                viewMode === "dataflow"
                  ? "bg-[var(--surface)] text-[var(--fg)] font-semibold shadow-xs border border-[var(--border)]"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              <Zap className="h-3 w-3 text-[var(--accent)]" />
              <span>数据流向</span>
            </button>
          </div>
        )}
      </div>

      {architecture?.summary && (
        <p className="text-xs sm:text-sm text-[var(--fg-muted)] font-sans leading-relaxed">
          {architecture.summary}
        </p>
      )}

      {/* Main View Area */}
      <AnimatePresence mode="wait">
        {viewMode === "expandable" ? (
          /* Expandable Cards Grid */
          <motion.div
            key="expandable-grid"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {tiers.map((tier, idx) => {
              const TierIcon = TIER_ICONS[idx % TIER_ICONS.length] ?? Layers;
              return (
                <Expandable key={tier.code} defaultExpanded={idx === 0}>
                  {({ isExpanded }) => (
                    <ExpandableCard className="h-full">
                      {/* Card Header */}
                      <ExpandableCardHeader>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border transition-colors ${
                                isExpanded
                                  ? "bg-[var(--accent)] text-black border-[var(--accent)]"
                                  : "bg-[var(--surface-2)] text-[var(--accent)] border-[var(--border)]"
                              }`}
                            >
                              <TierIcon className="h-3.5 w-3.5" />
                            </span>
                            <span className="font-sans text-sm font-semibold tracking-tight text-[var(--fg)] truncate">
                              {tier.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--fg-muted)] shrink-0">
                            <span className="font-bold text-[var(--accent)]">0{idx + 1}</span>
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-[var(--accent)]" : ""
                              }`}
                            />
                          </div>
                        </div>

                        {/* Collapsed quick tags */}
                        {!isExpanded && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-2">
                            {tier.techTags.slice(0, 3).map((tech) => (
                              <span
                                key={tech}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-2)] text-[var(--fg-muted)] border border-[var(--border)]/60"
                              >
                                {tech}
                              </span>
                            ))}
                            {tier.techTags.length > 3 && (
                              <span className="text-[10px] font-mono text-[var(--fg-faint)]">
                                +{tier.techTags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </ExpandableCardHeader>

                      {/* Expandable Expanded Content */}
                      <ExpandableContent>
                        <ExpandableCardContent className="space-y-4 pt-2 border-t border-[var(--border)]/60">
                          {/* Role Statement */}
                          <p className="text-xs text-[var(--fg-muted)] leading-relaxed font-sans">
                            {tier.role}
                          </p>

                          {/* Full Interactive TechTags */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--fg-faint)] uppercase">
                              <Sparkles className="h-3 w-3 text-[var(--accent)]" />
                              <span>技术选型</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {tier.techTags.map((tech) => (
                                <TechTag key={tech} name={tech} />
                              ))}
                            </div>
                          </div>

                          {/* Features */}
                          {tier.features && tier.features.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {tier.features.map((feature) => (
                                <span
                                  key={feature}
                                  className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--fg-muted)] border border-[var(--border)]"
                                >
                                  <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
                        </ExpandableCardContent>
                      </ExpandableContent>
                    </ExpandableCard>
                  )}
                </Expandable>
              );
            })}
          </motion.div>
        ) : (
          /* Dataflow Pipeline View */
          <motion.div
            key="dataflow-pipeline"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.22 }}
            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 space-y-6 shadow-xs"
          >
            {/* Header & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--accent)]">
                  <Workflow className="h-4 w-4" />
                  <span>END-TO-END DATAFLOW PIPELINE</span>
                </div>
                <p className="text-xs text-[var(--fg-muted)]">
                  单步点击或自动流动，观察系统从请求触发到持久化广播的全流程
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlayingFlow((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                    isPlayingFlow
                      ? "bg-[var(--accent)] text-black border-[var(--accent)] font-semibold shadow-xs"
                      : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--fg)] hover:bg-[var(--surface-2)]/80"
                  }`}
                >
                  <Play className={`h-3 w-3 ${isPlayingFlow ? "fill-black" : ""}`} />
                  <span>{isPlayingFlow ? "暂停流动" : "自动流动"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStep(0)}
                  className="p-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]/80 transition-colors"
                  aria-label="重置第一步"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Step buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {dataflow.map((flow, idx) => {
                const isCurrent = activeStep === idx;
                const isPassed = activeStep > idx;

                return (
                  <button
                    key={flow.step}
                    type="button"
                    onClick={() => {
                      setActiveStep(idx);
                      setIsPlayingFlow(false);
                    }}
                    className={`relative flex flex-col justify-between p-3.5 rounded-[var(--radius-xs)] border text-left transition-all ${
                      isCurrent
                        ? "bg-[var(--surface-2)] border-[var(--accent)] shadow-sm ring-1 ring-[var(--accent)]/30 -translate-y-0.5"
                        : isPassed
                        ? "bg-[var(--surface-2)]/40 border-[var(--border)]"
                        : "bg-[var(--surface-2)]/20 border-[var(--border)]/60 text-[var(--fg-muted)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1 font-mono text-[10px]">
                        <span className={isCurrent ? "font-bold text-[var(--accent)]" : "text-[var(--fg-faint)]"}>
                          0{idx + 1}
                        </span>
                        {flow.protocol && (
                          <span className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--fg-faint)] truncate max-w-[80px]">
                            {flow.protocol}
                          </span>
                        )}
                      </div>

                      <h4 className={`font-sans text-xs font-semibold ${isCurrent ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}`}>
                        {flow.title}
                      </h4>
                    </div>

                    <div className="pt-2 mt-2 border-t border-[var(--border)]/40 flex items-center justify-between font-mono text-[9px]">
                      <span className={isCurrent ? "text-[var(--accent)] font-semibold" : isPassed ? "text-[var(--success)]" : "text-[var(--fg-faint)]"}>
                        {isCurrent ? "ACTIVE" : isPassed ? "DONE" : "STANDBY"}
                      </span>
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isCurrent ? "bg-[var(--accent)] animate-ping" : isPassed ? "bg-[var(--success)]" : "bg-[var(--border-strong)]"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Step detail */}
            {dataflow[activeStep] && (
              <div className="p-4 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-[var(--accent)] font-bold">
                      STAGE 0{activeStep + 1} {"//"} {dataflow[activeStep].title}
                    </span>
                    {dataflow[activeStep].protocol && (
                      <span className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--fg-muted)] text-[10px]">
                        {dataflow[activeStep].protocol}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--fg-muted)] font-sans">
                    {dataflow[activeStep].detail}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                    className="px-2.5 py-1 rounded-[var(--radius-xs)] text-xs font-mono border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors"
                  >
                    前一步
                  </button>
                  <button
                    type="button"
                    disabled={activeStep === dataflow.length - 1}
                    onClick={() => setActiveStep((prev) => Math.min(dataflow.length - 1, prev + 1))}
                    className="px-2.5 py-1 rounded-[var(--radius-xs)] text-xs font-mono border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors"
                  >
                    后一步
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
