"use client";

import { ExternalLink } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getTechMeta } from "@/lib/tech-stack";
import { cn } from "@/lib/utils";

export function TechTag({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const meta = getTechMeta(name);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={meta.url}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "tag group/tag inline-flex items-center justify-center cursor-pointer transition-colors hover:border-[var(--border-strong)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]",
            className
          )}
        >
          <span>{name}</span>
          <span className="inline-flex w-0 max-w-0 opacity-0 overflow-hidden shrink-0 transition-all duration-200 ease-out group-hover/tag:w-2.5 group-hover/tag:max-w-[12px] group-hover/tag:opacity-100 group-hover/tag:ml-1">
            <ExternalLink size={10} className="text-[var(--fg-faint)]" />
          </span>
        </a>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs space-y-1 p-2.5 text-left">
        <div className="font-semibold text-[var(--fg)] flex items-center justify-between gap-2">
          <span>{meta.name}</span>
          <span className="text-[10px] text-[var(--accent)] font-normal flex items-center gap-0.5 font-mono">
            官方文档 ↗
          </span>
        </div>
        <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed font-sans">
          {meta.description}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
