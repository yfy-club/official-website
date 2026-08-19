"use client";

import { useState } from "react";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, CheckCircle2, ExternalLink, Eye, Layers, ShieldCheck, Sparkles, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardMeta } from "@/components/ui/card";
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
      <div className="related-grid" data-reveal="group">
        {/* 代表项目卡片 */}
        {works.map((work, index) => (
          <Card
            corners
            key={work.slug}
            variant="frame"
            className="group cursor-pointer hover:border-[var(--accent)]/50 transition-all"
            onClick={() => setSelectedWork(work)}
          >
            <CardMeta
              code={`WRK-${String(index + 1).padStart(2, "0")}`}
              revision="PROJECT CASE"
              status={{
                label: work.status,
                pulse: work.status === "已上线",
                variant: work.status === "已上线" ? "active" : work.status === "在研" ? "warning" : "neutral",
              }}
            />
            <CardBody>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="text-base font-bold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                  {work.nameZh}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed mb-3 line-clamp-2">
                {work.tagline}
              </p>

              {/* 核心亮点预览 */}
              {work.highlights && work.highlights.length > 0 && (
                <div className="space-y-1 py-1.5 px-2 rounded bg-[var(--surface-2)]/50 border border-[var(--border)] text-[11px] font-mono text-[var(--fg-faint)]">
                  <span className="flex items-center gap-1.5 text-[var(--fg)] font-semibold">
                    <Sparkles className="h-3 w-3 text-[var(--accent)]" />
                    <span>{work.highlights[0]}</span>
                  </span>
                </div>
              )}
            </CardBody>
            <CardFooter className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-mono text-[var(--accent)] font-semibold">
                <Eye size={13} />
                <span>呼出侧边解析</span>
              </span>
              <span className="text-[11px] font-mono text-[var(--fg-faint)]">{work.period}</span>
            </CardFooter>
          </Card>
        ))}

        {/* 荣誉证书卡片 */}
        {awards.map((award, index) => (
          <Card corners key={award.id} variant="frame">
            <CardMeta
              code={`AWD-${String(index + 1).padStart(2, "0")}`}
              revision={award.year}
              status={{ label: award.level, variant: "success" }}
            />
            <CardBody>
              <h3 className="text-base font-bold text-[var(--fg)] mb-1.5">{award.competition}</h3>
              <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed mb-2">{award.result}</p>
              {award.description && (
                <p className="text-xs font-mono text-[var(--accent)] truncate">
                  课题：{award.description}
                </p>
              )}
            </CardBody>
            <CardFooter className="pt-2 border-t border-[var(--border)]">
              <Link className="text-link text-xs font-mono" href="/awards">
                查看荣誉档案 <ArrowRight aria-hidden="true" size={13} />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Cult UI 风格 Side Panel (侧边呼出工程解析看板) */}
      <DialogPrimitive.Root open={!!selectedWork} onOpenChange={(open) => !open && setSelectedWork(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-xl bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar outline-none transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
            aria-describedby="work-panel-desc"
          >
            {selectedWork && (
              <div className="space-y-6">
                {/* 顶部标题与关闭按钮 */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border)]">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-semibold text-[var(--accent)]">
                        WORK DOSSIER //
                      </span>
                      <Badge
                        variant={selectedWork.status === "已上线" ? "active" : "warning"}
                        className="text-[10px]"
                      >
                        {selectedWork.status}
                      </Badge>
                    </div>
                    <DialogPrimitive.Title className="text-xl sm:text-2xl font-bold text-[var(--fg)] tracking-tight">
                      {selectedWork.nameZh}
                    </DialogPrimitive.Title>
                    <p className="font-mono text-xs text-[var(--fg-faint)] mt-0.5">
                      {selectedWork.nameEn}
                    </p>
                  </div>
                  <DialogPrimitive.Close className="p-2 rounded-[var(--radius-xs)] border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                    <X size={18} aria-hidden="true" />
                    <span className="sr-only">关闭侧边栏</span>
                  </DialogPrimitive.Close>
                </div>

                {/* 项目定位说明 */}
                <div id="work-panel-desc" className="p-4 rounded-[var(--radius-xs)] bg-[var(--surface-2)]/60 border border-[var(--border)] text-sm text-[var(--fg)] leading-relaxed">
                  {selectedWork.tagline}
                </div>

                {/* 攻坚核心亮点清单 */}
                {selectedWork.highlights && selectedWork.highlights.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--fg)]">
                      <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                      <span>KEY HIGHLIGHTS // 核心攻坚亮点</span>
                    </div>
                    <ul className="space-y-2">
                      {selectedWork.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed"
                        >
                          <CheckCircle2 className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 架构设计与工程决策 */}
                {selectedWork.detail?.decisions && selectedWork.detail.decisions.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-[var(--border)]">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--fg)]">
                      <ShieldCheck className="h-4 w-4 text-[var(--success)]" />
                      <span>ENGINEERING DECISIONS // 架构权衡决策</span>
                    </div>
                    <div className="space-y-2.5">
                      {selectedWork.detail.decisions.slice(0, 3).map((dec, i) => (
                        <div
                          key={dec.what}
                          className="p-3 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/30 text-xs space-y-1"
                        >
                          <span className="font-mono font-bold text-[var(--fg)] block">
                            {`0${i + 1} // ${dec.what}`}
                          </span>
                          <p className="text-[var(--fg-muted)] leading-relaxed">{dec.why}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 技术栈标签 */}
                {selectedWork.stackSummary && selectedWork.stackSummary.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-[var(--border)]">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--fg)]">
                      <Layers className="h-4 w-4 text-[var(--accent)]" />
                      <span>TECH STACK // 依赖技术栈</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedWork.stackSummary.map((tag) => (
                        <TechTag key={tag} name={tag} className="py-1 px-2.5 text-xs" />
                      ))}
                    </div>
                  </div>
                )}

                {/* 底部跳转操作 */}
                <div className="pt-6 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
                  {selectedWork.liveUrl && (
                    <Button asChild variant="ghost" size="sm" className="font-mono text-xs border border-[var(--border)]">
                      <a href={selectedWork.liveUrl} target="_blank" rel="noreferrer">
                        访问演示地址 <ExternalLink size={13} className="ml-1" />
                      </a>
                    </Button>
                  )}
                  {selectedWork.detail && (
                    <Button asChild size="sm" className="font-mono text-xs">
                      <Link href={`/works/${selectedWork.slug}`}>
                        查看完整工程档案 <ArrowRight size={13} className="ml-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
