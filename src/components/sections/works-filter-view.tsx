"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";

import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardMeta } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechTag } from "@/components/ui/tech-tag";
import type { Work } from "@/content/schema";
import { countWorkScreenshots } from "@/lib/work-media";

type WorksFilterViewProps = {
  works: Work[];
};

export function WorksFilterView({ works }: WorksFilterViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Save current scroll position, filter state and target slug to sessionStorage
  const saveWorksState = useCallback((slug?: string) => {
    try {
      if (window.scrollY > 0) {
        sessionStorage.setItem("yfy_works_scroll_y", String(window.scrollY));
      }
      sessionStorage.setItem("yfy_works_filter", activeFilter);
      if (slug) {
        sessionStorage.setItem("yfy_works_last_slug", slug);
      }
      sessionStorage.setItem("yfy_works_restore", "true");
    } catch {
      // Ignore storage errors
    }
  }, [activeFilter]);

  // Continuously record scroll position and filter state on /works
  useEffect(() => {
    let timer: number;
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (window.scrollY > 0) {
          try {
            sessionStorage.setItem("yfy_works_scroll_y", String(window.scrollY));
            sessionStorage.setItem("yfy_works_filter", activeFilter);
          } catch {}
        }
      }, 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [activeFilter]);

  // Robust multi-phase scroll restoration when returning from a work detail page
  useEffect(() => {
    let isCancelled = false;
    let intervalId: number | undefined;

    try {
      const shouldRestore = sessionStorage.getItem("yfy_works_restore") === "true";
      if (!shouldRestore) return;

      const savedFilter = sessionStorage.getItem("yfy_works_filter");
      const savedScrollY = sessionStorage.getItem("yfy_works_scroll_y");
      const savedSlug = sessionStorage.getItem("yfy_works_last_slug");

      if (
        savedFilter &&
        ["all", "shipped", "incubating", "software", "ai", "iot"].includes(savedFilter) &&
        savedFilter !== activeFilter
      ) {
        setActiveFilter(savedFilter);
      }

      const targetY = savedScrollY ? parseFloat(savedScrollY) : NaN;
      if (Number.isNaN(targetY) && !savedSlug) {
        sessionStorage.removeItem("yfy_works_restore");
        return;
      }

      let userInteracted = false;
      const markInteracted = (e: Event) => {
        if (e.isTrusted) {
          userInteracted = true;
          if (intervalId) window.clearInterval(intervalId);
          try {
            sessionStorage.removeItem("yfy_works_restore");
          } catch {}
        }
      };

      window.addEventListener("wheel", markInteracted, { passive: true, once: true });
      window.addEventListener("touchstart", markInteracted, { passive: true, once: true });
      window.addEventListener("touchmove", markInteracted, { passive: true, once: true });
      window.addEventListener("keydown", markInteracted, { passive: true, once: true });

      const performScroll = () => {
        if (isCancelled || userInteracted) return;

        let targetTop = !Number.isNaN(targetY) && targetY > 0 ? targetY : 0;

        if (savedSlug) {
          const el =
            document.getElementById(`work-${savedSlug}`) ||
            document.querySelector(`[data-work-slug="${savedSlug}"]`);
          if (el) {
            const rect = el.getBoundingClientRect();
            const elementAbsoluteTop = rect.top + window.scrollY;
            if (Number.isNaN(targetY) || targetY <= 0) {
              targetTop = Math.max(0, elementAbsoluteTop - 120);
            }
          }
        }

        if (targetTop > 0) {
          window.scrollTo({ top: targetTop, behavior: "instant" });
        }
      };

      // Perform initial restorations
      performScroll();
      requestAnimationFrame(performScroll);

      // Keep ensuring scroll position across layout and hydration frames
      let elapsed = 0;
      intervalId = window.setInterval(() => {
        elapsed += 30;
        performScroll();
        if (elapsed >= 600) {
          if (intervalId) window.clearInterval(intervalId);
          try {
            sessionStorage.removeItem("yfy_works_restore");
          } catch {}
        }
      }, 30);

      return () => {
        isCancelled = true;
        if (intervalId) window.clearInterval(intervalId);
        window.removeEventListener("wheel", markInteracted);
        window.removeEventListener("touchstart", markInteracted);
        window.removeEventListener("touchmove", markInteracted);
        window.removeEventListener("keydown", markInteracted);
      };
    } catch {
      // Ignore storage errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredWorks = useMemo(() => {
    if (activeFilter === "all") return works;
    if (activeFilter === "shipped") return works.filter((w) => w.status === "已上线");
    if (activeFilter === "incubating") return works.filter((w) => w.status === "在研");
    return works.filter((w) => w.trackSlugs.includes(activeFilter as Work["trackSlugs"][number]));
  }, [works, activeFilter]);

  const live = filteredWorks.filter((w) => w.status === "已上线");
  const incubating = filteredWorks.filter((w) => w.status === "在研");

  return (
    <Tabs value={activeFilter} onValueChange={setActiveFilter} className="works-explorer">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">
            全部 ({works.length})
          </TabsTrigger>
          <TabsTrigger value="shipped">
            已上线 ({works.filter((w) => w.status === "已上线").length})
          </TabsTrigger>
          <TabsTrigger value="incubating">
            在研项目 ({works.filter((w) => w.status === "在研").length})
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
        <div className="font-mono text-xs text-[var(--fg-muted)]">
          显示 {filteredWorks.length} / {works.length} 个项目
        </div>
      </div>

      <TabsContent value={activeFilter} className="mt-0 focus-visible:outline-none">

      {filteredWorks.length === 0 ? (
        <Empty className="my-12">
          <EmptyHeader>
            <EmptyTitle>暂无匹配项目</EmptyTitle>
            <EmptyDescription>当前分类下暂无匹配项目，请切换其他技术方向筛选。</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          {live.length > 0 && (
            <section id="works-live" className="section mb-14" aria-labelledby="live-title">
              <div className="section__head">
                <p className="caps section__index">02 / Shipped</p>
                <h2 id="live-title" className="section__title">已上线项目。</h2>
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
                              <Link
                                href={`/works/${work.slug}`}
                                onClick={() => saveWorksState(work.slug)}
                              >
                                <span>查看项目详情</span>
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
                <h2 id="incubating-title" className="section__title">在研与孵化项目。</h2>
              </div>
              <div className="incubating-grid">
                {incubating.map((work, index) => (
                  <Card
                    corners
                    key={work.slug}
                    id={`work-${work.slug}`}
                    data-work-slug={work.slug}
                    variant="frame"
                    className="relative flex flex-col justify-between overflow-hidden border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all shadow-xs"
                  >
                    <div className="flex flex-col flex-1">
                      <CardMeta
                        code={`LAB-${String(index + 1).padStart(2, "0")}`}
                        revision="REV 2026.1"
                        status={{ label: work.status, variant: "warning" }}
                      />
                      <CardBody className="flex flex-col flex-1 p-6 sm:p-7 pb-6">
                        <div className="flex items-start gap-2.5 mb-3">
                          <Sparkles className="h-4 w-4 text-[var(--warn)] mt-1 shrink-0" />
                          <h3 className="text-base sm:text-lg font-bold text-[var(--fg)] tracking-tight leading-snug">
                            {work.nameZh}
                          </h3>
                        </div>
                        <p className="text-sm sm:text-[0.9375rem] text-[var(--fg-muted)] leading-relaxed mb-6">
                          {work.tagline}
                        </p>

                        {work.highlights.length > 0 && (
                          <div className="space-y-2.5 mb-6">
                            {work.highlights.map((item, idx) => (
                              <div
                                key={item}
                                className="flex items-start gap-3 p-3 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/40 hover:bg-[var(--surface-2)]/80 transition-colors text-xs sm:text-sm text-[var(--fg)]"
                              >
                                <span className="font-mono text-xs font-bold text-[var(--accent)] shrink-0 mt-0.5 select-none">
                                  0{idx + 1} {"//"}
                                </span>
                                <span className="leading-snug text-[var(--fg)] font-normal">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-auto pt-3 border-t border-[var(--border)]">
                          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--fg-faint)] mb-2.5">
                            {"在研验证栈 // STACK"}
                          </div>
                          <div className="flex flex-wrap gap-2 w-full">
                            {work.stackSummary.map((item) => (
                              <TechTag key={item} name={item} className="flex-1 text-center justify-center min-w-[80px] py-1.5" />
                            ))}
                          </div>
                        </div>
                      </CardBody>
                    </div>
                    <CardFooter className="p-4 px-6 sm:px-7 border-t border-[var(--border)] bg-[var(--surface-2)]/30 text-xs sm:text-sm font-mono text-[var(--fg-muted)] flex items-center justify-between">
                      <span>{work.trackSlugs.length} 个关联方向</span>
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
      </TabsContent>
    </Tabs>
  );
}
