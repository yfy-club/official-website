"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Code2,
  Cpu,
  ExternalLink,
  Terminal,
  Wrench,
} from "lucide-react";

import { BackgroundImageTexture } from "@/components/ui/bg-image-texture";
import { CutoutCorner } from "@/components/ui/cutout-card";
import type { Track } from "@/content/schema";
import { TECH_STACK_MAP } from "@/lib/tech-stack";
import { cn } from "@/lib/utils";

interface TechStackCutoutConsoleProps {
  stack: Track["stack"];
  className?: string;
}

export function TechStackCutoutConsole({ stack, className }: TechStackCutoutConsoleProps) {
  const reduceMotion = useReducedMotion();

  // 分组数据
  const coreGroup = [
    ...stack.languages.map((name) => ({ name, category: "LANGUAGE", icon: Code2 })),
    ...stack.frameworks.map((name) => ({ name, category: "FRAMEWORK", icon: Cpu })),
  ];

  const engineeringGroup = [
    ...(stack.engineering || []).map((name) => ({ name, category: "ENGINEERING", icon: Terminal })),
    ...(stack.toolchain || []).map((name) => ({ name, category: "TOOLCHAIN", icon: Wrench })),
  ];

  const allItems = [...coreGroup, ...engineeringGroup];
  const [selectedTech, setSelectedTech] = useState<string>(allItems[0]?.name ?? "");

  const activeMeta = TECH_STACK_MAP[selectedTech] || {
    name: selectedTech,
    description: "工业级标准化工程工具链与核心底层基座。",
    url: `https://www.google.com/search?q=${encodeURIComponent(selectedTech)}`,
  };

  const activeItem = allItems.find((i) => i.name === selectedTech) || allItems[0];

  return (
    <div className={cn("w-full space-y-6", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* 左侧：分类技术标签矩阵 (Left: Control Matrix) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* 分组 1: 核心语言与框架 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--fg-muted)] tracking-wider">
              <Cpu size={14} className="text-[var(--accent)]" aria-hidden="true" />
              <span>LANGUAGES & FRAMEWORKS</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {coreGroup.map((item) => {
                const isSelected = selectedTech === item.name;
                const Icon = item.icon;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedTech(item.name)}
                    className={cn(
                      "relative inline-flex items-center gap-2 py-2 px-3.5 rounded-[var(--radius-xs)] font-mono text-xs font-medium transition-all duration-150 cursor-pointer select-none active:scale-[0.96]",
                      isSelected
                        ? "bg-[var(--accent)] text-black font-bold shadow-xs border border-[var(--accent)]"
                        : "bg-[var(--surface-2)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]/90 border border-[var(--border)] hover:border-[var(--border-strong)]"
                    )}
                  >
                    <Icon
                      size={13}
                      className={isSelected ? "text-black" : "text-[var(--fg-faint)]"}
                      aria-hidden="true"
                    />
                    <span>{item.name}</span>
                    {isSelected && (
                      <ArrowRight size={13} className="text-black ml-0.5" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 分组 2: 系统架构与工程工具链 */}
          {engineeringGroup.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[var(--border)]">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--fg-muted)] tracking-wider">
                <Terminal size={14} className="text-[var(--accent)]" aria-hidden="true" />
                <span>SYSTEMS & TOOLCHAIN</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {engineeringGroup.map((item) => {
                  const isSelected = selectedTech === item.name;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setSelectedTech(item.name)}
                      className={cn(
                        "relative inline-flex items-center gap-2 py-2 px-3.5 rounded-[var(--radius-xs)] font-mono text-xs font-medium transition-all duration-150 cursor-pointer select-none active:scale-[0.96]",
                        isSelected
                          ? "bg-[var(--accent)] text-black font-bold shadow-xs border border-[var(--accent)]"
                          : "bg-[var(--surface-2)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]/90 border border-[var(--border)] hover:border-[var(--border-strong)]"
                      )}
                    >
                      <Icon
                        size={13}
                        className={isSelected ? "text-black" : "text-[var(--fg-faint)]"}
                        aria-hidden="true"
                      />
                      <span>{item.name}</span>
                      {isSelected && (
                        <ArrowRight size={13} className="text-black ml-0.5" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 右侧：主舞台联动卡片 (Right: Cutout Morph Card with Texture & Dither) */}
        <div className="lg:col-span-7">
          <div className="relative h-full min-h-[320px] rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 flex flex-col justify-between overflow-hidden shadow-xs hover:border-[var(--border-strong)] transition-all">
            {/* 1. 微细噪点纹理底层 */}
            <BackgroundImageTexture opacity={0.035} />

            {/* 2. 右上角 Cutout 工业机械裁切角 + 棱镜微折射 */}
            <div className="absolute top-0 right-0 z-20 pointer-events-none">
              <CutoutCorner className="text-[var(--bg)]" size={36} />
              <div
                aria-hidden="true"
                className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-[var(--accent)]/20 blur-md pointer-events-none"
              />
            </div>

            {/* 3. MorphSurface 动效内容区 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTech}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                {/* 顶栏信息 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[var(--accent)] tracking-wider">
                      SPEC // {activeItem?.category}
                    </span>
                    <span className="text-[var(--border-control)]">/</span>
                    <span className="font-mono text-xs text-[var(--fg-faint)]">
                      ACTIVE SELECTION
                    </span>
                  </div>

                  <div className="flex items-start gap-4 sm:gap-6">
                    {/* Dither 半色调工业点阵工牌 */}
                    <div className="relative shrink-0 flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-[var(--radius-xs)] bg-[#0B0D10] border border-[var(--border-strong)] overflow-hidden shadow-inner">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
                        style={{
                          backgroundImage: `radial-gradient(circle, var(--accent) 1.2px, transparent 1.2px)`,
                          backgroundSize: "4px 4px",
                        }}
                      />
                      <span className="font-display text-base sm:text-xl font-bold text-[var(--accent)] tracking-tight">
                        {selectedTech.slice(0, 4).toUpperCase()}
                      </span>
                    </div>

                    {/* 标题与定位 */}
                    <div className="space-y-1.5 min-w-0">
                      <h3 className="font-display text-2xl sm:text-4xl font-bold text-[var(--fg)] tracking-tight">
                        {activeMeta.name}
                      </h3>
                      <p className="text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed font-sans max-w-xl">
                        {activeMeta.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 底部操作与规格参数 */}
                <div className="pt-6 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--fg-faint)]">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>社团生产级技术规范</span>
                  </div>

                  <a
                    href={activeMeta.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-[var(--radius-xs)] bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--border-strong)] hover:border-[var(--fg)] text-xs sm:text-sm font-mono text-[var(--fg)] transition-all active:scale-[0.96] shadow-xs cursor-pointer group"
                  >
                    <span>官方文档</span>
                    <ExternalLink
                      size={14}
                      className="text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
