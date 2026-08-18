"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

export function SpotlightCard({
  alt,
  children,
  flip,
  image,
}: {
  alt: string;
  children: ReactNode;
  flip: boolean;
  image?: string;
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
    <article className="work-row spotlight-card" ref={cardRef} data-flip={flip}>
      {image && (
        <div className="work-row__media spotlight-card__media">
          <Image className="spotlight-card__negative" src={image} alt={alt} width={1600} height={900} sizes="(max-width: 1024px) 100vw, 54vw" />
          <Image className="spotlight-card__color" src={image} alt="" aria-hidden="true" width={1600} height={900} sizes="(max-width: 1024px) 100vw, 54vw" />
        </div>
      )}
      {children}
    </article>
  );
}
