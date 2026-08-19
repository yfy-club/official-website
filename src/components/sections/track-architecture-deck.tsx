"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Cpu, Layers, Sparkles, Terminal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TechTag } from "@/components/ui/tech-tag";
import { cn } from "@/lib/utils";

export interface DeepFocusItem {
  title: string;
  subtitle: string;
  description: string;
  techTags: string[];
  highlight: string;
}

export function TrackArchitectureDeck({ items }: { items: DeepFocusItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex] || items[0];

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full space-y-6">
      {/* 顶部 Segmented 物理滑块选项卡 */}
      <div className="flex items-center gap-1.5 p-1 rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)] overflow-x-auto no-scrollbar">
        {items.map((item, idx) => {
          const isActive = activeIndex === idx;
          const shortTitle = item.title.split("(")[0]?.trim() || item.title;

          return (
            <button
              key={item.title}
              onClick={() => setActiveIndex(idx)}
              type="button"
              className={cn(
                "relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-xs)] text-xs font-mono transition-colors whitespace-nowrap cursor-pointer",
                isActive
                  ? "text-[var(--fg)] font-bold shadow-xs"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              )}
            >
              <span className="text-[10px] text-[var(--accent)]">0{idx + 1} //</span>
              <span>{shortTitle}</span>

              {isActive && (
                <motion.div
                  layoutId="arch-deck-active-pill"
                  className="absolute inset-0 bg-[var(--surface)] border border-[var(--border-strong)] rounded-[var(--radius-xs)] -z-10 shadow-xs"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 沉浸式宽幅单舱面板 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeItem.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 左列：核心突破方向与课题解析 */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-semibold text-[var(--accent)] tracking-wider">
                    FOCUS 0{activeIndex + 1} {"//"}
                  </span>
                  <Badge variant="active" className="text-[10px]">
                    CORE ARCHITECTURE
                  </Badge>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--fg)] tracking-tight">
                  {activeItem.title}
                </h3>
                <p className="font-mono text-xs text-[var(--accent)] mt-1">
                  {activeItem.subtitle}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed">
                {activeItem.description}
              </p>

              {/* 核心产出与亮点徽标 */}
              <div className="p-4 rounded-[var(--radius-xs)] border border-[var(--accent)]/30 bg-[var(--accent)]/5 flex items-start gap-3 text-xs sm:text-sm">
                <Sparkles className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono font-bold text-[var(--fg)] block text-xs uppercase mb-0.5">
                    KEY MILESTONE & OUTPUT // 课题突破成果
                  </span>
                  <span className="text-[var(--fg-muted)] leading-relaxed">
                    {activeItem.highlight}
                  </span>
                </div>
              </div>
            </div>

            {/* 右列：关联技术栈与攻坚范式 */}
            <div className="lg:col-span-5 space-y-5 lg:pl-6 lg:border-l lg:border-[var(--border)]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Terminal size={14} className="text-[var(--accent)]" />
                  <span className="font-mono text-xs font-bold text-[var(--fg)] tracking-wider">
                    TARGET TECH STACK // 攻坚技术栈
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeItem.techTags.map((tag) => (
                    <TechTag key={tag} name={tag} className="py-1.5 px-3 text-xs" />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[var(--fg-faint)]">
                  <Layers size={14} />
                  <span>ENGINEERING DISCIPLINE // 研发落地标准</span>
                </div>
                <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                  遵循行业生产级代码规范，从算法原型构建、性能剖析到多端部署，全程经过导师审阅与持续集成测试。
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
