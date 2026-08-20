"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
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

import { TechTag } from "@/components/ui/tech-tag";
import type { WorkArchitecture } from "@/content/schema";

interface WorkArchitectureStackProps {
  stack: Record<string, string[]>;
  architecture?: WorkArchitecture;
}

const TIER_ICONS = [Layers, Network, Cpu, Database];

export function WorkArchitectureStack({ stack, architecture }: WorkArchitectureStackProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<number | "dataflow">(0);
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
    if (activeTab !== "dataflow" || !isPlayingFlow || dataflow.length === 0) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % dataflow.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [activeTab, isPlayingFlow, dataflow.length]);

  const currentTier = typeof activeTab === "number" ? tiers[activeTab] : tiers[0];
  const CurrentIcon = typeof activeTab === "number" ? (TIER_ICONS[activeTab % TIER_ICONS.length] ?? Layers) : Workflow;

  return (
    <div className="work-architecture-stack select-none" data-reveal="group">
      {/* Immersive Cockpit Shell */}
      <div className="relative rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden backdrop-blur-md">
        {/* Subtle Ambient Blueprint Grid Background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(var(--fg) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
          aria-hidden="true"
        />

        {/* Top Control Bar with Smooth Gliding Pill Navigation */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 border-b border-[var(--border)] bg-[var(--surface-2)]/40">
          {/* Status Capsule */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
            </span>
            <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[var(--fg-muted)]">
              {activeTab === "dataflow" ? "PIPELINE TOPOLOGY" : `SYSTEM LAYER // 0${(activeTab as number) + 1}`}
            </span>
          </div>

          {/* Level Switcher Capsules */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-[var(--surface)]/90 border border-[var(--border)] shadow-xs">
            {tiers.map((tier, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={tier.code}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                    isActive
                      ? "text-[var(--fg)] font-semibold"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]/60"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="arch-tab-pill"
                      className="absolute inset-0 rounded-full bg-[var(--surface-2)] border border-[var(--border-strong)] shadow-xs -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="text-[10px] text-[var(--accent)] font-bold">0{idx + 1}</span>
                  <span className="truncate max-w-[120px] sm:max-w-none">{tier.name}</span>
                </button>
              );
            })}

            {hasDataflow && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("dataflow");
                  setActiveStep(0);
                }}
                className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                  activeTab === "dataflow"
                    ? "text-[var(--fg)] font-semibold"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]/60"
                }`}
              >
                {activeTab === "dataflow" && (
                  <motion.div
                    layoutId="arch-tab-pill"
                    className="absolute inset-0 rounded-full bg-[var(--surface-2)] border border-[var(--border-strong)] shadow-xs -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <Zap className="h-3 w-3 text-[var(--accent)]" />
                <span>数据流向</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Immersive Workspace */}
        <div className="relative z-10 p-5 sm:p-7 md:p-8 min-h-[340px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {typeof activeTab === "number" ? (
              /* Layer Focus View */
              <motion.div
                key={`tier-${activeTab}`}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Left: Focused Layer Content */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Layer Header */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--accent)]">
                        <CurrentIcon className="h-4 w-4" />
                      </span>
                      <span className="font-mono text-xs font-bold text-[var(--accent)] tracking-wider">
                        {currentTier.code}
                      </span>
                      <span className="text-[var(--fg-faint)]">/</span>
                      <span className="font-mono text-xs text-[var(--fg-muted)]">
                        0{activeTab + 1} OF 0{tiers.length}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--fg)]">
                      {currentTier.name}
                    </h3>

                    <p className="text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed font-sans pt-0.5">
                      {currentTier.role}
                    </p>
                  </div>

                  {/* Tech Artifacts */}
                  <div className="space-y-2 pt-2 border-t border-[var(--border)]/60">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--fg-faint)] uppercase tracking-wider">
                      <Sparkles className="h-3 w-3 text-[var(--accent)]" />
                      <span>技术选型与协议</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentTier.techTags.map((tech) => (
                        <TechTag key={tech} name={tech} />
                      ))}
                    </div>
                  </div>

                  {/* Features Pills */}
                  {currentTier.features && currentTier.features.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {currentTier.features.map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-[var(--surface-2)] text-[var(--fg)] border border-[var(--border)] shadow-2xs"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stepper Navigation */}
                  <div className="flex items-center gap-2 pt-3">
                    <button
                      type="button"
                      disabled={activeTab === 0}
                      onClick={() => setActiveTab((prev) => (prev as number) - 1)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-xs)] text-xs font-mono border border-[var(--border)] bg-[var(--surface-2)]/50 text-[var(--fg)] hover:bg-[var(--surface-2)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      上一层
                    </button>
                    <button
                      type="button"
                      disabled={activeTab === tiers.length - 1}
                      onClick={() => setActiveTab((prev) => (prev as number) + 1)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-xs)] text-xs font-mono border border-[var(--border)] bg-[var(--surface-2)]/50 text-[var(--fg)] hover:bg-[var(--surface-2)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      下一层
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right: Interactive 4-Tier Schematic Radar */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="relative p-5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)]/30 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]/60 font-mono text-[10px] text-[var(--fg-faint)]">
                      <span>LAYER REACTOR TOPOLOGY</span>
                      <span className="text-[var(--accent)] font-semibold">SYNCHRONIZED</span>
                    </div>

                    <div className="space-y-2.5">
                      {tiers.map((t, idx) => {
                        const isCurrent = activeTab === idx;
                        const TierIcon = TIER_ICONS[idx % TIER_ICONS.length] ?? Layers;
                        return (
                          <button
                            key={t.code}
                            type="button"
                            onClick={() => setActiveTab(idx)}
                            className={`w-full flex items-center justify-between p-3 rounded-[var(--radius-xs)] border transition-all text-left ${
                              isCurrent
                                ? "bg-[var(--surface)] border-[var(--accent)] shadow-sm scale-[1.02]"
                                : "bg-[var(--surface-2)]/40 border-[var(--border)]/70 hover:border-[var(--border-strong)] opacity-60 hover:opacity-100"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border transition-colors ${
                                  isCurrent
                                    ? "bg-[var(--accent)] text-black border-[var(--accent)]"
                                    : "bg-[var(--surface)] text-[var(--fg-muted)] border-[var(--border)]"
                                }`}
                              >
                                <TierIcon className="h-3.5 w-3.5" />
                              </span>
                              <span
                                className={`text-xs font-mono font-medium truncate ${
                                  isCurrent ? "text-[var(--fg)] font-semibold" : "text-[var(--fg-muted)]"
                                }`}
                              >
                                0{idx + 1} · {t.name}
                              </span>
                            </div>

                            {isCurrent && (
                              <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--accent)] font-semibold">
                                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                                <span>ACTIVE</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* End-to-End Dataflow Pipeline View */
              <motion.div
                key="dataflow-view"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                className="space-y-6"
              >
                {/* Pipeline Header & Playback Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]/70">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--accent)]">
                      <Workflow className="h-4 w-4" />
                      <span>END-TO-END DATAFLOW PIPELINE</span>
                    </div>
                    <p className="text-xs text-[var(--fg-muted)]">
                      点击节点或启动自动流转，观察数据从输入到持久化广播的全流程
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

                {/* Pipeline Stages Horizontal Flow */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 relative">
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
                        className={`relative flex flex-col justify-between p-4 rounded-[var(--radius-sm)] border text-left transition-all ${
                          isCurrent
                            ? "bg-[var(--surface)] border-[var(--accent)] shadow-md ring-1 ring-[var(--accent)]/30 -translate-y-0.5"
                            : isPassed
                            ? "bg-[var(--surface-2)]/60 border-[var(--border)] text-[var(--fg)]"
                            : "bg-[var(--surface-2)]/20 border-[var(--border)]/60 text-[var(--fg-muted)] hover:border-[var(--border-strong)]"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-1 font-mono text-[10px]">
                            <span
                              className={`font-bold ${
                                isCurrent ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"
                              }`}
                            >
                              0{idx + 1}
                            </span>
                            {flow.protocol && (
                              <span className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--fg-faint)] truncate max-w-[80px]">
                                {flow.protocol}
                              </span>
                            )}
                          </div>

                          <h4
                            className={`font-sans text-sm font-semibold tracking-tight ${
                              isCurrent ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"
                            }`}
                          >
                            {flow.title}
                          </h4>

                          <p className="font-sans text-xs text-[var(--fg-muted)] leading-relaxed line-clamp-2">
                            {flow.detail}
                          </p>
                        </div>

                        {/* Progress indicator pill */}
                        <div className="pt-3 mt-2 border-t border-[var(--border)]/40 flex items-center justify-between font-mono text-[10px]">
                          <span
                            className={
                              isCurrent
                                ? "text-[var(--accent)] font-semibold"
                                : isPassed
                                ? "text-[var(--success)]"
                                : "text-[var(--fg-faint)]"
                            }
                          >
                            {isCurrent ? "PROCESSING" : isPassed ? "PASSED" : "STANDBY"}
                          </span>
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isCurrent
                                ? "bg-[var(--accent)] animate-ping"
                                : isPassed
                                ? "bg-[var(--success)]"
                                : "bg-[var(--border-strong)]"
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Step Deep Inspector */}
                {dataflow[activeStep] && (
                  <div className="p-4 sm:p-5 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                      <p className="text-xs sm:text-sm text-[var(--fg-muted)] font-sans">
                        {dataflow[activeStep].detail}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                        className="px-3 py-1 rounded-[var(--radius-xs)] text-xs font-mono border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors"
                      >
                        前一步
                      </button>
                      <button
                        type="button"
                        disabled={activeStep === dataflow.length - 1}
                        onClick={() => setActiveStep((prev) => Math.min(dataflow.length - 1, prev + 1))}
                        className="px-3 py-1 rounded-[var(--radius-xs)] text-xs font-mono border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors"
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
      </div>
    </div>
  );
}
