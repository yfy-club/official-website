"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export function Develop({ children, title }: { children: ReactNode; title: ReactNode }) {
  const [state, setState] = useState<"idle" | "active" | "done">("idle");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setState("done");
      return;
    }

    let cancelled = false;
    let frame = 0;
    let timer = 0;
    let fontTimer = 0;
    const fontTimeout = new Promise<void>((resolve) => {
      fontTimer = window.setTimeout(resolve, 1000);
    });
    const fontsReady = document.fonts
      ? Promise.race([document.fonts.ready, fontTimeout])
      : Promise.resolve();

    fontsReady.then(() => {
      if (cancelled) return;
      frame = window.requestAnimationFrame(() => {
        setState("active");
        timer = window.setTimeout(() => setState("done"), 2300);
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fontTimer);
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
