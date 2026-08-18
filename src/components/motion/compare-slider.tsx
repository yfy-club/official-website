"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { clampSliderValue, getSliderValueFromKey } from "@/lib/motion";

export function CompareSlider({ alt, dark, light }: { alt: string; dark: string; light: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(50);
  const frameRef = useRef<number | null>(null);
  const pendingRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  function commit(value: number) {
    const next = clampSliderValue(value);
    valueRef.current = next;
    rootRef.current?.style.setProperty("--split", `${next}%`);
    sliderRef.current?.setAttribute("aria-valuenow", String(next));
  }

  function schedule(value: number) {
    pendingRef.current = value;
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      if (pendingRef.current !== null) commit(pendingRef.current);
      pendingRef.current = null;
      frameRef.current = null;
    });
  }

  function valueFromPointer(clientX: number) {
    const rect = rootRef.current?.getBoundingClientRect();
    return rect ? ((clientX - rect.left) / rect.width) * 100 : valueRef.current;
  }

  useEffect(() => () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div
      className="compare"
      ref={rootRef}
      onPointerDown={(event) => {
        draggingRef.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        schedule(valueFromPointer(event.clientX));
      }}
      onPointerMove={(event) => {
        if (draggingRef.current) schedule(valueFromPointer(event.clientX));
      }}
      onPointerUp={(event) => {
        draggingRef.current = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => { draggingRef.current = false; }}
    >
      <Image className="compare__image" src={dark} alt={`${alt}，暗色主题`} fill sizes="(max-width: 768px) 100vw, 80vw" priority />
      <div className="compare__top" aria-hidden="true">
        <Image className="compare__image" src={light} alt="" fill sizes="(max-width: 768px) 100vw, 80vw" priority />
      </div>
      <span className="compare__label compare__label--dark">暗色</span>
      <span className="compare__label compare__label--light">亮色</span>
      <div
        className="compare__handle"
        ref={sliderRef}
        role="slider"
        tabIndex={0}
        aria-label="调整暗色与亮色截图的对比位置"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        onKeyDown={(event) => {
          const next = getSliderValueFromKey(valueRef.current, event.key);
          if (next === null) return;
          event.preventDefault();
          commit(next);
        }}
      >
        <span aria-hidden="true">↔</span>
      </div>
    </div>
  );
}
