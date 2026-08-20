import { ArrowLeft, ArrowRight, ExternalLink, LayoutGrid } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { CompareSlider } from "@/components/motion/compare-slider";
import { DecisionsAccordion } from "@/components/sections/decisions-accordion";
import { DemoAccountsTable } from "@/components/sections/demo-accounts-table";
import { WorkSystemTour } from "@/components/sections/work-system-tour";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardFrame, CardFrameAction, CardFrameHeader, CardFrameTitle, CardPanel } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ShaderLensBlur } from "@/components/ui/shader-lens-blur";
import { TechTag } from "@/components/ui/tech-tag";
import { tracks, works } from "@/content";
import type { Work } from "@/content/schema";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import { getWorkImageTransitionName } from "@/lib/work-media";
import { buildTourGroups } from "@/lib/work-tour";

const detailedWorks = works.filter((work) => work.detail);
type WorkShot = NonNullable<NonNullable<Work["detail"]>["shots"]>;

function WorkShotMedia({ shot }: { shot: WorkShot }) {
  return shot.type === "comparison"
    ? <CompareSlider dark={shot.dark} light={shot.light} alt={shot.alt} />
    : <div className="shot-single"><Image src={shot.image} alt={shot.alt} width={1600} height={900} sizes="100vw" /></div>;
}

