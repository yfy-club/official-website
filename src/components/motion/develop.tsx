"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const SESSION_KEY = "yfy-develop-played";

export function Develop({ children, title }: { children: ReactNode; title: ReactNode }) {
  const [state, setState] = useState<"active" | "done">("done");
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || window.sessionStorage.getItem(SESSION_KEY)) return;
    window.sessionStorage.setItem(SESSION_KEY, "1");
    const frame = window.requestAnimationFrame(() => setState("active"));
    const timer = window.setTimeout(() => setState("done"), 2300);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!root || reducedMotion.matches) return;

    let scrollFrame = 0;
    let pointerFrame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const updateScroll = () => {
      const progress = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);
      root.style.setProperty("--hero-scroll-progress", String(progress));
      root.style.setProperty("--hero-meta-opacity", String(Math.max(0, 1 - progress * 2.5)));
      scrollFrame = 0;
    };
    const handleScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll);
    };
    const updatePointer = () => {
      root.style.setProperty("--hero-mouse-x", String(pointerX));
      root.style.setProperty("--hero-mouse-y", String(pointerY));
      pointerFrame = 0;
    };
    const handlePointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = (event.clientY / window.innerHeight) * 2 - 1;
      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(updatePointer);
    };

    updateScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    if (finePointer.matches) window.addEventListener("pointermove", handlePointer, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointermove", handlePointer);
      window.cancelAnimationFrame(scrollFrame);
      window.cancelAnimationFrame(pointerFrame);
    };
  }, []);

  return (
    <div ref={rootRef} className="develop" data-state={state}>
      <div className="develop__title">{title}</div>
      <div className="develop__support">{children}</div>
    </div>
  );
}
