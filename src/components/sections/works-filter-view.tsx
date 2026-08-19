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
                    <div className="work-row__copy flex flex-col justify-between p-6 sm:p-8">
                      <div>
                        <div className="work-row__status mb-3">
                          <Badge variant="active" pulse>
                            {work.status}
                          </Badge>
                          {work.detail && (
                            <span className="caps tabular text-xs font-mono text-[var(--fg-muted)]">
                              {countWorkScreenshots(work)} SCREENS / 系统实录
                            </span>
                          )}
                        </div>
                        <h2 className="text-2xl sm:text-[1.65rem] font-bold text-[var(--fg)] tracking-tight leading-snug">
                          {work.nameZh}
                        </h2>
                        {work.nameEn && (
                          <p className="display-latin text-sm sm:text-base text-[var(--fg-muted)] opacity-85 mt-0.5 mb-3.5">
                            {work.nameEn}
                          </p>
                        )}
                        <p className="text-sm sm:text-[0.9375rem] text-[var(--fg-muted)] leading-relaxed mb-4">
                          {work.tagline}
                        </p>
                        <ul className="space-y-2 text-xs sm:text-sm text-[var(--fg)] mb-5">
                          {work.highlights.map((item) => (
                            <li key={item} className="flex items-start gap-2.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-1.5" />
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="stack-row mb-6">
                          {work.stackSummary.map((item) => (
                            <TechTag key={item} name={item} />
                          ))}
                        </div>
                      </div>

                      <div className="work-row__links flex flex-wrap items-center gap-3 pt-3 border-t border-[var(--border)]">
                        {work.detail && (
                          <Button asChild className="rounded-[var(--radius-xs)] font-mono text-xs sm:text-sm font-semibold h-9 sm:h-10 px-3.5 sm:px-4">
                            <Link href={`/works/${work.slug}`}>
                              <span>查看工程手记</span>
                              <ArrowRight aria-hidden="true" size={15} />
                            </Link>
                          </Button>
                        )}
                        {work.liveUrl && (
                          <Button asChild variant="ghost" className="rounded-[var(--radius-xs)] border border-[var(--border)] font-mono text-xs sm:text-sm h-9 sm:h-10 px-3.5 sm:px-4 hover:bg-[var(--surface-2)]">
                            <a href={work.liveUrl} target="_blank" rel="noreferrer">
                              <span>在线体验</span>
                              <ExternalLink aria-hidden="true" size={14} />
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
                  <Card corners key={work.slug} variant="frame" className="relative flex flex-col justify-between overflow-hidden border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-colors">
                    <div>
                      <CardMeta
                        code={`LAB-${String(index + 1).padStart(2, "0")}`}
                        revision="REV 2026.1"
                        status={{ label: work.status, variant: "warning" }}
                      />
                      <CardBody className="pb-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Sparkles className="h-4 w-4 text-[var(--warn)]" />
                          <h3 className="text-base font-semibold text-[var(--fg)]">{work.nameZh}</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed mb-4">{work.tagline}</p>

                        <div className="stack-row">
                          {work.stackSummary.map((item) => (
                            <TechTag key={item} name={item} />
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
