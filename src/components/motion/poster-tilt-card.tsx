"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { type PointerEvent, useCallback, useRef, useState } from "react";

export interface PosterItem {
  src: string;
  label: string;
  description?: string;
}

export interface PosterTiltProps {
  posters: readonly PosterItem[];
}

function SingleTiltCard({
  poster,
  index,
  onOpen,
}: {
  poster: PosterItem;
  index: number;
  onOpen: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);

  const handlePointerMove = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    x.set(relX - 0.5);
    y.set(relY - 0.5);
    glareX.set(relX * 100);
    glareY.set(relY * 100);
    glareOpacity.set(0.3);
  }, [x, y, glareX, glareY, glareOpacity]);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    glareOpacity.set(0);
  }, [x, y, glareOpacity]);

  return (
    <button
      type="button"
      ref={cardRef}
      className="poster-tilt"
      aria-haspopup="dialog"
      onClick={onOpen}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      data-hovered={isHovered ? "true" : undefined}
    >
      <motion.div
        className="poster-tilt__inner"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="poster-tilt__media">
          <Image
            src={poster.src}
            alt={poster.label}
            width={900}
            height={1350}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 35vw"
            className="poster-tilt__img"
          />
          <motion.div
            className="poster-tilt__glare"
            style={{
              background: useTransform(
                [glareX, glareY, glareOpacity],
                ([gx, gy, op]) =>
                  `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, ${op}) 0%, transparent 65%)`,
              ),
            }}
          />
        </div>
        <div className="poster-tilt__footer">
          <span className="caps tabular">[ POSTER 0{index + 1} ]</span>
          <strong>{poster.label}</strong>
        </div>
      </motion.div>
    </button>
  );
}

export function PosterTiltCard({ posters }: PosterTiltProps) {
  const [selectedPoster, setSelectedPoster] = useState<PosterItem | null>(null);

  return (
    <DialogPrimitive.Root
      open={selectedPoster !== null}
      onOpenChange={(open) => {
        if (!open) setSelectedPoster(null);
      }}
    >
      <div className="poster-tilt-grid" data-reveal="group">
        {posters.map((poster, index) => (
          <SingleTiltCard
            key={poster.src}
            poster={poster}
            index={index}
            onOpen={() => setSelectedPoster(poster)}
          />
        ))}
      </div>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="dialog__overlay" />
        {selectedPoster && (
          <DialogPrimitive.Content className="dialog__content" aria-describedby={undefined}>
            <DialogPrimitive.Title className="dialog__title">
              {selectedPoster.label}
            </DialogPrimitive.Title>
            <div className="dialog__body">
              <div className="poster-tilt__dialog-view">
                <Image
                  src={selectedPoster.src}
                  alt={selectedPoster.label}
                  width={1400}
                  height={2100}
                  sizes="90vw"
                  className="poster-tilt__dialog-img"
                />
              </div>
            </div>
            <DialogPrimitive.Close className="dialog__close" aria-label="关闭">
              <X aria-hidden="true" size={20} />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        )}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
