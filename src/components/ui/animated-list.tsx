"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

export interface AnimatedListItem {
  id: string | number;
}

export interface AnimatedListProps<T extends AnimatedListItem> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  maxVisible?: number;
  gap?: string;
  className?: string;
  autoCycle?: boolean;
  cycleInterval?: number;
}

export function AnimatedList<T extends AnimatedListItem>({
  items,
  renderItem,
  maxVisible = 5,
  gap = "gap-3",
  className,
  autoCycle = false,
  cycleInterval = 4000,
}: AnimatedListProps<T>) {
  const [visibleItems, setVisibleItems] = useState<T[]>(() => items.slice(0, maxVisible));
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setVisibleItems(items.slice(0, maxVisible));
  }, [items, maxVisible]);

  useEffect(() => {
    if (!autoCycle || items.length <= maxVisible || isPaused) return;

    const timer = setInterval(() => {
      setVisibleItems((prev) => {
        const lastIndex = items.findIndex((it) => it.id === prev[0]?.id);
        const nextIndex = (lastIndex + 1) % items.length;
        const nextItem = items[nextIndex];

        // Prepend new item to push previous down
        const filtered = prev.filter((it) => it.id !== nextItem.id);
        return [nextItem, ...filtered].slice(0, maxVisible);
      });
    }, cycleInterval);

    return () => clearInterval(timer);
  }, [autoCycle, items, maxVisible, isPaused, cycleInterval]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn("flex flex-col", gap, className)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {visibleItems.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.15 } }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
            }}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
