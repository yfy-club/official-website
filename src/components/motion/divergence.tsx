"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { createRef, useRef, useState } from "react";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Badge } from "@/components/ui/badge";
import { CardCorners } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";
import { ShaderLensBlur, type ShaderVariation } from "@/components/ui/shader-lens-blur";
import { Tag } from "@/components/ui/tag";
import type { Track } from "@/content/schema";

type TracksMapProps = {
  tracks: Track[];
};

const TRACK_SHADER_THEMES: Record<
  string,
  {
    variation: ShaderVariation;
    color1: string;
    color2: string;
    color3: string;
    color4: string;
  }
> = {
  ai: {
    variation: "triangle",
    color1: "#0c0a20",
    color2: "#2e1065",
    color3: "#0d9488",
    color4: "#022c22",
  },
  software: {
    variation: "square",
    color1: "#022c22",
    color2: "#0f766e",
    color3: "#1e293b",
    color4: "#041e16",
  },
  "cloud-iot": {
    variation: "ring",
    color1: "#041e16",
    color2: "#059669",
    color3: "#10b981",
    color4: "#022c22",
  },
  database: {
    variation: "square",
    color1: "#082f49",
    color2: "#0369a1",
    color3: "#064e3b",
    color4: "#022c22",
  },
  industrial: {
    variation: "circle",
    color1: "#1c1917",
    color2: "#78350f",
    color3: "#047857",
    color4: "#022c22",
  },
};

export function TracksMap({ tracks }: TracksMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLSpanElement>(null);
  const targetRefs = useRef(tracks.map(() => createRef<HTMLSpanElement>()));
  const [activeSlug, setActiveSlug] = useState<Track["slug"]>(tracks[0]?.slug ?? "ai");
  const activeTrack = tracks.find((track) => track.slug === activeSlug) ?? tracks[0];

  function selectTrack(slug: Track["slug"]) {
    setActiveSlug(slug);
  }

  function previewTrack(slug: Track["slug"]) {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) selectTrack(slug);
  }

  if (!activeTrack) return null;

  const currentTheme = TRACK_SHADER_THEMES[activeTrack.slug] ?? TRACK_SHADER_THEMES.ai;

  return (
    <Tabs.Root
      className="tracks-console"
      data-active={activeSlug}
      onValueChange={(value) => selectTrack(value as Track["slug"])}
      orientation="vertical"
      value={activeSlug}
    >
      <div ref={containerRef} className="tracks-console__layout">
        <div className="tracks-console__topology">
          <div className="tracks-console__root" aria-label="云飞扬技术方向体系">
            <span className="caps">YFY</span>
            <span ref={rootRef} className="tracks-console__root-node" aria-hidden="true">
              <i />
            </span>
            <span className="caps tabular">ROOT / 05</span>
          </div>

          <aside className="tracks-console__selector" aria-label="技术方向选择">
            <Tabs.List className="tracks-selector" aria-label="选择一个技术方向">
              {tracks.map((track, index) => (
                <Tabs.Trigger
                  className="track-selector"
                  data-track={track.slug}
                  key={track.slug}
                  onFocus={() => selectTrack(track.slug)}
                  onPointerEnter={() => previewTrack(track.slug)}
                  value={track.slug}
                >
                  <span
                    ref={targetRefs.current[index]}
                    className="track-selector__socket"
                    aria-hidden="true"
                  >
                    <i />
                  </span>
                  <span className="track-selector__index tabular">{track.index}</span>
                  <span className="track-selector__label">
                    <strong>{track.nameZh}</strong>
                    <small>{track.nameEn}</small>
                  </span>
                  <ChevronRight className="track-selector__arrow" aria-hidden="true" size={15} />
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </aside>

          {tracks.map((track, index) => {
            const isActive = track.slug === activeSlug;
            return (
              <AnimatedBeam
                className={isActive ? "tracks-beam tracks-beam--active" : "tracks-beam"}
                containerRef={containerRef}
                curvature={(2 - index) * 28}
                delay={index * 0.38}
                duration={isActive ? 2.4 : 5.8}
                endXOffset={0}
                fromRef={rootRef}
                gradientStartColor="var(--accent)"
                gradientStopColor={isActive ? "var(--fg)" : "var(--accent)"}
                key={`${track.slug}-${isActive ? "active" : "idle"}`}
                pathColor={isActive ? "var(--accent)" : "var(--border-control)"}
                pathOpacity={isActive ? 0.78 : 0.4}
                pathWidth={isActive ? 1.5 : 1}
                repeatDelay={isActive ? 0.2 : 0.9}
                startXOffset={22}
                toRef={targetRefs.current[index]}
              />
            );
          })}
        </div>

        <MagicCard
          className="tracks-detail"
          gradientColor="var(--accent-quiet)"
          gradientFrom="var(--accent)"
          gradientOpacity={0.76}
          gradientSize={420}
          gradientTo="var(--border-strong)"
        >
          <ShaderLensBlur
            className="opacity-35 mix-blend-screen transition-opacity duration-500"
            variation={currentTheme.variation}
            color1={currentTheme.color1}
            color2={currentTheme.color2}
            color3={currentTheme.color3}
            color4={currentTheme.color4}
            speed={0.7}
            intensity={0.9}
          />
          <CardCorners />
          {tracks.map((track) => (
            <Tabs.Content className="tracks-detail__panel" key={track.slug} value={track.slug}>
              <header className="tracks-detail__meta">
                <span className="caps tabular">TRK-{track.index} / DOSSIER</span>
                <Badge pulse variant="active">ACTIVE</Badge>
              </header>

              <div className="tracks-detail__body">
                <div className="tracks-detail__identity">
                  <p className="caps">Technical Route {track.index}</p>
                  <h2>{track.nameZh}</h2>
                  <p className="display-latin tracks-detail__en">{track.nameEn}</p>
                  <p className="tracks-detail__positioning">{track.positioning}</p>
                </div>

                <div className="tracks-detail__stack">
                  {[
                    ["Language", track.stack.languages],
                    ["Platform", track.stack.frameworks],
                    ["Engineering", track.stack.engineering],
                  ].map(([label, items]) => (
                    <section key={label as string}>
                      <h3 className="caps">{label as string}</h3>
                      <div className="stack-row">
                        {(items as string[]).map((item) => <Tag key={item}>{item}</Tag>)}
                      </div>
                    </section>
                  ))}
                </div>
              </div>

              <footer className="tracks-detail__footer">
                <span><small>目标岗位</small>{track.goal}</span>
                <Link className="tracks-detail__route track-panel" href={`/tracks/${track.slug}`}>
                  查看方向详情 <ArrowRight aria-hidden="true" size={17} />
                </Link>
              </footer>
            </Tabs.Content>
          ))}
        </MagicCard>
      </div>
    </Tabs.Root>
  );
}
