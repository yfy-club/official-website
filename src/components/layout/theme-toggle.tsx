"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="inline-flex size-11 items-center justify-center rounded-full border border-border-strong bg-surface text-fg transition-colors duration-150 hover:border-accent"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? `切换到${isDark ? "亮色" : "暗色"}主题` : "切换主题"}
    >
      {isDark ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
    </button>
  );
}
