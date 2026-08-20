import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { TrackDeepArchitecture } from "@/components/sections/track-deep-architecture";
import { TrackEvidenceInspector } from "@/components/sections/track-evidence-inspector";
import { TrackFieldOverview } from "@/components/sections/track-field-overview";
import { TrackStageConsole } from "@/components/sections/track-stage-console";
import { TechStackCutoutConsole } from "@/components/sections/tech-stack-cutout-console";
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
          { id: "track-overview", index: "02", label: "领域图谱" },
          { id: "track-deep-dive", index: "03", label: "攻坚架构" },
          { id: "track-stage", index: "04", label: "培养中枢" },
          { id: "track-evidence", index: "05", label: "实战成果" },
          { id: "track-switch", index: "06", label: "方向切换" },
          { id: "track-join", index: "07", label: "招新报名" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-6 border-b border-[var(--border)] mb-12 sm:mb-16">
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
          className="h-8 px-3 font-mono text-xs border border-[var(--border)] rounded-[var(--radius-xs)] hover:bg-[var(--surface-2)] text-[var(--fg-muted)] hover:text-[var(--fg)]"
        >
          <Link href="/tracks">
            <ArrowLeft size={13} aria-hidden="true" />
            <span>技术方向总览</span>
          </Link>
        </Button>
      </div>

      {/* 01 / Swiss Editorial 巨幅大字 Hero (无卡片包裹，大气留白) */}
      <header id="track-start" className="track-detail__hero mb-20 sm:mb-28 space-y-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[var(--accent)] tracking-widest">
              TRK-0{track.index} {"//"} TECHNICAL SPEC
            </span>
            <Badge variant="active">ACTIVE TRACK</Badge>
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-normal leading-[0.95] tracking-tight text-[var(--fg)]">
              {track.nameEn}.
            </h1>
            <p className="text-2xl sm:text-4xl font-bold text-[var(--fg)] tracking-tight">
              {track.nameZh}
            </p>
          </div>

          <p className="text-base sm:text-xl text-[var(--fg-muted)] leading-relaxed max-w-4xl font-sans font-normal pt-2">
            {track.positioning}
          </p>

          <div className="flex items-center gap-3 pt-2 text-xs sm:text-sm font-mono text-[var(--fg-muted)]">
            <span className="text-[var(--fg-faint)]">目标领域：</span>
            <span className="font-bold text-[var(--fg)]">{track.goal}</span>
          </div>
        </div>

        {/* 旗舰级精工技术栈切角展台 (CutoutCard + Texture + Dither + Expandable) */}
        <div className="pt-6">
          <TechStackCutoutConsole stack={track.stack} />
        </div>
      </header>

      {/* 02 / 专业领域与研发图谱 (TrackFieldOverview) */}
      {overview && (
        <section id="track-overview" className="section mb-20 sm:mb-28" aria-labelledby="overview-title" data-reveal="section">
          <div className="section__head mb-12">
            <p className="caps section__index">02 / Domains</p>
            <h2 id="overview-title" className="section__title">主攻方向与研发链路。</h2>
          </div>
          <TrackFieldOverview data={overview} />
        </section>
      )}

      {/* 03 / 攻坚架构与原理拓扑 (TrackDeepArchitecture) */}
      {deepDive && (
        <section id="track-deep-dive" className="section mb-20 sm:mb-28" aria-labelledby="deep-dive-title" data-reveal="section">
          <div className="section__head mb-12">
            <p className="caps section__index">03 / Architecture & Theory</p>
            <h2 id="deep-dive-title" className="section__title">核心拓扑与架构原理。</h2>
          </div>
          <TrackDeepArchitecture deepDive={deepDive} />
        </section>
      )}

      {/* 04 / 三年培养中枢 (TrackStageConsole) */}
      <section id="track-stage" className="section mb-20 sm:mb-28" aria-labelledby="stage-title" data-reveal="section">
        <div className="section__head mb-12">
          <p className="caps section__index">04 / Stage Roadmap</p>
          <h2 id="stage-title" className="section__title">三年培养体系与阶段里程碑。</h2>
        </div>
        <TrackStageConsole modules={track.curriculumModules} roadmap={track.roadmap} />
      </section>

      {/* 05 / 真实成果与赛事证据 (TrackEvidenceInspector) */}
      {(relatedWorks.length > 0 || relatedAwards.length > 0) && (
        <section id="track-evidence" className="section mb-20 sm:mb-28" aria-labelledby="related-title" data-reveal="section">
          <div className="section__head mb-12">
            <p className="caps section__index">05 / Works & Honors</p>
            <h2 id="related-title" className="section__title">落地工程与赛事荣誉。</h2>
          </div>
          <TrackEvidenceInspector works={relatedWorks} awards={relatedAwards} />
        </section>
      )}

      {/* 06 / 纯净方向切换导航 (无多余文字) */}
      <nav id="track-switch" className="grid grid-cols-3 items-center border-y border-[var(--border)] py-6 mb-16" aria-label="方向切换">
        <Link
          href={`/tracks/${previous.slug}`}
          className="flex items-center gap-2 font-mono text-sm sm:text-base font-bold text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          <span>{previous.nameZh}</span>
        </Link>

        <Link
          href="/tracks"
          className="flex items-center justify-center gap-1.5 font-mono text-xs sm:text-sm text-[var(--fg-faint)] hover:text-[var(--fg)] transition-colors"
        >
          <LayoutGrid size={15} aria-hidden="true" />
          <span className="hidden sm:inline">方向总览</span>
        </Link>

        <Link
          href={`/tracks/${next.slug}`}
          className="flex items-center justify-end gap-2 font-mono text-sm sm:text-base font-bold text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors group"
        >
          <span>{next.nameZh}</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
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
