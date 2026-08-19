"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface CulturePhotoItem {
  src: string;
  alt: string;
  caption: string;
  orientation?: "portrait" | "landscape";
  tag?: string;
}

export interface CultureGalleryProps {
  photos: readonly CulturePhotoItem[];
}

export function CultureGallery({ photos }: CultureGalleryProps) {
  const [hoveredSrc, setHoveredSrc] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<CulturePhotoItem | null>(null);

  return (
    <DialogPrimitive.Root
      open={selectedPhoto !== null}
      onOpenChange={(open) => {
        if (!open) setSelectedPhoto(null);
      }}
    >
      <div
        className="culture-bento"
        data-reveal="group"
        onPointerLeave={() => setHoveredSrc(null)}
      >
        {photos.map((photo, index) => {
          const isDimmed = hoveredSrc !== null && hoveredSrc !== photo.src;
          const isHovered = hoveredSrc === photo.src;

          return (
            <button
              type="button"
              key={photo.src}
              className="culture-bento__card"
              data-orientation={photo.orientation ?? "landscape"}
              data-dimmed={isDimmed ? "true" : undefined}
              data-hovered={isHovered ? "true" : undefined}
              aria-haspopup="dialog"
              onClick={() => setSelectedPhoto(photo)}
              onPointerEnter={() => setHoveredSrc(photo.src)}
            >
              <div className="culture-bento__frame">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="culture-bento__img"
                />
                <div className="culture-bento__overlay" />
                <span className="caps tabular culture-bento__badge">
                  0{index + 1}
                </span>
              </div>
              <div className="culture-bento__caption">
                <span className="culture-bento__caption-title">{photo.caption}</span>
                <span className="caps tabular culture-bento__caption-tag">
                  {photo.tag ?? "Field Log"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="dialog__overlay" />
        {selectedPhoto && (
          <DialogPrimitive.Content className="dialog__content" aria-describedby={undefined}>
            <DialogPrimitive.Title className="dialog__title">
              {selectedPhoto.caption}
            </DialogPrimitive.Title>
            <div className="dialog__body">
              <div className="culture-bento__dialog-view">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  width={1400}
                  height={950}
                  sizes="90vw"
                  className="culture-bento__dialog-img"
                />
                <p className="culture-bento__dialog-caption">
                  {selectedPhoto.caption} · {selectedPhoto.alt}
                </p>
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
