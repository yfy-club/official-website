import { ArrowLeft, ArrowRight, LayoutGrid, Terminal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { TrackDeepArchitecture } from "@/components/sections/track-deep-architecture";
import { TrackEvidenceInspector } from "@/components/sections/track-evidence-inspector";
import { TrackFieldOverview } from "@/components/sections/track-field-overview";
import { TrackStageConsole } from "@/components/sections/track-stage-console";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tag } from "@/components/ui/tag";
import { TechTag } from "@/components/ui/tech-tag";
import { awards, trackDeepDives, trackOverviews, tracks, works } from "@/content";
import { breadcrumbJsonLd, createMetadata, trackJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return tracks.map((track) => ({ slug: track.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const track = tracks.find((item) => item.slug === slug);
  return track
    ? createMetadata({
        title: `${track.nameZh}方向`,
        description: `${track.positioning} 涵盖大一至大三阶梯进阶实训、重点攻坚架构与真实工程项目。`,
        path: `/tracks/${track.slug}`,
      })
    : {};
}

export default async function TrackDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trackIndex = tracks.findIndex((item) => item.slug === slug);
  if (trackIndex < 0) notFound();

  const track = tracks[trackIndex];
  const overview = trackOverviews[track.slug];
  const deepDive = trackDeepDives[track.slug];
  const relatedWorks = works.filter((work) => track.relatedWorkSlugs.includes(work.slug));
  const relatedAwards = awards.filter((award) => track.relatedAwardIds.includes(award.id));
  const previous = tracks[(trackIndex - 1 + tracks.length) % tracks.length];
  const next = tracks[(trackIndex + 1) % tracks.length];

  return (
    <main id="main-content" className="page-main page-shell track-detail" tabIndex={-1}>
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "技术方向", path: "/tracks" },
          { name: track.nameZh, path: `/tracks/${track.slug}` },
        ])}
      />
      <StructuredData data={trackJsonLd(track)} />
      <TrajectoryRail
        label={track.nameZh}
        sections={[
          { id: "track-start", index: "01", label: "方向概况" },
          { id: "track-overview", index: "02", label: "专业介绍" },
          { id: "track-deep-dive", index: "03", label: "架构原理" },
          { id: "track-stage", index: "04", label: "培养中枢" },
          { id: "track-evidence", index: "05", label: "相关成果" },
          { id: "track-switch", index: "06", label: "方向切换" },
          { id: "track-join", index: "07", label: "招新报名" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">首页</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/tracks">技术方向</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{track.nameZh}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 font-mono text-xs border border-[var(--border)] rounded-[var(--radius-xs)] hover:bg-[var(--surface-2)] text-[var(--fg-muted)] hover:text-[var(--fg)]"
        >
          <Link href="/tracks">
            <ArrowLeft size={13} aria-hidden="true" />
            <span>返回技术拓扑中枢</span>
          </Link>
        </Button>
      </div>

      {/* 01 / 方向概况 Header + 紧凑技术栈轨道 */}
      <header id="track-start" className="track-detail__hero mb-12">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs font-semibold text-[var(--accent)]">
                TRK-{track.index} {"//"} TECHNICAL DOSSIER
              </span>
              <Badge variant="active">ACTIVE TRACK</Badge>
            </div>
            <h1>{track.nameZh}</h1>
            <p className="display-latin">{track.nameEn}</p>
            <p className="text-base sm:text-lg text-[var(--fg-muted)] leading-relaxed max-w-3xl mt-3 mb-4">
              {track.positioning}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--fg-muted)]">
              <span className="text-[var(--fg-faint)]">目标岗位方向：</span>
              <span className="font-bold text-[var(--fg)]">{track.goal}</span>
            </div>
          </div>

          {/* 紧凑单行技术栈全景 Rail */}
          <div className="p-4 sm:p-5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[var(--accent)]" />
                <span className="font-mono text-xs font-bold text-[var(--fg)]">
                  核心技术栈与工具链
                </span>
              </div>
              <span className="text-xs font-mono text-[var(--fg-faint)] hidden sm:inline">
                悬停查看简介与官方文档
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {track.stack.languages.concat(track.stack.frameworks).map((tech) => (
                <TechTag key={tech} name={tech} className="py-1 px-2.5 text-xs" />
              ))}
              {track.stack.engineering.slice(0, 3).map((item) => (
                <Tag key={item} className="py-1 px-2.5 text-xs bg-[var(--surface-2)] border border-[var(--border)]">
                  {item}
                </Tag>
              ))}
              {(track.stack.toolchain ?? ["Git", "Docker", "Linux"]).slice(0, 4).map((tool) => (
                <Kbd key={tool} className="py-0.5 px-2 text-xs">
                  {tool}
                </Kbd>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 02 / 专业领域深度介绍 (TrackFieldOverview) */}
      {overview && (
        <section id="track-overview" className="section mb-16" aria-labelledby="overview-title" data-reveal="section">
          <div className="section__head mb-8">
            <p className="caps section__index">02 / Overview</p>
            <h2 id="overview-title" className="section__title">专业介绍与主攻方向。</h2>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-3xl mt-1">
              涵盖主攻方向、技术栈与研发链路。
            </p>
          </div>
          <TrackFieldOverview data={overview} />
        </section>
      )}

      {/* 03 / 交互式架构图解与硬核原理解析台 (TrackDeepArchitecture) */}
      {deepDive && (
        <section id="track-deep-dive" className="section mb-16" aria-labelledby="deep-dive-title" data-reveal="section">
          <div className="section__head mb-8">
            <p className="caps section__index">03 / Deep Architecture & Theory</p>
            <h2 id="deep-dive-title" className="section__title">攻坚架构与核心原理图解。</h2>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-3xl mt-1">
              交互式探索底层拓扑，点击展开硬核机制、数学公式推导、真实代码实现与常见认知误区排雷。
            </p>
          </div>
          <TrackDeepArchitecture deepDive={deepDive} />
        </section>
      )}

      {/* 04 / 三年培养体系与阶段实训中枢 (TrackStageConsole) */}
      <section id="track-stage" className="section mb-16" aria-labelledby="stage-title" data-reveal="section">
        <div className="section__head mb-8">
          <p className="caps section__index">04 / Engineering Console</p>
          <h2 id="stage-title" className="section__title">三年培养体系与阶段实训中枢。</h2>
          <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-3xl mt-1">
            大一筑基、大二专项攻坚、大三就业/升学双通道精准赋能，全程导师指导与实训进阶。
          </p>
        </div>
        <TrackStageConsole modules={track.curriculumModules} roadmap={track.roadmap} />
      </section>

      {/* 05 / 相关代表项目与赛事成果 (TrackEvidenceInspector) */}
      {(relatedWorks.length > 0 || relatedAwards.length > 0) && (
        <section id="track-evidence" className="section mb-16" aria-labelledby="related-title" data-reveal="section">
          <div className="section__head mb-8">
            <p className="caps section__index">05 / Outcomes & Evidence</p>
            <h2 id="related-title" className="section__title">代表项目与赛事荣誉。</h2>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-3xl mt-1">
              该技术方向沉淀的真实工程系统与权威学科竞赛凭证，点击项目卡片可呼出侧边架构解析。
            </p>
          </div>
          <TrackEvidenceInspector works={relatedWorks} awards={relatedAwards} />
        </section>
      )}

      {/* 06 / 方向切换导航 */}
      <nav id="track-switch" className="pager pager--with-overview mb-14" aria-label="方向切换" data-reveal="group">
        <Link href={`/tracks/${previous.slug}`}>
          <ArrowLeft aria-hidden="true" size={18} />
          <span>
            <small>上一个方向</small>
            {previous.nameZh}
          </span>
        </Link>
        <Link href="/tracks" className="pager__overview">
          <LayoutGrid aria-hidden="true" size={16} />
          <span>
            <small>拓扑索引</small>技术方向总览
          </span>
        </Link>
        <Link href={`/tracks/${next.slug}`}>
          <span>
            <small>下一个方向</small>
            {next.nameZh}
          </span>
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </nav>

      {/* 07 / 招新加入 CTA */}
      <section id="track-join" className="cta-band" aria-label="加入社团" data-reveal="group">
        <p>对【{track.nameZh}】方向感兴趣？欢迎加入云飞扬，在真实工程与竞赛中与我们同行。</p>
        <Button asChild>
          <Link href="/join">
            立即报名 <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </Button>
      </section>
    </main>
  );
}
