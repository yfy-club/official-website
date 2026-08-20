import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/page-hero";
import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { TrackDeepArchitecture } from "@/components/sections/track-deep-architecture";
import { TrackEvidenceInspector } from "@/components/sections/track-evidence-inspector";
import { TrackFieldOverview } from "@/components/sections/track-field-overview";
import { TrackStageConsole } from "@/components/sections/track-stage-console";
import { TechStackCutoutConsole } from "@/components/sections/tech-stack-cutout-console";
import { StructuredData } from "@/components/seo/structured-data";
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
          { id: "track-stack", index: "02", label: "技术基座" },
          { id: "track-overview", index: "03", label: "领域图谱" },
          { id: "track-deep-dive", index: "04", label: "攻坚架构" },
          { id: "track-stage", index: "05", label: "培养中枢" },
          { id: "track-evidence", index: "06", label: "实战成果" },
          { id: "track-switch", index: "07", label: "方向切换" },
          { id: "track-join", index: "08", label: "招新报名" },
        ]}
      />

      {/* 顶部简明面包屑与快速返回 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-6 border-b border-[var(--border)]">
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

      {/* 01 / Swiss Editorial PageHero 开屏全站统一高留白 */}
      <div id="track-start">
        <PageHero
          id="track-start-hero"
          eyebrow={`TRK-0${track.index} // TECHNICAL SPEC`}
          title={`${track.nameEn}.`}
          subtitle={track.nameZh}
          intro={track.positioning}
          scrollToId="track-stack"
          scrollLabel="向下滚动至核心技术栈与工程基座"
        >
          <div className="flex items-center gap-3 pt-2 text-xs sm:text-sm font-mono text-[var(--fg-muted)]">
            <span className="text-[var(--fg-faint)]">TARGET DOMAIN //</span>
            <span className="font-bold text-[var(--fg)]">{track.goal}</span>
          </div>
        </PageHero>
      </div>

      {/* 02 / 左右分栏精工技术栈展台 (TechStackCutoutConsole) */}
      <section id="track-stack" className="section mb-24 sm:mb-32" aria-labelledby="stack-title" data-reveal="section">
        <div className="section__head mb-12">
          <p className="caps section__index">02 / TOOLCHAIN MATRIX</p>
          <h2 id="stack-title" className="section__title">核心技术栈与工程基座。</h2>
        </div>
        <TechStackCutoutConsole stack={track.stack} />
      </section>

      {/* 03 / 专业领域与研发图谱 (TrackFieldOverview) */}
      {overview && (
        <section id="track-overview" className="section mb-24 sm:mb-32" aria-labelledby="overview-title" data-reveal="section">
          <div className="section__head mb-12">
            <p className="caps section__index">03 / RESEARCH DOMAINS</p>
            <h2 id="overview-title" className="section__title">主攻方向与研发链路。</h2>
          </div>
          <TrackFieldOverview data={overview} />
        </section>
      )}

      {/* 04 / 攻坚架构与原理拓扑 (TrackDeepArchitecture) */}
      {deepDive && (
        <section id="track-deep-dive" className="section mb-24 sm:mb-32" aria-labelledby="deep-dive-title" data-reveal="section">
          <div className="section__head mb-12">
            <p className="caps section__index">04 / ARCHITECTURE & THEORY</p>
            <h2 id="deep-dive-title" className="section__title">核心拓扑与架构原理。</h2>
          </div>
          <TrackDeepArchitecture deepDive={deepDive} />
        </section>
      )}

      {/* 05 / 三年培养中枢 (TrackStageConsole) */}
      <section id="track-stage" className="section mb-24 sm:mb-32" aria-labelledby="stage-title" data-reveal="section">
        <div className="section__head mb-12">
          <p className="caps section__index">05 / STAGE ROADMAP</p>
          <h2 id="stage-title" className="section__title">三年培养体系与阶段里程碑。</h2>
        </div>
        <TrackStageConsole modules={track.curriculumModules} roadmap={track.roadmap} />
      </section>

      {/* 06 / 真实成果与赛事证据 (TrackEvidenceInspector) */}
      {(relatedWorks.length > 0 || relatedAwards.length > 0) && (
        <section id="track-evidence" className="section mb-24 sm:mb-32" aria-labelledby="related-title" data-reveal="section">
          <div className="section__head mb-12">
            <p className="caps section__index">06 / WORKS & HONORS</p>
            <h2 id="related-title" className="section__title">落地工程与赛事荣誉。</h2>
          </div>
          <TrackEvidenceInspector works={relatedWorks} awards={relatedAwards} />
        </section>
      )}

      {/* 07 / 纯净方向切换导航 (无多余文字) */}
      <nav id="track-switch" className="grid grid-cols-3 items-center border-y border-[var(--border)] py-8 mb-20" aria-label="方向切换">
        <Link
          href={`/tracks/${previous.slug}`}
          className="flex items-center gap-2 font-mono text-sm sm:text-base font-bold text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors active:scale-[0.98] group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          <span>{previous.nameZh}</span>
        </Link>

        <Link
          href="/tracks"
          className="flex items-center justify-center gap-1.5 font-mono text-xs sm:text-sm text-[var(--fg-faint)] hover:text-[var(--fg)] transition-colors active:scale-[0.98]"
        >
          <LayoutGrid size={15} aria-hidden="true" />
          <span className="hidden sm:inline">方向总览</span>
        </Link>

        <Link
          href={`/tracks/${next.slug}`}
          className="flex items-center justify-end gap-2 font-mono text-sm sm:text-base font-bold text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors active:scale-[0.98] group"
        >
          <span>{next.nameZh}</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </Link>
      </nav>

      {/* 08 / 招新加入 CTA */}
      <section id="track-join" className="cta-band" aria-label="加入社团" data-reveal="group">
        <div className="space-y-1">
          <p className="font-mono text-xs text-[var(--accent)] font-bold tracking-widest uppercase">08 // RECRUITMENT</p>
          <p>加入云飞扬【{track.nameZh}】方向，参与真实项目研发与算法工程攻坚。</p>
        </div>
        <Button asChild className="active:scale-[0.96] transition-transform">
          <Link href="/join">
            立即报名 <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </Button>
      </section>
    </main>
  );
}
