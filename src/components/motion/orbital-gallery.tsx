"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useSpring } from "motion/react";
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

export function OrbitalGallery({
  photos,
  onSelectPhoto,
  className,
}: OrbitalGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport, { passive: true });
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const count = photos.length;
  const activeMotionIndex = useMotionValue(0);
  const smoothIndex = useSpring(activeMotionIndex, {
    stiffness: 220,
    damping: 28,
    mass: 0.6,
  });

  const setIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(count - 1, index));
      setActiveIndex(clamped);
      activeMotionIndex.set(clamped);
    },
    [count, activeMotionIndex]
  );

  const handlePrev = useCallback(() => {
    setIndex(activeIndex > 0 ? activeIndex - 1 : count - 1);
  }, [activeIndex, count, setIndex]);

  const handleNext = useCallback(() => {
    setIndex(activeIndex < count - 1 ? activeIndex + 1 : 0);
  }, [activeIndex, count, setIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
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

  // Drag handling
  const dragX = useMotionValue(0);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    let target = activeIndex;
    if (offset < -40 || velocity < -300) {
      target = Math.min(count - 1, activeIndex + 1);
    } else if (offset > 40 || velocity > 300) {
      target = Math.max(0, activeIndex - 1);
    }

    setIndex(target);
    animate(dragX, 0, { duration: 0.2 });
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  };

  const currentPhoto = photos[activeIndex] || photos[0];

  // Dynamic geometry parameters
  const itemWidth = isMobile ? 220 : 280;
  const itemHeight = isMobile ? 300 : 380;
  const itemSpacing = isMobile ? 180 : 250;
  const arcHeight = isMobile ? 22 : 44;
  const tiltAngle = isMobile ? 5 : 8.5;

  return (
    <div
      ref={containerRef}
      className={cn(
        "orbital-gallery relative w-full overflow-hidden pt-4 pb-8 select-none flex flex-col items-center",
        className
      )}
      role="region"
      aria-label="团队文化实拍弧形展台"
    >
      {/* Background Subtle Ambient Arc Blueprint Guide */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[500px] flex items-center justify-center opacity-30"
        aria-hidden="true"
      >
        <div className="w-[1200px] h-[600px] rounded-[50%] border border-dashed border-[var(--border-strong)] opacity-40 -translate-y-12" />
        <div className="w-[800px] h-[400px] rounded-[50%] border border-[var(--border)] opacity-25 -translate-y-12" />
      </div>

      {/* Main Wheel Carousel Stage */}
      <motion.div
        className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{
          height: isMobile ? 340 : 430,
          perspective: 1200,
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.22}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={handleDragEnd}
      >
        {photos.map((photo, i) => {
          return (
            <OrbitalCard
              key={photo.src}
              index={i}
              smoothIndex={smoothIndex}
              itemWidth={itemWidth}
              itemHeight={itemHeight}
              itemSpacing={itemSpacing}
              arcHeight={arcHeight}
              tiltAngle={tiltAngle}
              reducedMotion={reducedMotion}
              photo={photo}
              isActive={i === activeIndex}
              onClick={() => {
                if (isDraggingRef.current) return;
                if (i === activeIndex) {
                  onSelectPhoto?.(photo);
                } else {
                  setIndex(i);
                }
              }}
            />
          );
        })}
      </motion.div>

      {/* Active Caption & Meta HUD */}
      <div className="relative z-30 mt-6 flex flex-col items-center text-center max-w-xl px-4">
        {/* Badge & Index */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)]/85 backdrop-blur-md text-xs font-mono text-[var(--fg-muted)] shadow-xs mb-3">
          <span className="flex items-center gap-1.5 text-[var(--accent)] font-semibold">
            <Sparkles size={12} />
            <span>{`0${activeIndex + 1} // 0${count}`}</span>
          </span>
          <span className="h-3 w-px bg-[var(--border)]" />
          <span>{currentPhoto.tag ?? "Field Log"}</span>
        </div>

        {/* Dynamic Animated Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-[var(--fg)] tracking-tight mb-1.5 transition-all duration-300">
          {currentPhoto.caption}
        </h3>

        {/* Subtitle / Alt description */}
        <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed max-w-md line-clamp-2">
          {currentPhoto.alt}
        </p>

        {/* Navigation Controls & Pagination Indicators */}
        <div className="flex items-center gap-4 mt-6">
          {/* Prev button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            className="h-9 px-3.5 border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] rounded-[var(--radius-xs)] font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer shadow-2xs"
            aria-label="查看上一张照片"
          >
            <ArrowLeft size={14} className="mr-1.5" />
            <span>PREV</span>
          </Button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 px-2" aria-hidden="true">
            {photos.map((_, dotIdx) => (
              <button
                type="button"
                key={dotIdx}
                onClick={() => setIndex(dotIdx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                  dotIdx === activeIndex
                    ? "w-6 bg-[var(--accent)]"
                    : "w-1.5 bg-[var(--border-strong)] hover:bg-[var(--fg-muted)]"
                )}
                aria-label={`切换到第 ${dotIdx + 1} 张照片`}
              />
            ))}
          </div>

          {/* Next button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleNext}
            className="h-9 px-3.5 border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] rounded-[var(--radius-xs)] font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer shadow-2xs"
            aria-label="查看下一张照片"
          >
            <span>NEXT</span>
            <ArrowRight size={14} className="ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface OrbitalCardProps {
  index: number;
  smoothIndex: ReturnType<typeof useSpring>;
  itemWidth: number;
  itemHeight: number;
  itemSpacing: number;
  arcHeight: number;
  tiltAngle: number;
  reducedMotion: boolean;
  photo: OrbitalPhotoItem;
  isActive: boolean;
  onClick: () => void;
}

function OrbitalCard({
  index,
  smoothIndex,
  itemWidth,
  itemHeight,
  itemSpacing,
  arcHeight,
  tiltAngle,
  reducedMotion,
  photo,
  isActive,
  onClick,
}: OrbitalCardProps) {
  const [styleState, setStyleState] = useState<{
    x: number;
    y: number;
    rotateZ: number;
    rotateY: number;
    scale: number;
    opacity: number;
    blur: number;
    brightness: number;
    zIndex: number;
  }>({
    x: (index - 0) * itemSpacing,
    y: 0,
    rotateZ: 0,
    rotateY: 0,
    scale: 1,
    opacity: 1,
    blur: 0,
    brightness: 1,
    zIndex: 50,
  });

  useEffect(() => {
    return smoothIndex.on("change", (latest) => {
      const delta = index - latest;
      const absDelta = Math.abs(delta);

      if (reducedMotion) {
        setStyleState({
          x: delta * itemSpacing,
          y: 0,
          rotateZ: 0,
          rotateY: 0,
          scale: 1 - Math.min(absDelta * 0.1, 0.3),
          opacity: Math.max(0.3, 1 - absDelta * 0.25),
          blur: 0,
          brightness: Math.max(0.6, 1 - absDelta * 0.2),
          zIndex: 50 - Math.round(absDelta * 5),
        });
        return;
      }

      // Parabolic Arc Geometry
      const x = delta * itemSpacing;
      const y = Math.pow(absDelta, 1.55) * arcHeight;
      const rotateZ = delta * tiltAngle;
      const rotateY = delta * -7;
      const scale = 1 - Math.min(absDelta * 0.12, 0.38);
      const opacity = Math.max(0.2, 1 - absDelta * 0.28);
      const blur = Math.min(absDelta * 2.5, 6);
      const brightness = Math.max(0.45, 1 - absDelta * 0.32);
      const zIndex = 50 - Math.round(absDelta * 5);

      setStyleState({
        x,
        y,
        rotateZ,
        rotateY,
        scale,
        opacity,
        blur,
        brightness,
        zIndex,
      });
    });
  }, [index, smoothIndex, itemSpacing, arcHeight, tiltAngle, reducedMotion]);

  const isVisible = Math.abs(index - smoothIndex.get()) < 3.8;
  if (!isVisible) return null;

  return (
    <motion.div
      className={cn(
        "orbital-card absolute top-1/2 left-1/2 rounded-[var(--radius-sm)] overflow-hidden cursor-pointer",
        "border transition-colors duration-300",
        isActive
          ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30 shadow-2xl"
          : "border-[var(--border-strong)] hover:border-[var(--fg-muted)] shadow-md"
      )}
      style={{
        width: itemWidth,
        height: itemHeight,
        x: `calc(-50% + ${styleState.x}px)`,
        y: `calc(-50% + ${styleState.y}px)`,
        rotateZ: styleState.rotateZ,
        rotateY: styleState.rotateY,
        scale: styleState.scale,
        opacity: styleState.opacity,
        zIndex: styleState.zIndex,
        filter: `blur(${styleState.blur}px) brightness(${styleState.brightness})`,
        willChange: "transform, filter, opacity",
      }}
      onClick={onClick}
      whileHover={{
        scale: isActive ? 1.025 : styleState.scale * 1.04,
        transition: { duration: 0.2 },
      }}
    >
      <div className="relative w-full h-full bg-[var(--surface-2)]">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 768px) 60vw, 320px"
          className="object-cover object-center pointer-events-none select-none"
          priority={index <= 2}
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

        {/* Index Pill in Top Right */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-[var(--radius-xs)] border border-white/20 bg-black/50 backdrop-blur-xs font-mono text-[10px] text-white">
          0{index + 1}
        </div>

        {/* Active Focus Hint in Bottom Center */}
        {isActive && (
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[var(--accent)]/60 text-[11px] font-mono text-[var(--accent)] shadow-lg animate-in fade-in zoom-in-95 duration-200">
              <Expand size={12} />
              <span>点击查看大图</span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
