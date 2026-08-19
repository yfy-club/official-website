"use client";

import { useCallback, useState } from "react";

export interface UseCopyToClipboardOptions {
  onCopy?: () => void;
  timeout?: number;
}

export function useCopyToClipboard(options?: UseCopyToClipboardOptions) {
  const { onCopy, timeout = 2000 } = options ?? {};
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(
    (value: string) => {
      if (!value || typeof navigator === "undefined" || !navigator.clipboard) return;

      navigator.clipboard
        .writeText(value)
        .then(() => {
          setIsCopied(true);
          onCopy?.();
          if (timeout > 0) {
            setTimeout(() => setIsCopied(false), timeout);
          }
        })
        .catch(() => {
          // Clipboard write failed or permission denied
        });
    },
    [timeout, onCopy]
  );

  return { copyToClipboard, isCopied };
}
