"use client";

import { ArrowRight, Cpu, Database, Layers, Network, Sparkles, Workflow } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CardFrame, CardFrameHeader, CardFrameTitle, CardPanel } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechTag } from "@/components/ui/tech-tag";
import type { WorkArchitecture } from "@/content/schema";

interface WorkArchitectureStackProps {
  stack: Record<string, string[]>;
  architecture?: WorkArchitecture;
}

const TIER_ICONS: Record<string, typeof Layers> = {
  TIER_01: Layers,
  TIER_02: Network,
  TIER_03: Cpu,
  TIER_04: Database,
};

export function WorkArchitectureStack({ stack, architecture }: WorkArchitectureStackProps) {
  const hasDataflow = Boolean(architecture?.dataflow && architecture.dataflow.length > 0);

  // Fallback tiers if architecture is not explicitly defined in data
  const tiers = architecture?.tiers ?? Object.entries(stack).map(([label, items], idx) => ({
    code: `TIER_0${idx + 1}`,
    name: label,
    role: `负责系统 ${label} 核心功能模块与组件编排`,
    techTags: items,
    features: [`${label} 模块化构建`, "类型安全与工程规范"],
  }));

  const contentTiers = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
      {tiers.map((tier, index) => {
        const IconComponent = TIER_ICONS[tier.code] ?? Layers;
        return (
          <CardFrame
            key={tier.code}
            className="group/tier-card border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all shadow-xs"
          >
            <CardFrameHeader className="py-3 px-4 sm:px-5 bg-[var(--surface-2)]/40 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--accent)]">
                  <IconComponent className="h-3.5 w-3.5" />
                </span>
                <CardFrameTitle className="text-xs truncate">
                  {tier.code} {"//"} {tier.name}
                </CardFrameTitle>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono shrink-0 py-0.5 px-2">
                0{index + 1}
              </Badge>
            </CardFrameHeader>

            <CardPanel className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-4">
              {/* Role Definition */}
              <div className="space-y-2">
                <p className="text-xs font-mono text-[var(--fg-muted)] leading-relaxed">
                  <span className="text-[var(--fg-faint)] select-none">ROLE :: </span>
                  {tier.role}
                </p>
              </div>

              {/* Stack TechTags */}
              <div className="space-y-2 pt-2 border-t border-[var(--border)]/60">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--fg-faint)]">
                  <Sparkles className="h-3 w-3 text-[var(--accent)]" />
                  <span>TECH ARTIFACTS</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tier.techTags.map((tech) => (
                    <TechTag key={tech} name={tech} />
                  ))}
                </div>
              </div>

              {/* Features */}
              {tier.features && tier.features.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border)]/40">
                  {tier.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-2)] text-[var(--fg-muted)] border border-[var(--border)]/70"
                    >
                      <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </CardPanel>
          </CardFrame>
        );
      })}
    </div>
  );

  const contentDataflow = architecture?.dataflow && (
    <CardFrame className="border-[var(--border)] bg-[var(--surface)] shadow-xs">
      <CardFrameHeader className="py-3 px-4 sm:px-5 border-b border-[var(--border)] bg-[var(--surface-2)]/30">
        <div className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-[var(--accent)]" />
          <CardFrameTitle className="text-xs">
            END-TO-END DATAFLOW PIPELINE // 响应链路拓扑
          </CardFrameTitle>
        </div>
        <span className="font-mono text-[11px] text-[var(--fg-muted)]">
          {architecture.dataflow.length} STAGES
        </span>
      </CardFrameHeader>

      <CardPanel className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {architecture.dataflow.map((flow, idx) => {
            const isLast = idx === architecture.dataflow!.length - 1;
            return (
              <div
                key={flow.step}
                className="relative flex flex-col justify-between p-4 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/30 hover:bg-[var(--surface-2)]/60 hover:border-[var(--border-strong)] transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--accent)] tracking-wider">
                      STAGE_{flow.step}
                    </span>
                    {flow.protocol && (
                      <span className="font-mono text-[10px] text-[var(--fg-faint)] px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                        {flow.protocol}
                      </span>
                    )}
                  </div>

                  <h4 className="font-sans text-sm font-semibold text-[var(--fg)] tracking-tight">
                    {flow.title}
                  </h4>

                  <p className="font-sans text-xs text-[var(--fg-muted)] leading-relaxed">
                    {flow.detail}
                  </p>
                </div>

                {!isLast && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-6 w-6 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] shadow-xs">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardPanel>
    </CardFrame>
  );

  return (
    <div className="work-architecture-stack space-y-6" data-reveal="group">
      {hasDataflow ? (
        <Tabs defaultValue="tiers" className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-[var(--border)]">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg)]">
                SYSTEM TOPOLOGY // ARCHITECTURE PANORAMA
              </span>
            </div>

            <TabsList className="h-8 bg-[var(--surface-2)]/80 p-0.5 border border-[var(--border)]">
              <TabsTrigger value="tiers" className="h-7 px-3 text-xs gap-1.5 data-[state=active]:bg-[var(--surface)]">
                <Layers className="h-3.5 w-3.5" />
                分层分舱全景
              </TabsTrigger>
              <TabsTrigger value="dataflow" className="h-7 px-3 text-xs gap-1.5 data-[state=active]:bg-[var(--surface)]">
                <Workflow className="h-3.5 w-3.5" />
                数据流向拓扑
              </TabsTrigger>
            </TabsList>
          </div>

          {architecture?.summary && (
            <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed font-sans max-w-3xl">
              {architecture.summary}
            </p>
          )}

          <TabsContent value="tiers" className="mt-0 focus-visible:outline-none">
            {contentTiers}
          </TabsContent>
          <TabsContent value="dataflow" className="mt-0 focus-visible:outline-none">
            {contentDataflow}
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <div className="flex items-center gap-2.5 pb-1 border-b border-[var(--border)]">
            <div className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg)]">
              SYSTEM TOPOLOGY // ARCHITECTURE PANORAMA
            </span>
          </div>

          {architecture?.summary && (
            <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed font-sans max-w-3xl">
              {architecture.summary}
            </p>
          )}

          {contentTiers}
        </>
      )}
    </div>
  );
}

