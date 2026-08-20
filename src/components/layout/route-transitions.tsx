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
    if (pathname !== "/works") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
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

      const isReturningToWorksList =
        window.location.pathname.startsWith("/works/") &&
        (url.pathname === "/works" || url.pathname === "/works/");

      // Automatically capture scroll position and flags between /works and /works/[slug]
      try {
        if (window.location.pathname === "/works" && url.pathname.startsWith("/works/")) {
          if (window.scrollY > 0) {
            sessionStorage.setItem("yfy_works_scroll_y", String(window.scrollY));
          }
          sessionStorage.setItem("yfy_works_restore", "true");
          const targetSlug = url.pathname.replace("/works/", "").split("/")[0];
          if (targetSlug) sessionStorage.setItem("yfy_works_last_slug", targetSlug);
        } else if (isReturningToWorksList) {
          sessionStorage.setItem("yfy_works_restore", "true");
          const fromSlug = window.location.pathname.replace("/works/", "").split("/")[0];
          if (fromSlug) sessionStorage.setItem("yfy_works_last_slug", fromSlug);
        }
      } catch {
        // Ignore storage errors
      }

      const documentWithTransition = document as TransitionDocument;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!documentWithTransition.startViewTransition || reduce) {
        if (!isReturningToWorksList) {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
        return;
      }

      event.preventDefault();
      documentWithTransition.startViewTransition(
        () => new Promise<void>((resolve) => {
          finishNavigation.current = resolve;
          // When entering a new page (e.g. detail page), reset scroll to top immediately.
          // When returning to works list, let works-filter-view restore the previous scroll position.
          if (!isReturningToWorksList) {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          }
          router.push(`${url.pathname}${url.search}${url.hash}`, {
            scroll: !isReturningToWorksList,
          });
        }),
      );
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
