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
      <OrbitalGallery
        photos={photos}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
        className="my-6 sm:my-8"
      />

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
                  priority
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
