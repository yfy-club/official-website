"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type TransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void> | void) => unknown;
};

export function RouteTransitions() {
  const pathname = usePathname();
  const router = useRouter();
  const finishNavigation = useRef<null | (() => void)>(null);

  useEffect(() => {
    finishNavigation.current?.();
    finishNavigation.current = null;
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname || url.hash) return;

      const documentWithTransition = document as TransitionDocument;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!documentWithTransition.startViewTransition || reduce) return;

      event.preventDefault();
      documentWithTransition.startViewTransition(
        () => new Promise<void>((resolve) => {
          finishNavigation.current = resolve;
          router.push(`${url.pathname}${url.search}${url.hash}`);
        }),
      );
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
