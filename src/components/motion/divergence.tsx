"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArcherContainer, ArcherElement } from "react-archer";

import { Tag } from "@/components/ui/tag";
import { CardBody, CardCorners, CardFooter, CardMeta, cardVariants } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";
import type { Track } from "@/content/schema";
import { cn } from "@/lib/utils";

type TracksMapProps = {
  tracks: Track[];
};

export function TracksMap({ tracks }: TracksMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const beamStartedRef = useRef(false);
  const [beamPaths, setBeamPaths] = useState<string[]>([]);
  const [beamInView, setBeamInView] = useState(false);
  const [beamActive, setBeamActive] = useState(false);
  const relations = tracks.map((track, index) => ({
    targetId: `track-${track.slug}`,
    sourceAnchor: "bottom" as const,
    targetAnchor: "top" as const,
    order: index,
    className: `tracks-connector__route tracks-connector__route--${track.slug}`,
    style: {
      endMarker: false,
      lineStyle: "curve" as const,
    },
  }));

  useEffect(() => {
    let frameId = 0;

    const syncBeamPaths = () => {
      const routePaths = mapRef.current?.querySelectorAll<SVGPathElement>(".tracks-connector__route path");
      if (routePaths?.length !== tracks.length) return;

      const nextPaths = Array.from(routePaths, (path) => path.getAttribute("d") ?? "");
      setBeamPaths((currentPaths) => (
        currentPaths.length === nextPaths.length && currentPaths.every((path, index) => path === nextPaths[index])
          ? currentPaths
          : nextPaths
      ));
    };

    const scheduleSync = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(syncBeamPaths);
    };

    const observer = new MutationObserver(scheduleSync);
    if (mapRef.current) observer.observe(mapRef.current, { attributes: true, childList: true, subtree: true, attributeFilter: ["d"] });
    scheduleSync();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [tracks.length]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setBeamInView(true);
      observer.disconnect();
    }, { threshold: 0.12 });

    observer.observe(map);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!beamInView || beamPaths.length !== tracks.length || beamStartedRef.current) return;

    let secondFrameId = 0;
    const firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        beamStartedRef.current = true;
        setBeamActive(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrameId);
      window.cancelAnimationFrame(secondFrameId);
    };
  }, [beamInView, beamPaths.length, tracks.length]);

  return (
    <div
      ref={mapRef}
      className={`tracks-map${beamActive ? " tracks-map--beam-active" : ""}`}
    >
      <ArcherContainer
        className="tracks-connector"
        strokeColor="var(--track-connector-color)"
        strokeWidth={1.5}
        lineStyle="curve"
        endMarker={false}
        svgContainerStyle={{ zIndex: 0 }}
      >
        <ArcherElement id="tracks-origin" relations={relations}>
          <span className="tracks-map__origin" aria-hidden="true" />
        </ArcherElement>
        <div className="tracks-map__lead" aria-hidden="true" />

        <ol className="tracks-grid clean-list">
          {tracks.map((track) => (
            <li key={track.slug}>
              <ArcherElement id={`track-${track.slug}`}>
                <MagicCard
                  className={cn(cardVariants({ density: "compact", variant: "frame" }), "track-panel-shell")}
                  gradientColor="var(--accent-quiet)"
                  gradientFrom="var(--accent)"
                  gradientOpacity={0.72}
                  gradientSize={280}
                  gradientTo="var(--border-strong)"
                >
                  <Link href={`/tracks/${track.slug}`} className="track-panel" data-track={track.slug}>
                    <CardCorners />
                    <CardMeta code={`TRK-${track.index}`} />
                    <CardBody className="track-panel__body">
                      <h2>{track.nameZh}</h2>
                      <p className="track-panel__en">{track.nameEn}</p>
                      <p>{track.tagline}</p>
                      <div className="stack-row">
                        {[...track.stack.languages, ...track.stack.frameworks].slice(0, 4).map((item) => (
                          <Tag key={item}>{item}</Tag>
                        ))}
                      </div>
                    </CardBody>
                    <CardFooter className="track-panel__footer">
                      <span className="track-panel__goal">{track.goal}</span>
                      <ArrowRight aria-hidden="true" size={18} />
                    </CardFooter>
                  </Link>
                </MagicCard>
              </ArcherElement>
            </li>
          ))}
        </ol>
      </ArcherContainer>
      <svg className="tracks-connector__beams" aria-hidden="true" focusable="false">
        {beamPaths.map((path, index) => (
          <path key={tracks[index].slug} className="tracks-connector__beam" d={path} pathLength="1" />
        ))}
      </svg>
    </div>
  );
}
