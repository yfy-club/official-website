"use client";

import { useEffect, useRef } from "react";

export interface WorkTourObserverProps {
  groupIds: string[];
}

export function WorkTourObserver({ groupIds }: WorkTourObserverProps) {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const root = markerRef.current?.closest<HTMLElement>(".work-tour");
    if (!root) {
      return;
    }

    const groupElements = groupIds
      .map((id) => root.querySelector<HTMLElement>(`#${id}`))
      .filter((el): el is HTMLElement => el !== null);

    if (groupElements.length === 0) {
      return;
    }

    const navLinks = Array.from(
      root.querySelectorAll<HTMLAnchorElement>(".work-tour__nav-link"),
    );

    function setActiveGroup(id: string) {
      for (const link of navLinks) {
        if (link.getAttribute("data-group-id") === id) {
          link.setAttribute("aria-current", "location");
          link.setAttribute("data-active", "true");
        } else {
          link.removeAttribute("aria-current");
          link.removeAttribute("data-active");
        }
      }
    }

    const visibleGroups = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleGroups.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleGroups.delete(entry.target.id);
          }
        }

        if (visibleGroups.size > 0) {
          // Pick the topmost visible group in DOM order
          for (const el of groupElements) {
            if (visibleGroups.has(el.id)) {
              setActiveGroup(el.id);
              break;
            }
          }
        }
      },
      {
        rootMargin: "-15% 0px -40% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    for (const el of groupElements) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [groupIds]);

  return <span ref={markerRef} style={{ display: "none" }} aria-hidden="true" />;
}
