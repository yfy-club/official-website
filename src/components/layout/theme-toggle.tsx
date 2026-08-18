"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current: "system" | "light" | "dark" =
    mounted && (theme === "light" || theme === "dark") ? theme : "system";
  const next = current === "system" ? "light" : current === "light" ? "dark" : "system";
  const labels = { system: "跟随系统", light: "亮色", dark: "暗色" } as const;

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(next)}
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
  );
}
