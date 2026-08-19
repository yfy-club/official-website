"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type TracingBeamProps = {
  children: ReactNode;
  className?: string;
};

export function TracingBeam({ children, className }: TracingBeamProps) {
  const gradientId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start 0.72", "end 0.32"],
  });

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const updateHeight = () => setSvgHeight(content.offsetHeight);
    const observer = new ResizeObserver(updateHeight);
    observer.observe(content);
    updateHeight();

    return () => observer.disconnect();
  }, []);

  const beamEnd = Math.max(40, svgHeight);
  const beamTail = Math.max(40, svgHeight - 170);
  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.82], [40, beamEnd]), {
    stiffness: 500,
    damping: 90,
  });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [40, beamTail]), {
    stiffness: 500,
    damping: 90,
  });

  return (
    <motion.div ref={rootRef} className={cn("tracing-beam", className)}>
      <div className="tracing-beam__rail" aria-hidden="true">
        <span className="tracing-beam__origin"><i /></span>
        <svg viewBox={`0 0 20 ${svgHeight}`} width="20" height={svgHeight}>
          <path
            className="tracing-beam__base"
            d={`M 10 0 V ${svgHeight}`}
            fill="none"
            stroke="var(--tracing-beam-base, #9091a0)"
            strokeOpacity="0.32"
          />
          {!shouldReduceMotion && (
            <motion.path
              className="tracing-beam__active"
              d={`M 10 0 V ${svgHeight}`}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="1.5"
            />
          )}
          <defs>
            <motion.linearGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor="var(--tracing-beam-start, #18ccfc)" stopOpacity="0" />
              <stop stopColor="var(--tracing-beam-start, #18ccfc)" />
              <stop offset="0.325" stopColor="var(--tracing-beam-middle, #6344f5)" />
              <stop offset="1" stopColor="var(--tracing-beam-end, #ae48ff)" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef} className="tracing-beam__content">{children}</div>
    </motion.div>
  );
}
