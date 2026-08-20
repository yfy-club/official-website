"use client";

import * as React from "react";

import { useToast } from "@/hooks/use-toast";

const REQUIRED_CLICKS = 5;
const CLICK_RESET_DELAY = 1000;
const BLUEPRINT_DURATION = 5000;

export function useBlueprintEasterEgg() {
  const { toast } = useToast();
  const [isActive, setIsActive] = React.useState(false);
  const clickCountRef = React.useRef(0);
  const clickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const revertTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const exitBlueprint = React.useCallback(() => {
    document.documentElement.classList.remove("mode-blueprint");
    setIsActive(false);
    if (revertTimerRef.current) {
      clearTimeout(revertTimerRef.current);
      revertTimerRef.current = null;
    }
  }, []);

  const handleTriggerClick = React.useCallback(() => {
    // If already active, a click immediately restores normal view
    if (document.documentElement.classList.contains("mode-blueprint")) {
      exitBlueprint();
      toast({
        title: "SYS // BLUEPRINT_RESTORED",
        description: "已提前退出蓝图模式",
      });
      return;
    }

    clickCountRef.current += 1;

    if (clickCountRef.current >= REQUIRED_CLICKS) {
      clickCountRef.current = 0;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

      // Activate Blueprint Mode
      document.documentElement.classList.add("mode-blueprint");
      setIsActive(true);

      toast({
        title: "SYS // BLUEPRINT_OVERRIDE",
        description: "蓝图模式已激活 · 5秒后自动恢复正常视图",
      });

      // Auto revert after 5 seconds
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
      revertTimerRef.current = setTimeout(() => {
        exitBlueprint();
        toast({
          title: "SYS // BLUEPRINT_RESTORED",
          description: "蓝图模式已结束 · 系统恢复正常视图",
        });
      }, BLUEPRINT_DURATION);
      return;
    }

    // Reset clicks if idle
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, CLICK_RESET_DELAY);
  }, [exitBlueprint, toast]);

  // Handle ESC key to exit early
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && document.documentElement.classList.contains("mode-blueprint")) {
        exitBlueprint();
        toast({
          title: "SYS // BLUEPRINT_RESTORED",
          description: "已退出蓝图模式",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    };
  }, [exitBlueprint, toast]);

  return {
    isActive,
    handleTriggerClick,
    exitBlueprint,
  };
}
