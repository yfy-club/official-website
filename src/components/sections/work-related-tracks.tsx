"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { Track } from "@/content/schema";

interface WorkRelatedTracksProps {
  tracks: Track[];
}

const SPRING = { type: "spring" as const, stiffness: 360, damping: 34, mass: 0.8 };

export function WorkRelatedTracks({ tracks }: WorkRelatedTracksProps) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (tracks.length === 0) return null;

  return (
    <div className="track-switchyard" data-reveal="group">
      <div className="track-switchyard__origin">
        <span className="track-switchyard__pulse" aria-hidden="true" />
        <span className="caps">能力映射</span>
        <strong>关联技术航道与研发方向</strong>
      </div>
      <div className="track-switchyard__line" aria-hidden="true" />
      <div className="track-switchyard__routes">
        {tracks.map((track, index) => {
          const isOpen = activeIndex === index;
          const panelId = `related-track-${track.slug}`;
          return (
            <motion.article
              layout={!reduceMotion}
              key={track.slug}
              className="track-route"
              data-open={isOpen || undefined}
              transition={SPRING}
            >
              {isOpen && (
                <motion.span
                  layoutId="track-route-active"
                  className="track-route__active"
                  transition={SPRING}
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                className="track-route__trigger active:scale-[0.98] transition-transform"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setActiveIndex(isOpen ? null : index)}
              >
                <span className="track-route__node tabular">{track.index}</span>
                <span>
                  <strong>{track.nameZh}</strong>
                  <small>{track.nameEn}</small>
                </span>
                <ChevronRight size={17} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    className="track-route__body"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
                    transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
                  >
                    <p>{track.positioning}</p>
                    <Link href={`/tracks/${track.slug}`} className="active:scale-[0.96] transition-transform">
                      进入航道
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
