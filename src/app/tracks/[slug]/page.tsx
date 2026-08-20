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
import { CardCorners, CardFrame } from "@/components/ui/card";
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
          { id: "track-join", index: "07", label: "招新报名" },
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
            <h2 id="deep-dive-title" className="section__title">{deepDive.headline}。</h2>
            <p className="section__intro">{deepDive.description}</p>
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

      {/* 07 / 瑞士工精方向切换与总览终端 (Swiss Precision Terminal) */}
      <nav id="track-switch" aria-label="方向切换" className="mb-20">
        <CardFrame className="border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden">
          <CardCorners />
          <div className="grid grid-cols-1 sm:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)] items-stretch">
            {/* 上一个方向 */}
            <Link
              href={`/tracks/${previous.slug}`}
              className="sm:col-span-4 p-5 sm:p-6 flex items-center justify-between group bg-[var(--surface)] hover:bg-[var(--surface-2)]/60 transition-colors active:scale-[0.99] select-none"
            >
              <div className="flex items-center gap-3 min-w-0">
                <ArrowLeft
                  size={16}
                  className="text-[var(--fg-faint)] group-hover:text-[var(--accent)] group-hover:-translate-x-1 transition-all shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <span className="font-mono text-[10px] font-bold text-[var(--fg-faint)] group-hover:text-[var(--accent)] uppercase tracking-wider block transition-colors">
                    PREV {"//"} {previous.slug}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[var(--fg)] tracking-tight truncate block group-hover:text-[var(--accent)] transition-colors">
                    {previous.nameZh}
                  </span>
                </div>
              </div>
            </Link>

            {/* 中间：返回总览 */}
            <Link
              href="/tracks"
              className="sm:col-span-4 p-4 sm:p-5 flex items-center justify-center gap-2 font-mono text-xs font-bold text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)] transition-all active:scale-[0.98] group bg-[var(--surface-2)]/25 select-none"
            >
              <LayoutGrid
                size={14}
                className="text-[var(--accent)] transition-transform group-hover:scale-110"
                aria-hidden="true"
              />
              <span className="tracking-wider uppercase">ALL TRACKS {"//"} 方向总览</span>
            </Link>

            {/* 下一个方向 */}
            <Link
              href={`/tracks/${next.slug}`}
              className="sm:col-span-4 p-5 sm:p-6 flex items-center justify-between group bg-[var(--surface)] hover:bg-[var(--surface-2)]/60 transition-colors active:scale-[0.99] text-right select-none"
            >
              <div className="min-w-0 flex-1">
                <span className="font-mono text-[10px] font-bold text-[var(--fg-faint)] group-hover:text-[var(--accent)] uppercase tracking-wider block transition-colors">
                  NEXT {"//"} {next.slug}
                </span>
                <span className="text-sm sm:text-base font-bold text-[var(--fg)] tracking-tight truncate block group-hover:text-[var(--accent)] transition-colors">
                  {next.nameZh}
                </span>
              </div>
              <ArrowRight
                size={16}
                className="text-[var(--fg-faint)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all shrink-0 ml-3"
                aria-hidden="true"
              />
            </Link>
          </div>
        </CardFrame>
      </nav>

      {/* 07 / 招新加入 CTA */}
      <section id="track-join" className="cta-band mt-16" aria-label="加入社团" data-reveal="group">
        <div className="space-y-1.5 text-left">
          <p className="font-mono text-xs text-[var(--accent)] font-bold tracking-widest uppercase">07 // RECRUITMENT</p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--fg)] m-0">
            加入云飞扬【{track.nameZh}】方向，参与真实项目研发与算法工程攻坚。
          </h2>
        </div>
        <Button asChild size="md" className="px-6 h-11">
          <Link href="/join">
            立即投递申请 <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </Button>
      </section>
    </main>
  );
}
