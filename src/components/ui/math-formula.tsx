import katex from "katex";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

export interface MathFormulaProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function MathFormula({
  formula,
  displayMode = false,
  className = "",
  ariaLabel,
}: MathFormulaProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(formula, {
        displayMode,
        throwOnError: false,
        output: "htmlAndMathml",
        strict: false,
      });
    } catch {
      return null;
    }
  }, [formula, displayMode]);

  if (!html) {
    return (
      <code className={cn("font-mono text-xs text-[var(--fg)]", className)}>
        {formula}
      </code>
    );
  }

  return (
    <span
      className={cn(
        "math-formula max-w-full overflow-x-auto overflow-y-hidden no-scrollbar py-1 leading-relaxed text-[var(--fg)] selection:bg-[var(--accent)]/20",
        displayMode ? "flex my-2 py-1.5" : "inline-flex items-center",
        className,
      )}
      aria-label={ariaLabel || formula}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
