"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ArrowUp } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const SPRING_TRANSITION = { type: "spring" as const, stiffness: 420, damping: 30 };

export function ScrollToTopHUD() {
  const [isVisible, setIsVisible] = useState(false);
  const [percent, setPercent] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsVisible(currentY > 320);

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const pct = Math.min(100, Math.max(0, Math.round((currentY / maxScroll) * 100)));
        setPercent(pct);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.75, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.75, y: 12 }}
          transition={SPRING_TRANSITION}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={scrollToTop}
                aria-label={`回到页面顶部，当前进度 ${percent}%`}
                className={cn(
                  "group relative flex items-center justify-center w-11 h-11 rounded-full",
                  "bg-[var(--surface)]/90 dark:bg-[var(--surface-2)]/90 backdrop-blur-md",
                  "border border-[var(--border-strong)] hover:border-[var(--accent)]",
                  "text-[var(--fg-muted)] hover:text-[var(--accent)]",
                  "shadow-md hover:shadow-lg active:scale-[0.88] transition-all duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                )}
              >
                {/* 环形进度仪表 */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="1.5"
                    className="opacity-40"
                  />
                  <motion.circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{
                      pathLength: scaleX,
                    }}
                  />
                </svg>

                {/* 中心向上箭头 */}
                <ArrowUp
                  size={16}
                  aria-hidden="true"
                  className="relative z-10 transition-transform duration-200 group-hover:-translate-y-0.5"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={10} className="font-mono text-xs py-1 px-2.5">
              <span>TOP // {percent}%</span>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
