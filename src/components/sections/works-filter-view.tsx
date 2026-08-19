"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";

import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardMeta } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechTag } from "@/components/ui/tech-tag";
import type { Work } from "@/content/schema";
import { countWorkScreenshots } from "@/lib/work-media";

type WorksFilterViewProps = {
  works: Work[];
};

export function WorksFilterView({ works }: WorksFilterViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredWorks = useMemo(() => {
    if (activeFilter === "all") return works;
    if (activeFilter === "shipped") return works.filter((w) => w.status === "已上线");
    if (activeFilter === "incubating") return works.filter((w) => w.status === "在研");
    return works.filter((w) => w.trackSlugs.includes(activeFilter as Work["trackSlugs"][number]));
  }, [works, activeFilter]);

  const live = filteredWorks.filter((w) => w.status === "已上线");
  const incubating = filteredWorks.filter((w) => w.status === "在研");

  return (
    <div className="works-explorer">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <Tabs value={activeFilter} onValueChange={setActiveFilter}>
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="all">
              全部 ({works.length})
            </TabsTrigger>
            <TabsTrigger value="shipped">
              已上线 ({works.filter((w) => w.status === "已上线").length})
            </TabsTrigger>
            <TabsTrigger value="incubating">
              在研实验室 ({works.filter((w) => w.status === "在研").length})
            </TabsTrigger>
            <TabsTrigger value="software">
              软件全栈
            </TabsTrigger>
            <TabsTrigger value="ai">
              AI 智能
            </TabsTrigger>
            <TabsTrigger value="iot">
              物联网
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="font-mono text-xs text-[var(--fg-muted)]">
          显示 {filteredWorks.length} / {works.length} 个项目
        </div>
      </div>

      {filteredWorks.length === 0 ? (
        <Empty className="my-12">
          <EmptyHeader>
            <EmptyTitle>暂无归档项目</EmptyTitle>
            <EmptyDescription>当前分类下暂无已归档项目，敬请期待社团全新产出。</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          {live.length > 0 && (
            <section id="works-live" className="section mb-14" aria-labelledby="live-title">
              <div className="section__head">
                <p className="caps section__index">02 / Shipped</p>
                <h2 id="live-title" className="section__title">已上线交付。</h2>
              </div>
              <div className="works-list">
                {live.map((work) => (
                  <SpotlightCard
                    key={work.slug}
                    image={work.image}
                    alt={`${work.nameZh}运行界面`}
                    workSlug={work.detail ? work.slug : undefined}
                  >
                    <div className="work-row__copy flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                      <div>
                        <div className="work-row__status flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--border)]">
                          <div className="flex items-center gap-3">
                            <Badge variant="active" pulse>
                              {work.status}
                            </Badge>
                            {work.period && (
                              <span className="font-mono text-xs text-[var(--fg-faint)]">
                                {work.period}
                              </span>
                            )}
                          </div>
                          {work.detail && (
                            <span className="caps tabular text-xs font-mono text-[var(--fg-muted)]">
                              {countWorkScreenshots(work)} SCREENS / 系统实录
                            </span>
                          )}
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg)] tracking-tight leading-tight mb-1">
                          {work.nameZh}
                        </h2>
                        {work.nameEn && (
                          <p className="display-latin text-sm sm:text-base text-[var(--fg-muted)] italic mb-4">
                            {work.nameEn}
                          </p>
                        )}
                        <p className="text-sm sm:text-base text-[var(--fg)] font-medium leading-relaxed mb-6">
                          {work.tagline}
                        </p>

                        <div className="space-y-2 mb-6">
                          {work.highlights.map((item, idx) => (
                            <div
                              key={item}
                              className="flex items-start gap-3 p-3 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/40 hover:bg-[var(--surface-2)]/80 hover:border-[var(--border-strong)] transition-colors"
                            >
                              <span className="font-mono text-xs font-bold text-[var(--accent)] shrink-0 mt-0.5 select-none">
                                0{idx + 1} {"//"}
                              </span>
                              <span className="text-xs sm:text-sm text-[var(--fg)] leading-relaxed font-normal">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mb-6">
                          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--fg-faint)] mb-2.5">
                            {"技术体系与选型 // ARCHITECTURE STACK"}
                          </div>
                          <div className="stack-row">
                            {work.stackSummary.map((item) => (
                              <TechTag key={item} name={item} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="work-row__links flex flex-wrap items-center justify-between gap-4 pt-5 mt-auto border-t border-[var(--border)]">
                        <div className="flex flex-wrap items-center gap-3">
                          {work.detail && (
                            <Button asChild className="rounded-[var(--radius-xs)] font-mono text-xs sm:text-sm font-semibold h-10 px-5 shadow-xs">
                              <Link href={`/works/${work.slug}`}>
                                <span>查看工程手记</span>
                                <ArrowRight aria-hidden="true" size={15} />
                              </Link>
                            </Button>
                          )}
                          {work.liveUrl && (
                            <Button asChild variant="ghost" className="rounded-[var(--radius-xs)] border border-[var(--border)] font-mono text-xs sm:text-sm h-10 px-5 hover:bg-[var(--surface-2)]">
                              <a href={work.liveUrl} target="_blank" rel="noreferrer">
                                <span>在线体验</span>
                                <ExternalLink aria-hidden="true" size={14} />
                              </a>
                            </Button>
                          )}
                        </div>
                        {work.detail?.evidence?.[0] && (
                          <div className="hidden xl:block font-mono text-[11px] text-[var(--fg-faint)]">
                            验收凭证: {work.detail.evidence[0].label} · {work.detail.evidence[0].value}
                          </div>
                        )}
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </section>
          )}

          {incubating.length > 0 && (
            <section id="works-incubating" className="section" aria-labelledby="incubating-title">
              <div className="section__head">
                <p className="caps section__index">03 / Incubating</p>
                <h2 id="incubating-title" className="section__title">在研与验证中。</h2>
              </div>
              <div className="incubating-grid">
                {incubating.map((work, index) => (
                  <Card
                    corners
                    key={work.slug}
                    variant="frame"
                    className="relative flex flex-col justify-between overflow-hidden border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all shadow-xs"
                  >
                    <div className="flex flex-col flex-1">
                      <CardMeta
                        code={`LAB-${String(index + 1).padStart(2, "0")}`}
                        revision="REV 2026.1"
                        status={{ label: work.status, variant: "warning" }}
                      />
                      <CardBody className="flex flex-col flex-1 p-5 sm:p-6 pb-6">
                        <div className="flex items-start gap-2.5 mb-2.5">
                          <Sparkles className="h-4 w-4 text-[var(--warn)] mt-1 shrink-0" />
                          <h3 className="text-base sm:text-lg font-bold text-[var(--fg)] tracking-tight leading-snug">
                            {work.nameZh}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed mb-5 min-h-[44px]">
                          {work.tagline}
                        </p>

                        {work.highlights.length > 0 && (
                          <div className="space-y-2 mb-6">
                            {work.highlights.map((item, idx) => (
                              <div
                                key={item}
                                className="flex items-start gap-2.5 p-2.5 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/40 hover:bg-[var(--surface-2)]/80 transition-colors text-xs text-[var(--fg)]"
                              >
                                <span className="font-mono text-[10px] font-bold text-[var(--accent)] shrink-0 mt-0.5 select-none">
                                  0{idx + 1} {"//"}
                                </span>
                                <span className="leading-snug text-[var(--fg)] font-normal">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-auto pt-2 border-t border-[var(--border)]">
                          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)] mb-2">
                            {"在研验证栈 // STACK"}
                          </div>
                          <div className="flex flex-wrap gap-1.5 w-full">
                            {work.stackSummary.map((item) => (
                              <TechTag key={item} name={item} className="flex-1 text-center justify-center min-w-[70px]" />
                            ))}
                          </div>
                        </div>
                      </CardBody>
                    </div>
                    <CardFooter className="p-4 px-5 sm:px-6 border-t border-[var(--border)] bg-[var(--surface-2)]/30 text-xs font-mono text-[var(--fg-muted)] flex items-center justify-between">
                      <span>{work.trackSlugs.length} 条关联航道</span>
                      <span>{work.stackSummary.length} 项技术验证</span>
                    </CardFooter>
                    <BorderBeam
                      borderWidth={1}
                      colorFrom="var(--warn)"
                      colorTo="var(--accent)"
                      delay={index * 2.4}
                      duration={10}
                      initialOffset={index * 17}
                      size={92}
                    />
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
