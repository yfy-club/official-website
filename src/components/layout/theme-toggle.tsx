"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Theme = "system" | "light" | "dark";

function applyTheme(theme: Theme) {
  const resolved = theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    : theme;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const current: Theme = stored === "light" || stored === "dark" ? stored : "system";
    setTheme(current);
    applyTheme(current);
    setMounted(true);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => {
      if ((window.localStorage.getItem("theme") ?? "system") === "system") applyTheme("system");
    };
    media.addEventListener("change", syncSystemTheme);
    return () => media.removeEventListener("change", syncSystemTheme);
  }, []);

  const current: "system" | "light" | "dark" =
    mounted && (theme === "light" || theme === "dark") ? theme : "system";
  const next = current === "system" ? "light" : current === "light" ? "dark" : "system";
  const labels = { system: "跟随系统", light: "亮色", dark: "暗色" } as const;

  function selectTheme(selected: Theme) {
    window.localStorage.setItem("theme", selected);
    setTheme(selected);
    applyTheme(selected);
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => selectTheme(next)}
          aria-label={mounted ? `当前${labels[current]}主题，切换到${labels[next]}` : "切换主题"}
        >
          {current === "system" ? (
            <Monitor aria-hidden="true" size={18} />
          ) : current === "light" ? (
            <Moon aria-hidden="true" size={18} />
          ) : (
            <Sun aria-hidden="true" size={18} />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="end">
        {mounted ? `当前：${labels[current]} · 切换至${labels[next]}` : "切换主题"}
      </TooltipContent>
    </Tooltip>
  );
}
