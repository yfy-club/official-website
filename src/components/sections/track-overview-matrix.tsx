"use client";

import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CardCorners } from "@/components/ui/card";
import type { Track } from "@/content/schema";

export function TrackOverviewMatrix({ tracks }: { tracks: readonly Track[] }) {
  return (
    <div className="track-matrix-wrapper" data-reveal="group">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4 mb-5">
        {tracks.map((track) => {
          const coreTech = [
            ...track.stack.languages.slice(0, 2),
            ...track.stack.frameworks.slice(0, 2),
          ];

          return (
            <Link
              key={track.slug}
              href={`/tracks/${track.slug}`}
              className="group relative flex flex-col justify-between p-5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-xs transition-all overflow-hidden"
            >
              <CardCorners />
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="font-mono text-xs font-semibold text-[var(--accent)]">
                    0{track.index} {"//"} TRK
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-strong)] group-hover:bg-[var(--accent)] transition-colors" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--fg)] tracking-tight mb-1 group-hover:text-[var(--accent)] transition-colors">
                  {track.nameZh}
                </h3>
                <p className="font-mono text-[11px] text-[var(--fg-faint)] tracking-wider uppercase mb-3">
                  {track.nameEn}
                </p>
                <p className="text-xs text-[var(--fg-muted)] leading-relaxed mb-5 line-clamp-2">
                  {track.tagline}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {coreTech.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center px-1.5 py-0.5 rounded-[var(--radius-2xs)] font-mono text-[10px] bg-[var(--surface-2)] text-[var(--fg-muted)] border border-[var(--border)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-xs font-mono font-medium text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors pt-2.5 border-t border-[var(--border)]">
                  <span>路线与详情</span>
                  <ArrowRight size={13} className="ml-auto transform group-hover:translate-x-0.5 transition-transform text-[var(--accent)]" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between p-4 px-5 sm:px-6 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)]/40 gap-3.5">
        <div className="flex items-center gap-3 text-xs sm:text-sm text-[var(--fg-muted)]">
          <Compass size={16} className="text-[var(--accent)] shrink-0" />
          <span>五大技术方向均配备完整的大一至大三阶梯进阶路线与师徒带学机制</span>
        </div>
        <Button asChild variant="ghost" size="sm" className="w-full sm:w-auto shrink-0 font-mono text-xs h-8 px-3 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]">
          <Link href="/tracks">
            <span>探索技术拓扑中枢</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
