"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Code2, Cpu, ExternalLink, Terminal, Wrench } from "lucide-react";

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
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // 聚合所有技术栈项
  const items = [
    ...stack.languages.map((name) => ({ name, category: "LANGUAGE", icon: Code2 })),
    ...stack.frameworks.map((name) => ({ name, category: "FRAMEWORK", icon: Cpu })),
    ...(stack.engineering || []).map((name) => ({ name, category: "ENGINEERING", icon: Terminal })),
    ...(stack.toolchain || []).map((name) => ({ name, category: "TOOLCHAIN", icon: Wrench })),
  ];

  const activeMeta = selectedTech ? TECH_STACK_MAP[selectedTech] || {
    name: selectedTech,
    description: "工业级标准化工程工具链与核心底层基座。",
    url: `https://www.google.com/search?q=${encodeURIComponent(selectedTech)}`,
  } : null;

  const activeItem = items.find((i) => i.name === selectedTech);

  const handleTechClick = (name: string) => {
    setSelectedTech((prev) => (prev === name ? null : name));
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] transition-all duration-200 shadow-xs hover:border-[var(--border-strong)]",
        className
      )}
    >
      {/* 1. 微细噪点纹理底层 (Texture Overlay) */}
      <BackgroundImageTexture opacity={0.035} />

      {/* 2. 右上角 Cutout 工业机械裁切角 + 棱镜微折射 (Distorted Prism Edge) */}
      <div className="absolute top-0 right-0 z-20 pointer-events-none">
        <CutoutCorner className="text-[var(--bg)]" size={32} />
        {/* 棱镜折射微光带 */}
        <div
          aria-hidden="true"
          className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-[var(--accent)]/20 blur-sm pointer-events-none"
        />
      </div>

      {/* 3. 展台顶栏 (工业规格标牌) */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-2)]/40">
        <div className="flex items-center gap-2.5">
          <Terminal size={14} className="text-[var(--accent)] shrink-0" aria-hidden="true" />
          <span className="font-mono text-xs font-bold text-[var(--fg)] tracking-wider">
            TOOLCHAIN SPEC // 0{items.length} STACK MODULES
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--fg-faint)] pr-6">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>STANDARDIZED</span>
        </div>
      </div>

      {/* 4. 核心芯片矩阵 (默认极简低密度呈现) */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {items.map((item) => {
            const isSelected = selectedTech === item.name;
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleTechClick(item.name)}
                className={cn(
                  "relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-xs)] font-mono text-xs font-medium transition-all duration-150 cursor-pointer select-none active:scale-[0.96]",
                  isSelected
                    ? "bg-[var(--accent)] text-black font-bold shadow-xs border border-[var(--accent)]"
                    : "bg-[var(--surface-2)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]/80 border border-[var(--border)] hover:border-[var(--border-strong)]"
                )}
              >
                <Icon size={12} className={isSelected ? "text-black" : "text-[var(--fg-faint)]"} aria-hidden="true" />
                <span>{item.name}</span>
                {isSelected && (
                  <ArrowUpRight size={12} className="text-black ml-0.5 animate-pulse" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Expandable 物理弹性自适应展开舱 (包含 Dither 质感徽标与外链) */}
      <AnimatePresence initial={false}>
        {selectedTech && activeMeta && activeItem && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden border-t border-[var(--border)] bg-[var(--surface-2)]/60"
          >
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              {/* 左侧：Dither 点阵半色调工牌 + 描述 */}
              <div className="flex items-start gap-4 min-w-0">
                {/* Dither 工业半色调网点徽标 */}
                <div className="relative shrink-0 flex items-center justify-center h-12 w-12 rounded-[var(--radius-xs)] bg-[#0B0D10] border border-[var(--border-strong)] overflow-hidden group">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle, var(--accent) 1px, transparent 1px)`,
                      backgroundSize: "3px 3px",
                    }}
                  />
                  <span className="font-mono text-xs font-bold text-[var(--accent)]">
                    {selectedTech.slice(0, 3).toUpperCase()}
                  </span>
                </div>

                {/* 文字定位 */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h4 className="font-display text-lg sm:text-xl font-bold text-[var(--fg)] tracking-tight">
                      {activeMeta.name}
                    </h4>
                    <span className="font-mono text-[10px] text-[var(--accent)] font-semibold px-1.5 py-0.5 rounded-[var(--radius-2xs)] bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                      {activeItem.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed font-sans max-w-2xl">
                    {activeMeta.description}
                  </p>
                </div>
              </div>

              {/* 右侧：官网外链直达 */}
              <a
                href={activeMeta.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-[var(--radius-xs)] bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--fg)] text-xs font-mono text-[var(--fg)] transition-all shrink-0 active:scale-[0.96] shadow-xs"
              >
                <span>官方文档</span>
                <ExternalLink size={13} className="text-[var(--accent)]" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
