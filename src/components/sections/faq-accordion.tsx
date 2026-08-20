"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown, ChevronsUpDown, HelpCircle } from "lucide-react";
import { useMemo, useState } from "react";

import type { Faq } from "@/content";
import { cn } from "@/lib/utils";

const FAQ_CATEGORIES = [
  { id: "all", label: "全部解答", code: "ALL" },
  { id: "entry", label: "报名与准入", code: "ENTRY" },
  { id: "tech", label: "考核与方向", code: "TECH" },
  { id: "resources", label: "竞赛与资源", code: "RES" },
] as const;

// 分类映射规则
function getFaqCategory(question: string): "entry" | "tech" | "resources" {
  if (question.includes("竞赛") || question.includes("电脑") || question.includes("实验室提供")) {
    return "resources";
  }
  if (question.includes("考核") || question.includes("方向") || question.includes("更换")) {
    return "tech";
  }
  return "entry";
}

export function FaqAccordion({ items }: { items: readonly Faq[] }) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // 附带分类的条目
  const itemsWithCat = useMemo(() => {
    return items.map((item, idx) => ({
      ...item,
      id: `faq-${idx}`,
      category: getFaqCategory(item.question),
    }));
  }, [items]);

  // 过滤后的条目
  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return itemsWithCat;
    return itemsWithCat.filter((item) => item.category === selectedCategory);
  }, [itemsWithCat, selectedCategory]);

  // 统计各分类数量
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: items.length };
    for (const item of itemsWithCat) {
      map[item.category] = (map[item.category] || 0) + 1;
    }
    return map;
  }, [items.length, itemsWithCat]);

  // 全部展开/折叠
  const isAllExpanded =
    filteredItems.length > 0 &&
    filteredItems.every((item) => expandedItems.includes(item.question));

  const toggleAll = () => {
    if (isAllExpanded) {
      setExpandedItems([]);
    } else {
      setExpandedItems(filteredItems.map((item) => item.question));
    }
  };

  return (
    <div className="faq-console space-y-4">
      {/* 顶部 Cult UI 风格 Category Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-1)]">
        {/* 分类过滤器 */}
        <div
          role="tablist"
          aria-label="常见问题分类过滤"
          className="flex flex-wrap items-center gap-1.5"
        >
          {FAQ_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = counts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-xs)] font-mono text-xs transition-transform cursor-pointer select-none active:scale-[0.96]",
                  isActive
                    ? "text-[var(--fg)] font-medium"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                )}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] tabular opacity-75">({count})</span>

                {isActive && (
                  <motion.div
                    layoutId="faq-category-pill"
                    className="absolute inset-0 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border-strong)] -z-10 shadow-xs"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 450, damping: 32 }
                    }
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 右侧展开全部开关 */}
        <button
          type="button"
          onClick={toggleAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-xs)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-2)]/60 text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] active:scale-[0.96] transition-all cursor-pointer select-none"
        >
          <ChevronsUpDown className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
          <span>{isAllExpanded ? "折叠全部解答" : "展开全部解答"}</span>
        </button>
      </div>

      {/* 手风琴列表（保持 Radix 无障碍键盘操作与原有测试选择器兼容） */}
      <Accordion.Root
        className="mechanism-accordion"
        type="multiple"
        value={expandedItems}
        onValueChange={setExpandedItems}
      >
        {filteredItems.map((item, index) => (
          <Accordion.Item
            className="mechanism-accordion__item"
            key={item.question}
            value={item.question}
          >
            <Accordion.Header>
              <Accordion.Trigger className="mechanism-accordion__trigger">
                <span className="mechanism-accordion__index tabular">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <HelpCircle className="w-4 h-4 text-[var(--accent)] shrink-0 hidden sm:inline" aria-hidden="true" />
                  <span>{item.question}</span>
                </span>
                <ChevronDown
                  className="mechanism-accordion__chevron"
                  aria-hidden="true"
                  size={17}
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="mechanism-accordion__content">
              <p className="leading-relaxed">{item.answer}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
