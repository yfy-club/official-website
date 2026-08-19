"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { getWorkImageTransitionName } from "@/lib/work-media";

export function SpotlightCard({
  alt,
  children,
  image,
  workSlug,
}: {
  alt: string;
  children: ReactNode;
  flip?: boolean;
  image?: string;
  workSlug?: string;
}) {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduce.matches) {
      card.dataset.revealed = "true";
      return;
    }

    if (!finePointer.matches) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        card.dataset.revealed = "true";
        observer.disconnect();
      }, { threshold: 0.28 });
      observer.observe(card);
      return () => observer.disconnect();
    }

    let frame = 0;
    let x = 0;
    let y = 0;
    const move = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
        frame = 0;
      });
    };
    card.addEventListener("pointermove", move, { passive: true });
    return () => {
      card.removeEventListener("pointermove", move);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <article className="work-row spotlight-card border-[var(--border)] bg-[var(--surface)] shadow-xs rounded-[var(--radius-sm)] overflow-hidden" ref={cardRef} data-work-slug={workSlug}>
      {image && (
        <div
          className="work-row__media spotlight-card__media relative flex flex-col overflow-hidden border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--surface-2)]"
          style={{ viewTransitionName: workSlug ? getWorkImageTransitionName(workSlug) : "none" }}
        >
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-xs select-none">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
            </div>
            <span className="font-mono text-[10px] text-[var(--fg-faint)] tracking-wider">
              CLIENT // LIVE PREVIEW
            </span>
          </div>
          <div className="relative flex-1 aspect-16/10 overflow-hidden">
            <Image className="spotlight-card__negative object-cover w-full h-full" src={image} alt={alt} width={1600} height={900} sizes="(max-width: 1024px) 100vw, 54vw" />
            <Image className="spotlight-card__color object-cover w-full h-full" src={image} alt="" aria-hidden="true" width={1600} height={900} sizes="(max-width: 1024px) 100vw, 54vw" />
          </div>
        </div>
      )}
      {children}
    </article>
  );
}
