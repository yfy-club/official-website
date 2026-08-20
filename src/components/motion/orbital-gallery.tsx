"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface OrbitalPhotoItem {
  src: string;
  alt: string;
  caption: string;
  orientation?: "portrait" | "landscape";
  tag?: string;
}

export interface OrbitalGalleryProps {
  photos: readonly OrbitalPhotoItem[];
  onSelectPhoto?: (photo: OrbitalPhotoItem) => void;
  className?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function OrbitalGallery({
  photos,
  onSelectPhoto,
  className,
}: OrbitalGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const titleViewportRef = useRef<HTMLDivElement>(null);
  const titleTrackRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(1200);
  const [isMobile, setIsMobile] = useState(false);

  const count = photos.length;

  // Responsive width tracking
  useEffect(() => {
    const updateSize = () => {
      if (viewportRef.current) {
        const w = viewportRef.current.clientWidth || window.innerWidth;
        setContainerWidth(w);
        setIsMobile(w < 768);
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (viewportRef.current) observer.observe(viewportRef.current);
    window.addEventListener("resize", updateSize, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  // Geometry configuration (tastefully tuned dimensions)
  const itemWidth = isMobile ? 205 : 280;
  const itemHeight = isMobile ? 280 : 380;
  const wheelViewportHeight = isMobile ? 380 : 500;
  const paddingTop = isMobile ? 18 : 26;

  // True circular radius and angular spacing
  const radius = isMobile
    ? clamp(containerWidth * 1.35, 500, 720)
    : clamp(containerWidth * 0.9, 800, 1150);

  const angularSpacingDeg = isMobile ? 24 : 16.5;
  const angularSpacingRad = (angularSpacingDeg * Math.PI) / 180;

  // Center card vertical position
  const centerCardY = paddingTop + itemHeight / 2;
  // Center of the circular orbit
  const orbitCenterY = centerCardY + radius;

  // Continuous progress tracking with responsive spring
  const targetProgress = useMotionValue(0);
  const smoothProgress = useSpring(targetProgress, {
    stiffness: 260,
    damping: 28,
    mass: 0.55,
  });

  const [renderProgress, setRenderProgress] = useState(0);

  useEffect(() => {
    return smoothProgress.on("change", (latest) => {
      setRenderProgress(latest);
    });
  }, [smoothProgress]);

  // Navigate to photo index
  const goToIndex = useCallback(
    (index: number) => {
      if (count === 0) return;
      const targetIdx = clamp(index, 0, count - 1);
      setActiveIndex(targetIdx);
      targetProgress.set(targetIdx);
    },
    [count, targetProgress]
  );

  const handlePrev = useCallback(() => {
    goToIndex(activeIndex > 0 ? activeIndex - 1 : count - 1);
  }, [activeIndex, count, goToIndex]);

  const handleNext = useCallback(() => {
    goToIndex(activeIndex < count - 1 ? activeIndex + 1 : 0);
  }, [activeIndex, count, goToIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Mouse Wheel Navigation (Ultra-responsive Notch & Gesture handling)
  const wheelAccumulatorRef = useRef(0);
  const lastWheelTimeRef = useRef(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || count === 0) return;

    const handleWheel = (e: WheelEvent) => {
      const rawDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(rawDelta) < 1.5) return;

      e.preventDefault();

      const now = performance.now();
      const timeSinceLast = now - lastWheelTimeRef.current;

      // Reset accumulator if user paused between scrolls
      if (timeSinceLast > 220) {
        wheelAccumulatorRef.current = 0;
      }
      lastWheelTimeRef.current = now;

      wheelAccumulatorRef.current += rawDelta;

      // Light threshold: a single gentle wheel notch immediately triggers a smooth step
      const stepThreshold = 25;

      if (wheelAccumulatorRef.current >= stepThreshold) {
        goToIndex(Math.min(count - 1, activeIndex + 1));
        wheelAccumulatorRef.current = 0;
      } else if (wheelAccumulatorRef.current <= -stepThreshold) {
        goToIndex(Math.max(0, activeIndex - 1));
        wheelAccumulatorRef.current = 0;
      }
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      viewport.removeEventListener("wheel", handleWheel);
    };
  }, [count, goToIndex, activeIndex]);

  // Touch / Mouse Drag handlers with proper click differentiation
  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const startProgressRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    startProgressRef.current = targetProgress.get();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;

    // Only treat as drag when pointer moves past threshold
    if (!hasDraggedRef.current && Math.abs(deltaX) > 6) {
      hasDraggedRef.current = true;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }

    if (hasDraggedRef.current) {
      const dragSensitivity = isMobile ? 120 : 160;
      const progressDelta = -deltaX / dragSensitivity;
      targetProgress.set(clamp(startProgressRef.current + progressDelta, -0.5, count - 0.5));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    if (hasDraggedRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      const currentP = targetProgress.get();
      const nearestIndex = clamp(Math.round(currentP), 0, count - 1);
      goToIndex(nearestIndex);

      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 80);
    }
  };

  // Center active title pill in title track
  useEffect(() => {
    const viewport = titleViewportRef.current;
    const track = titleTrackRef.current;
    if (!viewport || !track) return;

    const activePill = track.querySelector<HTMLElement>(
      `[data-title-index="${activeIndex}"]`
    );
    if (!activePill) return;

    const viewportCenter = viewport.clientWidth / 2;
    const pillCenter = activePill.offsetLeft + activePill.offsetWidth / 2;
    const targetScrollX = pillCenter - viewportCenter;

    track.scrollTo({
      left: Math.max(0, targetScrollX),
      behavior: "smooth",
    });
  }, [activeIndex]);

  const currentPhoto = photos[activeIndex] || photos[0];

  return (
    <div
      ref={containerRef}
      className={cn(
        "orbital-image-wheel relative w-full overflow-hidden select-none flex flex-col items-center",
        className
      )}
      role="region"
      aria-label="团队文化实拍弧形轮盘"
    >
      {/* Viewport frame holding the massive circular wheel */}
      <div
        ref={viewportRef}
        className="relative w-full overflow-hidden flex justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{ height: wheelViewportHeight }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Subtle circular background guide ring */}
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full border border-dashed border-[var(--border-strong)] opacity-30"
          style={{
            width: radius * 2,
            height: radius * 2,
            top: orbitCenterY - radius,
          }}
          aria-hidden="true"
        />

        {/* Circular Cards Container */}
        <div
          className="relative w-full h-full"
          style={{ perspective: "1200px" }}
        >
          {photos.map((photo, i) => {
            // Delta distance from current continuous progress
            const delta = i - renderProgress;
            const absDelta = Math.abs(delta);

            // True circular trigonometry
            const thetaRad = delta * angularSpacingRad;
            const x = Math.sin(thetaRad) * radius;
            const y = orbitCenterY - Math.cos(thetaRad) * radius;
            const tiltDeg = (thetaRad * 180) / Math.PI; // Tangent angle of circle

            // Focus intensity
            const focusIntensity = clamp(absDelta, 0, 1);
            const isCenterFocus = absDelta < 0.35;

            // Visual effects matching official spec
            const currentBlur = clamp(focusIntensity * 4.2, 0, 5);
            const peakBrightness = 110;
            const minBrightness = 45;
            const currentBrightness =
              minBrightness + (1 - focusIntensity) * (peakBrightness - minBrightness);
            const currentSaturation = 55 + (1 - focusIntensity * 0.55) * 45;
            const currentScale = 1 - clamp(absDelta * 0.07, 0, 0.2);
            const depth = clamp((1 - focusIntensity) * 80, 0, 80);
            const zIndex = Math.round(100 - absDelta * 15);

            // Hide cards that are too far offscreen
            if (absDelta > 3.6) return null;

            return (
              <div
                key={photo.src}
                className={cn(
                  "oiw-item absolute left-1/2 overflow-hidden rounded-[var(--radius-sm)] border select-none",
                  isCenterFocus
                    ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/35 shadow-2xl cursor-zoom-in"
                    : "border-[var(--border-strong)] hover:border-[var(--fg-muted)] shadow-xl cursor-pointer"
                )}
                style={{
                  width: itemWidth,
                  height: itemHeight,
                  top: 0,
                  transform: `translate3d(calc(-50% + ${x}px), calc(${y - itemHeight / 2}px), ${depth}px) rotate(${tiltDeg}deg) scale(${currentScale})`,
                  filter: `blur(${currentBlur}px) brightness(${currentBrightness}%) saturate(${currentSaturation}%)`,
                  zIndex,
                  willChange: "transform, filter",
                  transition: hasDraggedRef.current
                    ? "none"
                    : "border-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={(e) => {
                  if (hasDraggedRef.current) return;
                  e.stopPropagation();
                  goToIndex(i);
                  onSelectPhoto?.(photo);
                }}
              >
                <div className="relative w-full h-full bg-[var(--surface-2)]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 60vw, 360px"
                    className="object-cover object-center pointer-events-none"
                    priority={i <= 2}
                  />

                  {/* Dark Vignette Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />

                  {/* Badge in Top Right */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-[var(--radius-xs)] border border-white/20 bg-black/55 backdrop-blur-xs font-mono text-[10px] text-white">
                    0{i + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Centered Dynamic Captions & Scrolling Title Pill Track */}
      <div className="relative z-30 w-full max-w-3xl px-4 flex flex-col items-center text-center mt-2">
        {/* Horizontal Scrolling Centered Title Track */}
        <div
          ref={titleViewportRef}
          className="relative w-full overflow-x-auto no-scrollbar py-2"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          }}
        >
          <div
            ref={titleTrackRef}
            className="flex items-center gap-2.5 w-max px-[35vw] sm:px-[40vw]"
          >
            {photos.map((photo, i) => {
              const isCur = i === activeIndex;
              return (
                <button
                  type="button"
                  key={photo.src}
                  data-title-index={i}
                  onClick={() => goToIndex(i)}
                  className={cn(
                    "oiw-title-item shrink-0 inline-flex items-center justify-center whitespace-nowrap rounded-full border px-5 py-2 text-center text-sm sm:text-base font-medium tracking-tight transition-all duration-300 cursor-pointer shadow-xs",
                    isCur
                      ? "border-[var(--accent)] bg-[var(--surface)] text-[var(--fg)] shadow-md scale-105"
                      : "border-[var(--border)] bg-[var(--surface-2)]/60 text-[var(--fg-muted)] opacity-50 hover:opacity-85 hover:border-[var(--border-strong)]"
                  )}
                >
                  {photo.caption}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subtitle description */}
        <p className="text-xs sm:text-sm text-[var(--fg-muted)] mt-2 max-w-lg line-clamp-2">
          {currentPhoto.alt}
        </p>

        {/* Navigation buttons (Coss UI icon button style) */}
        <div className="flex items-center gap-4 mt-5">
          <button
            type="button"
            onClick={handlePrev}
            className="size-8.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] active:scale-95 active:bg-[var(--surface-2)] shadow-xs transition-all duration-150 inline-flex items-center justify-center cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="上一张"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex items-center gap-1.5 px-2" aria-hidden="true">
            {photos.map((_, dotIdx) => (
              <button
                type="button"
                key={dotIdx}
                onClick={() => goToIndex(dotIdx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                  dotIdx === activeIndex
                    ? "w-5 bg-[var(--accent)]"
                    : "w-1.5 bg-[var(--border-strong)] hover:bg-[var(--fg-muted)]"
                )}
                aria-label={`切换到第 ${dotIdx + 1} 张`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="size-8.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] active:scale-95 active:bg-[var(--surface-2)] shadow-xs transition-all duration-150 inline-flex items-center justify-center cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="下一张"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
