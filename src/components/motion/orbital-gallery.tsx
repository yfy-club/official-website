"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "motion/react";
import { ArrowLeft, ArrowRight, Expand, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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

function shortestAngleDistance(a: number, b: number) {
  const full = Math.PI * 2;
  const raw = ((a - b + Math.PI) % full) - Math.PI;
  const normalized = raw < -Math.PI ? raw + full : raw;
  return Math.abs(normalized);
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
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const startRotationRef = useRef(0);

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

  // Geometry configuration (aligning with official spec)
  const responsiveWheelSize = isMobile
    ? clamp(containerWidth * 1.85, 750, 1100)
    : clamp(containerWidth * 1.55, 1300, 2200);
  const radius = responsiveWheelSize / 2;
  const cropRatio = isMobile ? 0.72 : 0.74;
  const itemWidth = isMobile ? 210 : 270;
  const itemHeight = isMobile ? 290 : 370;
  const focusArc = Math.PI * 0.38;
  const topAnchor = -Math.PI / 2;

  // Continuous rotation angle in radians
  const targetRotation = useMotionValue(0);
  const smoothRotation = useSpring(targetRotation, {
    stiffness: 180,
    damping: 26,
    mass: 0.7,
  });

  const [renderRotation, setRenderRotation] = useState(0);

  useEffect(() => {
    return smoothRotation.on("change", (latest) => {
      setRenderRotation(latest);
    });
  }, [smoothRotation]);

  // Rotate to specific photo index
  const rotateToIndex = useCallback(
    (index: number) => {
      if (count === 0) return;
      const targetIdx = clamp(index, 0, count - 1);
      setActiveIndex(targetIdx);

      // Target angle such that targetIdx is at topAnchor (-PI / 2)
      // theta = (targetIdx / count) * 2 * PI - PI / 2 + rot = -PI / 2 => rot = - (targetIdx / count) * 2 * PI
      const baseTarget = -(targetIdx / count) * Math.PI * 2;
      const currentRot = targetRotation.get();
      const fullTurn = Math.PI * 2;

      // Find nearest rotational equivalent
      const diff = ((baseTarget - currentRot + Math.PI) % fullTurn) - Math.PI;
      const normalizedDiff = diff < -Math.PI ? diff + fullTurn : diff;
      targetRotation.set(currentRot + normalizedDiff);
    },
    [count, targetRotation]
  );

  const handlePrev = useCallback(() => {
    rotateToIndex(activeIndex > 0 ? activeIndex - 1 : count - 1);
  }, [activeIndex, count, rotateToIndex]);

  const handleNext = useCallback(() => {
    rotateToIndex(activeIndex < count - 1 ? activeIndex + 1 : 0);
  }, [activeIndex, count, rotateToIndex]);

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

  // Touch / Mouse Drag handlers for rotating the wheel
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    startRotationRef.current = targetRotation.get();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    // Map horizontal pixel drag to angular rotation
    const angleDelta = (deltaX / radius) * 1.1;
    targetRotation.set(startRotationRef.current + angleDelta);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // Snap to closest card
    const currentRot = targetRotation.get();
    const phaseRaw = (-currentRot / (Math.PI * 2)) * count;
    const nearestIndex = ((Math.round(phaseRaw) % count) + count) % count;
    rotateToIndex(nearestIndex);
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
        className="relative w-full overflow-hidden flex justify-center"
        style={{ height: isMobile ? 420 : 520 }}
      >
        {/* Subtle circular background guide ring */}
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full border border-dashed border-[var(--border-strong)] opacity-30"
          style={{
            width: responsiveWheelSize,
            height: responsiveWheelSize,
            bottom: `-${responsiveWheelSize * cropRatio}px`,
          }}
          aria-hidden="true"
        />

        {/* The Wheel Center (anchored below the viewport) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing touch-pan-y"
          style={{
            width: responsiveWheelSize,
            height: responsiveWheelSize,
            bottom: `-${responsiveWheelSize * cropRatio}px`,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className="relative h-full w-full"
            style={{ perspective: "1200px" }}
          >
            {photos.map((photo, i) => {
              // Base angle for this card
              const baseAngle = (i / count) * Math.PI * 2 - Math.PI / 2;
              const theta = baseAngle + renderRotation;
              const x = Math.cos(theta) * radius;
              const y = Math.sin(theta) * radius;

              const distanceToFocus = shortestAngleDistance(theta, topAnchor);
              const focusIntensity = clamp(distanceToFocus / focusArc, 0, 1);
              const darkIntensity = clamp(focusIntensity * 1.05, 0, 1);

              const currentBlur = darkIntensity * 4.5;
              const peakBrightness = 115;
              const minBrightness = 40;
              const currentBrightness =
                minBrightness +
                (1 - darkIntensity) * (peakBrightness - minBrightness);
              const currentSaturation = 55 + (1 - darkIntensity * 0.6) * 45;
              const currentScale = 1 - darkIntensity * 0.08;
              const drift = clamp(x / radius, -1, 1);
              const tilt = drift * 8.5;
              const depth = clamp((1 - focusIntensity) * 100, 0, 100);
              const zIndex = Math.round(depth);
              const isCenterFocus = distanceToFocus < 0.25;

              return (
                <div
                  key={photo.src}
                  className={cn(
                    "oiw-item absolute left-1/2 top-1/2 overflow-hidden rounded-[var(--radius-sm)] border cursor-pointer select-none",
                    isCenterFocus
                      ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/35 shadow-2xl"
                      : "border-[var(--border-strong)] hover:border-[var(--fg-muted)] shadow-xl"
                  )}
                  style={{
                    width: itemWidth,
                    height: itemHeight,
                    transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${depth}px) rotate(${tilt}deg) scale(${currentScale})`,
                    filter: `blur(${currentBlur}px) brightness(${currentBrightness}%) saturate(${currentSaturation}%)`,
                    zIndex,
                    willChange: "transform, filter",
                    transition: isDraggingRef.current
                      ? "none"
                      : "border-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onClick={() => {
                    if (isCenterFocus) {
                      onSelectPhoto?.(photo);
                    } else {
                      rotateToIndex(i);
                    }
                  }}
                >
                  <div className="relative w-full h-full bg-[var(--surface-2)]">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 768px) 60vw, 320px"
                      className="object-cover object-center pointer-events-none"
                      priority={i <= 2}
                    />

                    {/* Dark Vignette Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />

                    {/* Badge in Top Right */}
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-[var(--radius-xs)] border border-white/20 bg-black/55 backdrop-blur-xs font-mono text-[10px] text-white">
                      0{i + 1}
                    </div>

                    {/* Active Click to View Hint */}
                    {isCenterFocus && (
                      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center pointer-events-none">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[var(--accent)]/70 text-[11px] font-mono text-[var(--accent)] shadow-xl animate-in fade-in zoom-in-95 duration-200">
                          <Expand size={12} />
                          <span>点击查看大图</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Centered Dynamic Captions & Scrolling Title Pill Track */}
      <div className="relative z-30 w-full max-w-3xl px-4 flex flex-col items-center text-center -mt-2">
        {/* Subtitle tag reveal */}
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)]/90 backdrop-blur-md text-[11px] font-mono text-[var(--fg-muted)] shadow-2xs">
            <Sparkles size={11} className="text-[var(--accent)]" />
            <span>{`0${activeIndex + 1} // 0${count} · ${currentPhoto.tag ?? "Field Log"}`}</span>
          </span>
        </div>

        {/* Horizontal Scrolling Centered Title Track (1:1 with official) */}
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
                  onClick={() => rotateToIndex(i)}
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

        {/* Navigation buttons */}
        <div className="flex items-center gap-4 mt-5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            className="h-8 px-3.5 border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] rounded-[var(--radius-xs)] font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer shadow-2xs"
            aria-label="上一张"
          >
            <ArrowLeft size={13} className="mr-1.5" />
            <span>PREV</span>
          </Button>

          <div className="flex items-center gap-1.5 px-2" aria-hidden="true">
            {photos.map((_, dotIdx) => (
              <button
                type="button"
                key={dotIdx}
                onClick={() => rotateToIndex(dotIdx)}
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

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleNext}
            className="h-8 px-3.5 border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] rounded-[var(--radius-xs)] font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer shadow-2xs"
            aria-label="下一张"
          >
            <span>NEXT</span>
            <ArrowRight size={13} className="ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
