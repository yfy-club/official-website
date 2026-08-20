"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { OrbitalGallery, type OrbitalPhotoItem } from "@/components/motion/orbital-gallery";

export type CulturePhotoItem = OrbitalPhotoItem;

export interface CultureGalleryProps {
  photos: readonly CulturePhotoItem[];
}

export function CultureGallery({ photos }: CultureGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<CulturePhotoItem | null>(null);

  return (
    <DialogPrimitive.Root
      open={selectedPhoto !== null}
      onOpenChange={(open) => {
        if (!open) setSelectedPhoto(null);
      }}
    >
      <div className="culture-orbit-stage" data-reveal="section">
        <OrbitalGallery
          photos={photos}
          onSelectPhoto={(photo) => setSelectedPhoto(photo)}
        />
      </div>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="dialog__overlay fixed inset-0 z-50 bg-black/85 backdrop-blur-md animate-in fade-in-0 duration-200" />
        {selectedPhoto && (
          <DialogPrimitive.Content
            className="dialog__content fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-5xl max-h-[92vh] -translate-x-1/2 -translate-y-1/2 flex flex-col rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] p-4 sm:p-6 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200 focus:outline-hidden overflow-hidden"
            aria-describedby={undefined}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] shrink-0">
              <DialogPrimitive.Title className="text-base sm:text-xl font-bold text-[var(--fg)] tracking-tight">
                {selectedPhoto.caption}
              </DialogPrimitive.Title>
              <DialogPrimitive.Close
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)] transition-colors cursor-pointer focus:outline-hidden"
                aria-label="关闭"
              >
                <X aria-hidden="true" size={18} />
              </DialogPrimitive.Close>
            </div>

            <div className="dialog__body relative flex-1 flex flex-col items-center justify-center my-3 overflow-hidden min-h-[300px] max-h-[70vh] rounded-[var(--radius-xs)] bg-black/60 border border-[var(--border)] p-2 sm:p-4">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                width={1600}
                height={1000}
                sizes="90vw"
                className="max-h-[64vh] max-w-full w-auto h-auto object-contain rounded-[var(--radius-xs)] shadow-2xl select-none"
                priority
              />
            </div>

            <p className="text-xs sm:text-sm text-[var(--fg-muted)] pt-2 border-t border-[var(--border)] font-mono">
              {selectedPhoto.caption} · {selectedPhoto.alt}
            </p>
          </DialogPrimitive.Content>
        )}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
