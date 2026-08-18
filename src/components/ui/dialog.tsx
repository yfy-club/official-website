"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Dialog({
  children,
  description,
  title,
  trigger,
}: {
  children: ReactNode;
  description?: string;
  title: string;
  trigger: ReactNode;
}) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="dialog__overlay" />
        <DialogPrimitive.Content
          className="dialog__content"
          {...(!description ? { "aria-describedby": undefined } : {})}
        >
          <DialogPrimitive.Title className="dialog__title">{title}</DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="dialog__description">
              {description}
            </DialogPrimitive.Description>
          )}
          <div className="dialog__body">{children}</div>
          <DialogPrimitive.Close className="dialog__close" aria-label="关闭">
            <X aria-hidden="true" size={20} />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