export function generateStaticParams() { return detailedWorks.map((work) => ({ slug: work.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const work = detailedWorks.find((item) => item.slug === slug); return work ? createMetadata({ title: work.nameZh, description: work.tagline, path: `/works/${work.slug}` }) : {}; }

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const index = detailedWorks.findIndex((item) => item.slug === slug); if (index < 0) notFound();
  const work = detailedWorks[index]; const detail = work.detail; if (!detail) notFound();
  const previous = detailedWorks[(index - 1 + detailedWorks.length) % detailedWorks.length]; const next = detailedWorks[(index + 1) % detailedWorks.length];
  const relatedTracks = tracks.filter((track) => work.trackSlugs.includes(track.slug));
  const tourGroups = buildTourGroups(detail.gallery, detail.galleryMode, work.slug);
  return (
    <main id="main-content" className="page-main page-shell work-detail" tabIndex={-1}>
      <StructuredData data={breadcrumbJsonLd([{ name: "首页", path: "/" }, { name: "作品", path: "/works" }, { name: work.nameZh, path: `/works/${work.slug}` }])} />
      <TrajectoryRail
        label={work.nameZh}
        sections={[
          { id: "work-start", index: "01", label: "项目概览" },
          { id: "work-interface", index: "02", label: "系统界面" },
          { id: "work-problem", index: "03", label: "业务背景" },
          { id: "work-build", index: "04", label: "架构实现" },
          { id: "work-evidence", index: "05", label: "质量凭证" },
          { id: "work-limits", index: "06", label: "系统边界" },
          { id: "work-related", index: "07", label: "关联方向" },
          { id: "work-switch", index: "08", label: "项目切换" },
          { id: "work-join", index: "09", label: "招新报名" },
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
              <BreadcrumbLink href="/works">工程项目</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{work.nameZh}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button asChild variant="ghost" size="sm" className="h-8 px-2.5 font-mono text-xs border border-[var(--border)] rounded-[var(--radius-xs)] hover:bg-[var(--surface-2)] text-[var(--fg-muted)] hover:text-[var(--fg)]">
          <Link href="/works">
            <ArrowLeft size={13} aria-hidden="true" />
            <span>返回项目列表</span>
          </Link>
        </Button>
      </div>

      <header id="work-start" className="work-detail__hero">
        <div>
          <p className="caps">01 / Project Case · {work.status}</p>
          <h1>{work.nameZh}</h1>
          {work.nameEn && <p className="display-latin">{work.nameEn}</p>}
          <p>{work.tagline}</p>
          <div className="stack-row">
            {work.stackSummary.map((item) => (
              <TechTag key={item} name={item} />
            ))}
          </div>
          <div className="work-detail__actions">
            {work.liveUrl && (
              <Button asChild className="rounded-[var(--radius-xs)]">
                <a href={work.liveUrl} target="_blank" rel="noreferrer">
                  在线体验 <ExternalLink aria-hidden="true" size={16} />
                </a>
              </Button>
            )}
          </div>
        </div>
        {work.logo && <Image className="work-detail__logo" src={work.logo} alt="" width={220} height={220} />}
        {work.image && (
          <div
            className="work-detail__hero-media relative group/work-hero overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface-2)] shadow-xl"
            style={{ viewTransitionName: getWorkImageTransitionName(work.slug) }}
          >
            <ShaderLensBlur
              className="opacity-35 mix-blend-screen transition-opacity duration-700 group-hover/work-hero:opacity-60"
              variation={
                work.trackSlugs[0] === "ai"
                  ? "triangle"
                  : work.trackSlugs[0] === "cloud-iot"
                    ? "ring"
                    : "square"
              }
              color1="#022c22"
              color2="#0f766e"
              color3="#0284c7"
              color4="#011812"
              speed={0.65}
              intensity={0.9}
            />
            <div className="relative z-10 p-2 sm:p-4 md:p-6 flex items-center justify-center">
              <Image
                src={work.image}
                alt={`${work.nameZh}项目主界面预览`}
                width={1600}
                height={900}
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="w-full h-auto rounded-[var(--radius-xs)] shadow-2xl border border-[var(--border)]/60 object-contain"
                priority
              />
            </div>
          </div>
        )}
      </header>

      {(detail.demoAccounts?.length || detail.shots || detail.gallery?.length) && (
        <section id="work-interface" className="section" aria-labelledby="shots-title" data-reveal="section">
          <div className="section__head">
            <p className="caps section__index">02 / Interface</p>
            <h2 id="shots-title" className="section__title">系统界面与演示。</h2>
          </div>
          {detail.demoAccounts && (
            <DemoAccountsTable workNameZh={work.nameZh} accounts={detail.demoAccounts} />
          )}
          {detail.shots && <WorkShotMedia shot={detail.shots} />}
          {tourGroups ? (
            <WorkSystemTour workNameZh={work.nameZh} workSlug={work.slug} groups={tourGroups} />
          ) : (
            detail.gallery && (
              <div className="work-gallery" data-reveal="group">
                {detail.gallery.map((item, itemIndex) => (
                  <figure key={item.label} className="work-gallery__item">
                    <div className="work-gallery__meta">
                      <span className="caps tabular">{String(itemIndex + 1).padStart(2, "0")}</span>
                      <div>
                        <h3>{item.label}</h3>
                        <p>{item.description}</p>
                      </div>
                    </div>
                    <WorkShotMedia shot={item.shot} />
                    <figcaption className="sr-only">{item.shot.alt}</figcaption>
                  </figure>
                ))}
              </div>
            )
          )}
        </section>
      )}
      <section id="work-problem" className="section" aria-labelledby="problem-title" data-reveal="section">
        <div className="section__head"><p className="caps section__index">03 / Problem</p><h2 id="problem-title" className="section__title">业务背景与问题分析。</h2></div>
        <div className="prose">{detail.problem.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>
      <section id="work-build" className="section" aria-labelledby="build-title" data-reveal="section">
        <div className="section__head"><p className="caps section__index">04 / Architecture</p><h2 id="build-title" className="section__title">技术架构与系统实现。</h2></div>
        <div className="stack-groups" data-reveal="group">
          {Object.entries(detail.stack).map(([label, items]) => (
            <div key={label}>
              <h3 className="caps">{label}</h3>
              <div className="stack-row">{items.map((item) => <TechTag key={item} name={item} />)}</div>
            </div>
          ))}
        </div>
        <DecisionsAccordion decisions={detail.decisions} />
      </section>
      <section id="work-evidence" className="section" aria-labelledby="evidence-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">05 / Quality</p>
          <h2 id="evidence-title" className="section__title">质量保障与验证凭证。</h2>
        </div>
        <CardFrame>
          <CardFrameHeader>
            <CardFrameTitle>05 // 质量验收凭证</CardFrameTitle>
            <CardFrameAction>
              <Badge variant="success">VERIFIED</Badge>
            </CardFrameAction>
          </CardFrameHeader>
          <CardPanel className="p-0">
            <DataTable caption={`${work.nameZh}质量证据`} columns={[{ key: "label", label: "检查项" }, { key: "value", label: "归档结果" }]} rows={detail.evidence} />
          </CardPanel>
        </CardFrame>
      </section>
      <section id="work-limits" className="section work-limits" aria-labelledby="limits-title" data-reveal="section">
        <div className="section__head"><p className="caps section__index">06 / Boundaries</p><h2 id="limits-title" className="section__title">系统边界与已知说明。</h2></div>
        <ul data-reveal="group">{detail.limits.map((limit) => <li key={limit}>{limit}</li>)}</ul>
      </section>
      <section id="work-related" className="section" aria-labelledby="related-track-title" data-reveal="section">
        <div className="section__head"><p className="caps section__index">07 / Tracks</p><h2 id="related-track-title" className="section__title">关联技术方向。</h2></div>
        <div className="related-grid" data-reveal="group">
          {relatedTracks.map((track) => (
            <Card key={track.slug}>
              <p className="caps tabular">{track.index}</p>
              <h3>{track.nameZh}</h3>
              <p>{track.tagline}</p>
              <Link className="text-link" href={`/tracks/${track.slug}`}>查看方向详情 →</Link>
            </Card>
          ))}
        </div>
      </section>
      <nav id="work-switch" className="pager pager--with-overview" aria-label="项目切换" data-reveal="group">
        <Link href={`/works/${previous.slug}`}>
          <ArrowLeft aria-hidden="true" size={18} />
          <span><small>上一个项目</small>{previous.nameZh}</span>
        </Link>
        <Link href="/works" className="pager__overview">
          <LayoutGrid aria-hidden="true" size={16} />
          <span><small>总览索引</small>全部项目列表</span>
        </Link>
        <Link href={`/works/${next.slug}`}>
          <span><small>下一个项目</small>{next.nameZh}</span>
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </nav>
      <section id="work-join" className="cta-band" aria-label="加入社团" data-reveal="group">
        <p>想参与开发更多实际工程项目？</p>
        <Button asChild>
          <Link href="/join">立即报名 <ArrowRight aria-hidden="true" size={17} /></Link>
        </Button>
      </section>
    </main>
  );
}
