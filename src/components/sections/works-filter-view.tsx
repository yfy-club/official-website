"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ExternalLink, Sparkles, Terminal } from "lucide-react";
import Link from "next/link";

import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardMeta } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag } from "@/components/ui/tag";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
            <section id="works-live" className="section mb-12" aria-labelledby="live-title">
              <div className="section__head">
                <p className="caps section__index">02 / Shipped</p>
                <h2 id="live-title" className="section__title">已上线交付。</h2>
              </div>
              <div className="works-list">
                {live.map((work, index) => (
                  <SpotlightCard
                    key={work.slug}
                    image={work.image}
                    alt={`${work.nameZh}运行界面`}
                    flip={index % 2 === 1}
                    workSlug={work.detail ? work.slug : undefined}
                  >
                    <div className="work-row__copy">
                      <div className="work-row__status">
                        <Badge variant="active" pulse>
                          {work.status}
                        </Badge>
                        {work.detail && (
                          <span className="caps tabular">
                            {countWorkScreenshots(work)} Screens / 系统实录
                          </span>
                        )}
                      </div>
                      <h2>{work.nameZh}</h2>
                      {work.nameEn && <p className="display-latin work-row__en">{work.nameEn}</p>}
                      <p>{work.tagline}</p>
                      <ul>
                        {work.highlights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <div className="stack-row">
                        {work.stackSummary.map((item) => (
                          <Tooltip key={item}>
                            <TooltipTrigger asChild>
                              <span tabIndex={0} className="inline-flex cursor-help">
                                <Tag>{item}</Tag>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {work.nameZh} 核心技术组件：{item}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                      <div className="work-row__links pt-2">
                        {work.detail && (
                          <Button asChild variant="ghost" className="rounded-[var(--radius-xs)] border border-[var(--border)] hover:bg-[var(--surface-2)]">
                            <Link href={`/works/${work.slug}`}>
                              <Terminal size={14} aria-hidden="true" />
                              <span>工程记录</span>
                              <ArrowRight aria-hidden="true" size={15} />
                            </Link>
                          </Button>
                        )}
                        {work.liveUrl && (
                          <Button asChild variant="link" className="font-mono text-xs">
                            <a href={work.liveUrl} target="_blank" rel="noreferrer">
                              在线访问 <ExternalLink aria-hidden="true" size={14} />
                            </a>
                          </Button>
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
                  <Card corners key={work.slug} variant="frame" className="relative flex flex-col justify-between overflow-hidden">
                    <div>
                      <CardMeta
                        code={`LAB-${String(index + 1).padStart(2, "0")}`}
                        revision="REV 2026.1"
                        status={{ label: work.status, variant: "warning" }}
                      />
                      <CardBody className="pb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="h-4 w-4 text-[var(--warn)]" />
                          <h3 className="text-base font-semibold text-[var(--fg)]">{work.nameZh}</h3>
                        </div>
                        <p className="text-sm text-[var(--fg-muted)] mb-3">{work.tagline}</p>

                        <div className="space-y-1.5 p-3 rounded-[var(--radius-xs)] bg-[var(--surface-2)] border border-[var(--border)] mb-3">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-[var(--fg-muted)]">阶段目标: 模型评测与微调</span>
                            <span className="text-[var(--fg)] font-semibold">75%</span>
                          </div>
                          <Progress value={75} className="h-1.5 bg-[var(--surface)]" />
                        </div>

                        <div className="stack-row">
                          {work.stackSummary.map((item) => (
                            <Tooltip key={item}>
                              <TooltipTrigger asChild>
                                <span tabIndex={0} className="inline-flex cursor-help">
                                  <Tag>{item}</Tag>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>在研验证栈：{item}</TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </CardBody>
                    </div>
                    <CardFooter className="pt-3 border-t border-[var(--border)] text-xs font-mono text-[var(--fg-muted)]">
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
