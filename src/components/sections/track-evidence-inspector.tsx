"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, ExternalLink, Layers, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardMeta } from "@/components/ui/card";
import {
  Sheet,
  SheetBody,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TechTag } from "@/components/ui/tech-tag";
import type { Award, Work } from "@/content";

export interface TrackEvidenceInspectorProps {
  works: Work[];
  awards: Award[];
}

export function TrackEvidenceInspector({ works, awards }: TrackEvidenceInspectorProps) {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  if (works.length === 0 && awards.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-reveal="group">
        {/* 代表项目卡片 */}
        {works.map((work, index) => (
          <Card
            corners
            key={work.slug}
            variant="frame"
            className="group cursor-pointer hover:border-[var(--border-strong)] transition-all duration-200 active:scale-[0.98]"
            onClick={() => setSelectedWork(work)}
          >
            <CardMeta
              code={`WRK-${String(index + 1).padStart(2, "0")}`}
              revision="CASE STUDY"
              status={{
                label: work.status,
                pulse: work.status === "已上线",
                variant: work.status === "已上线" ? "active" : work.status === "在研" ? "warning" : "neutral",
              }}
            />
            <CardBody className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                  {work.nameZh}
                </h3>
                <ArrowUpRight
                  size={16}
                  className="text-[var(--fg-faint)] group-hover:text-[var(--fg)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 mt-1"
                  aria-hidden="true"
                />
              </div>
              <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed line-clamp-2">
                {work.tagline}
              </p>

              {work.highlights && work.highlights.length > 0 && (
                <div className="py-1.5 px-2.5 rounded bg-[var(--surface-2)]/60 border border-[var(--border)] text-[11px] font-mono text-[var(--fg-muted)]">
                  <span className="flex items-center gap-1.5 text-[var(--fg)] font-medium">
                    <Sparkles className="h-3 w-3 text-[var(--accent)] shrink-0" aria-hidden="true" />
                    <span className="truncate">{work.highlights[0]}</span>
                  </span>
                </div>
              )}
            </CardBody>
            <CardFooter className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--fg-faint)]">
              <span>{work.period}</span>
              <span className="text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors">
                DOSSIER ↗
              </span>
            </CardFooter>
          </Card>
        ))}

        {/* 荣誉证书卡片 */}
        {awards.map((award, index) => (
          <Link href="/awards" key={award.id} className="block group active:scale-[0.98] transition-transform">
            <Card corners variant="frame" className="h-full transition-all duration-200 group-hover:border-[var(--border-strong)]">
              <CardMeta
                code={`AWD-${String(index + 1).padStart(2, "0")}`}
                revision={award.year}
                status={{ label: award.level, variant: "success" }}
              />
              <CardBody className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                    {award.competition}
                  </h3>
                  <ArrowRight
                    size={15}
                    className="text-[var(--fg-faint)] group-hover:text-[var(--fg)] group-hover:translate-x-0.5 transition-transform shrink-0 mt-1"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
                  {award.result}
                </p>
                {award.description && (
                  <p className="text-xs font-mono text-[var(--accent)] truncate">
                    {award.description}
                  </p>
                )}
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {/* Coss Sheet 侧滑工程解析抽屉 */}
      <Sheet open={!!selectedWork} onOpenChange={(open) => !open && setSelectedWork(null)}>
        {selectedWork && (
          <SheetBody className="p-0 space-y-0 max-w-2xl bg-[var(--surface)]">
            <SheetHeader className="p-6 sm:p-8 bg-[var(--surface)] border-b border-[var(--border)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-[var(--accent)] tracking-wider">
                  PROJECT SPEC
                </span>
                <span className="text-[var(--fg-faint)]">/</span>
                <span className="font-mono text-xs text-[var(--fg-muted)]">
                  {selectedWork.status}
                </span>
              </div>
              <SheetTitle>{selectedWork.nameZh}</SheetTitle>
              <SheetDescription>{selectedWork.tagline}</SheetDescription>
            </SheetHeader>

            <div className="p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-200px)]">
              {/* 核心亮点 */}
              {selectedWork.highlights && selectedWork.highlights.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--fg)]">
                    <Sparkles className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                    <span>核心攻坚亮点</span>
                  </div>
                  <div className="space-y-2">
                    {selectedWork.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-start gap-3 p-3.5 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/60 border border-[var(--border)] text-xs sm:text-sm text-[var(--fg)]"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="leading-relaxed">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 架构决策与权衡 */}
              {selectedWork.detail?.decisions && selectedWork.detail.decisions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--fg)]">
                    <ShieldCheck className="h-4 w-4 text-[var(--success)]" aria-hidden="true" />
                    <span>架构权衡决策</span>
                  </div>
                  <div className="space-y-3">
                    {selectedWork.detail.decisions.slice(0, 3).map((dec, i) => (
                      <div
                        key={dec.what}
                        className="p-4 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/40 space-y-1.5"
                      >
                        <span className="font-mono text-xs font-bold text-[var(--fg)] block">
                          {`0${i + 1} // ${dec.what}`}
                        </span>
                        <p className="text-xs text-[var(--fg-muted)] leading-relaxed">{dec.why}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 技术栈 */}
              {selectedWork.stackSummary && selectedWork.stackSummary.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--fg)]">
                    <Layers className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                    <span>技术栈依赖</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedWork.stackSummary.map((tag) => (
                      <TechTag key={tag} name={tag} className="py-1 px-3 text-xs" />
                    ))}
                  </div>
                </div>
              )}

              {/* 底部跳转 */}
              <div className="pt-6 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
                {selectedWork.liveUrl && (
                  <Button asChild variant="ghost" size="sm" className="font-mono text-xs border border-[var(--border)]">
                    <a href={selectedWork.liveUrl} target="_blank" rel="noreferrer">
                      在线体验 <ExternalLink size={13} className="ml-1" aria-hidden="true" />
                    </a>
                  </Button>
                )}
                {selectedWork.detail && (
                  <Button asChild size="sm" className="font-mono text-xs">
                    <Link href={`/works/${selectedWork.slug}`}>
                      工程工作台详情 <ArrowRight size={13} className="ml-1" aria-hidden="true" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </SheetBody>
        )}
      </Sheet>
    </>
  );
}
