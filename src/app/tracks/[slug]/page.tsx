import { ArrowLeft, ArrowRight, LayoutGrid, Terminal, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { TrackArchitectureDeck } from "@/components/sections/track-architecture-deck";
import { TrackEvidenceInspector } from "@/components/sections/track-evidence-inspector";
import { TrackMetricsBar } from "@/components/sections/track-metrics-bar";
import { TrackStageConsole } from "@/components/sections/track-stage-console";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tag } from "@/components/ui/tag";
import { TechTag } from "@/components/ui/tech-tag";
import { awards, tracks, works } from "@/content";
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
  const relatedWorks = works.filter((work) => track.relatedWorkSlugs.includes(work.slug));
  const relatedAwards = awards.filter((award) => track.relatedAwardIds.includes(award.id));
  const previous = tracks[(trackIndex - 1 + tracks.length) % tracks.length];
  const next = tracks[(trackIndex + 1) % tracks.length];

  return (
    <main id="main-content" className="page-main page-shell track-detail" tabIndex={-1}>
      <StructuredData data={breadcrumbJsonLd([
        { name: "首页", path: "/" },
        { name: "技术方向", path: "/tracks" },
        { name: track.nameZh, path: `/tracks/${track.slug}` },
      ])} />
      <StructuredData data={trackJsonLd(track)} />
      <TrajectoryRail
        label={track.nameZh}
        sections={[
          { id: "track-start", index: "01", label: "方向概况" },
          { id: "track-metrics", index: "02", label: "核心指标" },
          { id: "track-stack", index: "03", label: "技术栈全景" },
          { id: "track-focus", index: "04", label: "架构攻坚" },
          { id: "track-stage", index: "05", label: "培养中枢" },
          { id: "track-evidence", index: "06", label: "相关成果" },
          { id: "track-switch", index: "07", label: "方向切换" },
          { id: "track-join", index: "08", label: "招新报名" },
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
        <Button asChild variant="ghost" size="sm" className="h-8 px-2.5 font-mono text-xs border border-[var(--border)] rounded-[var(--radius-xs)] hover:bg-[var(--surface-2)] text-[var(--fg-muted)] hover:text-[var(--fg)]">
          <Link href="/tracks">
            <ArrowLeft size={13} aria-hidden="true" />
            <span>返回技术拓扑中枢</span>
          </Link>
        </Button>
      </div>

      {/* 01 / 方向概况 Header */}
      <header id="track-start" className="track-detail__hero mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs font-semibold text-[var(--accent)]">
              TRK-{track.index} {"//"} TECHNICAL DOSSIER
            </span>
            <Badge variant="active">ACTIVE TRACK</Badge>
          </div>
          <h1>{track.nameZh}</h1>
          <p className="display-latin">{track.nameEn}</p>
          <p className="text-base sm:text-lg text-[var(--fg-muted)] leading-relaxed max-w-3xl mt-2 mb-4">
            {track.positioning}
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs font-mono text-[var(--fg-muted)]">
            <span className="text-[var(--fg-faint)]">目标岗位：</span>
            <span className="font-semibold text-[var(--fg)]">{track.goal}</span>
          </div>
        </div>
      </header>

      {/* 02 / 核心指标舱 */}
      {track.metrics && (
        <section id="track-metrics" aria-label="技术方向指标舱">
          <TrackMetricsBar metrics={track.metrics} />
        </section>
      )}

      {/* 03 / 核心技术栈全景与工具链 */}
      <section id="track-stack" className="section mb-14" aria-labelledby="stack-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">03 / Stack & Toolchain</p>
          <h2 id="stack-title" className="section__title">核心技术栈与工具链全景。</h2>
          <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-2xl mt-1">
            覆盖底层语言、核心框架、工程范式与高频开发调试工具，点击技术标签可查看精炼简介与官方文档。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-reveal="group">
          {/* 语言 & 核心框架 */}
          <div className="p-6 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Terminal size={16} className="text-[var(--accent)]" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--fg)]">
                {"编程语言与核心库 // LANGUAGES & LIBS"}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {track.stack.languages.concat(track.stack.frameworks).map((tech) => (
                <TechTag key={tech} name={tech} className="py-1.5 px-3 text-xs" />
              ))}
            </div>
          </div>

          {/* 工程方向与架构范式 */}
          <div className="p-6 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--fg)]">
                {"工程范式与攻坚方向 // PARADIGMS"}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {track.stack.engineering.map((item) => (
                <Tag key={item} className="py-1.5 px-2.5 text-xs bg-[var(--surface-2)] border border-[var(--border)]">
                  {item}
                </Tag>
              ))}
            </div>
          </div>

          {/* 开发者工具链 */}
          <div className="p-6 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Wrench size={16} className="text-[var(--accent)]" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--fg)]">
                {"开发者工具链 // TOOLCHAIN"}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(track.stack.toolchain ?? ["Git", "Docker", "Linux", "VS Code"]).map((tool) => (
                <Kbd key={tool} className="py-1 px-2.5 text-xs">
                  {tool}
                </Kbd>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 04 / 核心架构与重点攻坚领域 (TrackArchitectureDeck 单舱深度解析) */}
      {track.deepFocus && track.deepFocus.length > 0 && (
        <section id="track-focus" className="section mb-14" aria-labelledby="focus-title" data-reveal="section">
          <div className="section__head mb-6">
            <p className="caps section__index">04 / Deep Architecture</p>
            <h2 id="focus-title" className="section__title">核心架构与重点攻坚领域。</h2>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-2xl mt-1">
              深入底层原理与系统架构，真实攻坚工业界与科研中的核心难点。
            </p>
          </div>
          <TrackArchitectureDeck items={track.deepFocus} />
        </section>
      )}

      {/* 05 / 三年培养体系与阶段实训中枢 (TrackStageConsole 统一集成) */}
      <section id="track-stage" className="section mb-14" aria-labelledby="stage-title" data-reveal="section">
        <div className="section__head mb-6">
          <p className="caps section__index">05 / Engineering Console</p>
          <h2 id="stage-title" className="section__title">三年培养体系与阶段实训中枢。</h2>
          <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-2xl mt-1">
            大一筑基、大二专项攻坚、大三就业/升学双通道精准赋能，全程导师代码审查与结项答辩闭环。
          </p>
        </div>
        <TrackStageConsole modules={track.curriculumModules} roadmap={track.roadmap} />
      </section>

      {/* 06 / 相关代表项目与赛事成果 (Cult UI 风格 Side Panel 侧边解析) */}
      {(relatedWorks.length > 0 || relatedAwards.length > 0) && (
        <section id="track-evidence" className="section mb-14" aria-labelledby="related-title" data-reveal="section">
          <div className="section__head mb-6">
            <p className="caps section__index">06 / Outcomes & Evidence</p>
            <h2 id="related-title" className="section__title">代表项目与赛事荣誉。</h2>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-2xl mt-1">
              该技术方向沉淀的真实工程系统与权威学科竞赛凭证，点击项目卡片可呼出侧边架构解析。
            </p>
          </div>
          <TrackEvidenceInspector works={relatedWorks} awards={relatedAwards} />
        </section>
      )}

      {/* 07 / 方向切换导航 */}
      <nav id="track-switch" className="pager pager--with-overview mb-12" aria-label="方向切换" data-reveal="group">
        <Link href={`/tracks/${previous.slug}`}>
          <ArrowLeft aria-hidden="true" size={18} />
          <span><small>上一个方向</small>{previous.nameZh}</span>
        </Link>
        <Link href="/tracks" className="pager__overview">
          <LayoutGrid aria-hidden="true" size={16} />
          <span><small>拓扑索引</small>技术方向总览</span>
        </Link>
        <Link href={`/tracks/${next.slug}`}>
          <span><small>下一个方向</small>{next.nameZh}</span>
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </nav>

      {/* 08 / 招新加入 CTA */}
      <section id="track-join" className="cta-band" aria-label="加入社团" data-reveal="group">
        <p>对【{track.nameZh}】方向感兴趣？欢迎加入云飞扬，在真实工程与竞赛中与我们同行。</p>
        <Button asChild>
          <Link href="/join">立即报名 <ArrowRight aria-hidden="true" size={17} /></Link>
        </Button>
      </section>
    </main>
  );
}
