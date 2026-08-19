"use client";

import { Sparkles } from "lucide-react";

import { BorderBeam } from "@/components/ui/border-beam";
import { Card, CardBody, CardCorners, CardFooter, CardMeta } from "@/components/ui/card";
import { TechTag } from "@/components/ui/tech-tag";
import type { Track } from "@/content/schema";

export function TrackDeepFocus({ items }: { items: NonNullable<Track["deepFocus"]> }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5" data-reveal="group">
      {items.map((item, index) => (
        <Card
          corners
          key={item.title}
          variant="frame"
          className="relative flex flex-col justify-between overflow-hidden border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all shadow-xs"
        >
          <div className="flex flex-col flex-1">
            <CardMeta
              code={`FOCUS-0${index + 1}`}
              revision="DEEP ARCHITECTURE"
              status={{ label: "CORE FOCUS", variant: "active" }}
            />
            <CardBody className="flex flex-col flex-1 p-6 pb-5">
              <h3 className="text-base sm:text-lg font-bold text-[var(--fg)] tracking-tight leading-snug mb-1">
                {item.title}
              </h3>
              <p className="font-mono text-xs text-[var(--accent)] mb-3">
                {item.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed mb-6">
                {item.description}
              </p>

              <div className="mt-auto pt-3 border-t border-[var(--border)]">
                <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--fg-faint)] mb-2.5">
                  {"核心技术栈 // TECH STACK"}
                </div>
                <div className="flex flex-wrap gap-1.5 w-full">
                  {item.techTags.map((tech) => (
                    <TechTag key={tech} name={tech} className="py-1 px-2 text-xs" />
                  ))}
                </div>
              </div>
            </CardBody>
          </div>
          <CardFooter className="p-3.5 px-6 border-t border-[var(--border)] bg-[var(--surface-2)]/40 text-xs font-mono text-[var(--fg)] flex items-start gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
            <span className="leading-snug text-[var(--fg-muted)]">
              {item.highlight}
            </span>
          </CardFooter>
          {index === 0 && (
            <BorderBeam
              size={200}
              duration={10}
              colorFrom="var(--accent)"
              colorTo="transparent"
              borderWidth={1.5}
            />
          )}
        </Card>
      ))}
    </div>
  );
}
