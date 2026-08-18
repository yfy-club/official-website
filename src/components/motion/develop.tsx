"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useState } from "react";

const SESSION_KEY = "yfy-develop-played";

export function Develop({ children, title }: { children: ReactNode; title: ReactNode }) {
  const [state, setState] = useState<"active" | "done">("done");

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || window.sessionStorage.getItem(SESSION_KEY)) return;
    window.sessionStorage.setItem(SESSION_KEY, "1");
    const frame = window.requestAnimationFrame(() => setState("active"));
    const duration = window.matchMedia("(max-width: 639px)").matches ? 1050 : 1300;
    const timer = window.setTimeout(() => setState("done"), duration);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="develop" data-state={state}>
      <div className="develop__title">{title}</div>
      <div className="develop__support">{children}</div>
    </div>
  );
}
