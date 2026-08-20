"use client";

import { useEffect, useState } from "react";
import {
  ChevronRight,
  Cpu,
  Database,
  Layers,
  Network,
  Play,
  RotateCcw,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";

import {
  DynamicContainer,
  DynamicDescription,
  DynamicDiv,
  DynamicIsland,
  DynamicIslandProvider,
  DynamicTitle,
  useDynamicIslandSize,
} from "@/components/ui/dynamic-island";
import { TechTag } from "@/components/ui/tech-tag";
import type { WorkArchitecture } from "@/content/schema";

interface WorkArchitectureStackProps {
  stack: Record<string, string[]>;
  architecture?: WorkArchitecture;
}

const TIER_ICONS = [Layers, Network, Cpu, Database];

function ArchitectureDynamicIslandContent({
  tiers,
  dataflow,
}: {
  tiers: Array<{
    code: string;
    name: string;
    role: string;
    techTags: string[];
    features?: string[];
  }>;
  dataflow: Array<{ step: string; title: string; protocol?: string; detail: string }>;
}) {
  const { state, setSize } = useDynamicIslandSize();
  const isExpanded = state.size !== "default" && state.size !== "compact";
  const [activeTierIndex, setActiveTierIndex] = useState<number>(0);
  const [activeDataflowStep, setActiveDataflowStep] = useState<number>(0);
  const [activeMode, setActiveMode] = useState<"tiers" | "dataflow">("tiers");
  const [isPlayingFlow, setIsPlayingFlow] = useState<boolean>(false);

  const currentTier = tiers[activeTierIndex] || tiers[0];
  const hasDataflow = dataflow.length > 0;

  // Auto-play dataflow step when in flow mode and playing
  useEffect(() => {
    if (activeMode !== "dataflow" || !isPlayingFlow || dataflow.length === 0) return;

    const timer = setInterval(() => {
      setActiveDataflowStep((prev) => (prev + 1) % dataflow.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [activeMode, isPlayingFlow, dataflow.length]);

  return (
    <DynamicIsland id="arch-dynamic-island">
      {!isExpanded ? (
        /* Low-Density Collapsed State */
        <DynamicContainer className="flex h-full w-full items-center justify-between px-5 py-3 cursor-pointer hover:bg-[var(--surface-2)]/50 transition-colors">
          <button
            type="button"
            onClick={() => setSize("ultra")}
            className="flex items-center justify-between w-full text-left gap-4"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/40 text-[var(--accent)]">
                <Layers className="h-3.5 w-3.5" />
              </span>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-[var(--fg)] tracking-tight">
                  {tiers.length} TIER ARCHITECTURE
                </span>
                <span className="text-[var(--fg-faint)]">/</span>
                <span className="text-[var(--fg-muted)] hidden sm:inline">
                  点击物理展开全景选型
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--accent)] font-semibold shrink-0">
              <span>展开探索</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </button>
        </DynamicContainer>
      ) : (
        /* High-Impact Expanded Architectural Stage */
        <DynamicContainer className="flex h-full w-full flex-col p-5 sm:p-6 space-y-5">
          {/* Top Bar with Mode Switcher & Close Button */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--border)] w-full">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="font-bold text-[var(--fg)] uppercase tracking-wider">
                {activeMode === "tiers" ? "STACK BLUEPRINT" : "DATAFLOW TOPOLOGY"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasDataflow && (
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setActiveMode("tiers")}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
                      activeMode === "tiers"
                        ? "bg-[var(--surface)] text-[var(--fg)] font-semibold shadow-xs"
                        : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    }`}
                  >
                    分层选型
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMode("dataflow");
                      setActiveDataflowStep(0);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
                      activeMode === "dataflow"
                        ? "bg-[var(--surface)] text-[var(--fg)] font-semibold shadow-xs"
                        : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    }`}
                  >
                    数据流向
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSize("default")}
                className="p-1.5 rounded-full bg-[var(--surface-2)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]/80 transition-colors"
                aria-label="收起灵动岛"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {activeMode === "tiers" ? (
            /* Tiers Morphing Stage */
            <div className="space-y-4 w-full">
              {/* Horizontal Tier Quick Switcher */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {tiers.map((tier, idx) => {
                  const isActive = activeTierIndex === idx;
                  const Icon = TIER_ICONS[idx % TIER_ICONS.length] ?? Layers;

                  return (
                    <button
                      key={tier.code}
                      type="button"
                      onClick={() => setActiveTierIndex(idx)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-xs)] font-mono text-xs shrink-0 transition-all border ${
                        isActive
                          ? "bg-[var(--surface-2)] text-[var(--fg)] border-[var(--accent)] font-semibold shadow-xs"
                          : "text-[var(--fg-muted)] border-[var(--border)] hover:bg-[var(--surface-2)]/50"
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"}`} />
                      <span>{tier.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tier Spotlight Pane */}
              <DynamicDiv className="p-4 sm:p-5 rounded-[var(--radius-sm)] bg-[var(--surface-2)]/40 border border-[var(--border)] space-y-4 text-left">
                <div className="flex items-center justify-between gap-2 border-b border-[var(--border)]/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-xs)] bg-[var(--accent)] text-black font-bold text-xs">
                      0{activeTierIndex + 1}
                    </span>
                    <div>
                      <DynamicTitle className="text-sm sm:text-base font-bold text-[var(--fg)]">
                        {currentTier.name}
                      </DynamicTitle>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)]">
                    {currentTier.code}
                  </span>
                </div>

                <DynamicDescription className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed font-sans">
                  {currentTier.role}
                </DynamicDescription>

                {/* Tech Stack Tags */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-1 font-mono text-[10px] text-[var(--fg-faint)] uppercase">
                    <Sparkles className="h-3 w-3 text-[var(--accent)]" />
                    <span>核心选型与工具链</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTier.techTags.map((tech) => (
                      <TechTag key={tech} name={tech} />
                    ))}
                  </div>
                </div>

                {/* Feature Capsules */}
                {currentTier.features && currentTier.features.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border)]/40">
                    {currentTier.features.map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--fg-muted)] border border-[var(--border)]"
                      >
                        <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </DynamicDiv>
            </div>
          ) : (
            /* Dataflow Stage */
            <div className="space-y-4 w-full">
              {/* Controls */}
              <div className="flex items-center justify-between gap-2 pb-2">
                <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent)] font-bold">
                  <Workflow className="h-3.5 w-3.5" />
                  <span>PIPELINE STAGE 0{activeDataflowStep + 1} / 0{dataflow.length}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlayingFlow((prev) => !prev)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono border transition-all ${
                      isPlayingFlow
                        ? "bg-[var(--accent)] text-black border-[var(--accent)] font-semibold shadow-xs"
                        : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--fg)] hover:bg-[var(--surface-2)]/80"
                    }`}
                  >
                    <Play className={`h-3 w-3 ${isPlayingFlow ? "fill-black" : ""}`} />
                    <span>{isPlayingFlow ? "暂停" : "自动流动"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveDataflowStep(0)}
                    className="p-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    aria-label="重置第一步"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Dataflow Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {dataflow.map((flow, idx) => {
                  const isCurrent = activeDataflowStep === idx;
                  const isPassed = activeDataflowStep > idx;

                  return (
                    <button
                      key={flow.step}
                      type="button"
                      onClick={() => {
                        setActiveDataflowStep(idx);
                        setIsPlayingFlow(false);
                      }}
                      className={`p-2.5 rounded-[var(--radius-xs)] border text-left transition-all ${
                        isCurrent
                          ? "bg-[var(--surface-2)] border-[var(--accent)] shadow-xs ring-1 ring-[var(--accent)]/30"
                          : isPassed
                          ? "bg-[var(--surface-2)]/40 border-[var(--border)]"
                          : "bg-[var(--surface-2)]/20 border-[var(--border)]/60 text-[var(--fg-muted)]"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[9px] text-[var(--fg-faint)]">
                        <span>0{idx + 1}</span>
                        {flow.protocol && <span>{flow.protocol}</span>}
                      </div>
                      <div className={`text-xs font-semibold mt-1 truncate ${isCurrent ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}`}>
                        {flow.title}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Current Step Detail */}
              {dataflow[activeDataflowStep] && (
                <div className="p-3.5 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/40 border border-[var(--border)] text-left space-y-1">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--accent)]">
                    <span>STAGE 0{activeDataflowStep + 1} :: {dataflow[activeDataflowStep].title}</span>
                  </div>
                  <p className="text-xs text-[var(--fg-muted)] font-sans leading-relaxed">
                    {dataflow[activeDataflowStep].detail}
                  </p>
                </div>
              )}
            </div>
          )}
        </DynamicContainer>
      )}
    </DynamicIsland>
  );
}

export function WorkArchitectureStack({ stack, architecture }: WorkArchitectureStackProps) {
  const tiers = architecture?.tiers ?? Object.entries(stack).map(([label, items], idx) => ({
    code: `TIER_0${idx + 1}`,
    name: label,
    role: `负责系统 ${label} 核心功能模块与组件编排`,
    techTags: items,
    features: [`${label} 模块化构建`, "类型安全与工程规范"],
  }));

  const dataflow = architecture?.dataflow ?? [];

  return (
    <div className="work-architecture-stack-island select-none my-6 text-center space-y-3" data-reveal="group">
      {architecture?.summary && (
        <p className="text-xs sm:text-sm text-[var(--fg-muted)] font-sans leading-relaxed max-w-3xl mx-auto text-left sm:text-center pb-2">
          {architecture.summary}
        </p>
      )}

      <DynamicIslandProvider initialSize="default">
        <ArchitectureDynamicIslandContent
          tiers={tiers}
          dataflow={dataflow}
        />
      </DynamicIslandProvider>
    </div>
  );
}
