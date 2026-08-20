import { ArrowLeft, ArrowRight, ExternalLink, LayoutGrid } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { WorkBackButton, WorkReturnLink } from "@/components/layout/work-back-button";
import { CompareSlider } from "@/components/motion/compare-slider";
import { DecisionsAccordion } from "@/components/sections/decisions-accordion";
import { DemoAccountsTable } from "@/components/sections/demo-accounts-table";
import { WorkEngineeringSpecs } from "@/components/sections/work-engineering-specs";
import { WorkPrincipleWorkbench } from "@/components/sections/work-principle-workbench";
import { WorkRelatedTracks } from "@/components/sections/work-related-tracks";
import { WorkSystemTour } from "@/components/sections/work-system-tour";
import { WorkTradeoffsDeck } from "@/components/sections/work-tradeoffs-deck";
import { StructuredData } from "@/components/seo/structured-data";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
          { id: "work-interface", index: "02", label: "系统实录" },
          { id: "work-problem", index: "03", label: "核心挑战" },
          { id: "work-build", index: "04", label: "架构全景" },
          { id: "work-decisions", index: "05", label: "关键决策" },
          { id: "work-specs", index: "06", label: "工程规格" },
          { id: "work-tradeoffs", index: "07", label: "设计权衡" },
          { id: "work-related", index: "08", label: "关联方向" },
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
              <BreadcrumbLink href="/works" scroll={false}>工程项目</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{work.nameZh}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <WorkBackButton slug={work.slug} />
      </div>

      <header id="work-start" className="work-detail__hero">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--accent)] tracking-widest uppercase mb-3">
            <span>WRK-{String(index + 1).padStart(2, "0")} {"//"} TECHNICAL SPEC</span>
            <span className="text-[var(--fg-faint)]">·</span>
            <span className="text-[var(--fg-muted)]">{work.status}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--fg)] leading-[1.05]">
            {work.nameZh}
          </h1>
          {work.nameEn && (
            <p className="display-latin font-display text-xl sm:text-2xl text-[var(--fg-muted)] tracking-tight pt-1">
              {work.nameEn}
            </p>
          )}
          <p className="pt-2 text-base sm:text-lg text-[var(--fg-muted)] leading-relaxed font-sans">{work.tagline}</p>
          <div className="stack-row pt-2">
            {work.stackSummary.map((item) => (
              <TechTag key={item} name={item} />
            ))}
          </div>
          <div className="work-detail__actions pt-2">
            {work.liveUrl && (
              <Button asChild className="rounded-[var(--radius-xs)] active:scale-[0.96] transition-transform font-mono text-xs">
                <a href={work.liveUrl} target="_blank" rel="noreferrer">
                  在线体验 <ExternalLink aria-hidden="true" size={14} className="ml-1" />
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
            <p className="caps section__index">02 / SYSTEMS & INTERFACES</p>
            <h2 id="shots-title" className="section__title">系统界面与交互实录。</h2>
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
        <div className="section__head">
          <p className="caps section__index">03 / THE STORY</p>
          <h2 id="problem-title" className="section__title">为什么做这个项目。</h2>
        </div>
        <div className="prose">
          {detail.problem.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section id="work-build" className="section" aria-labelledby="build-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">04 / ARCHITECTURE SLICES</p>
          <h2 id="build-title" className="section__title">拆开看，它怎样真正运转。</h2>
        </div>
        <WorkPrincipleWorkbench principles={detail.principles} fallbackStack={detail.stack} />
      </section>

      {detail.decisions && detail.decisions.length > 0 && (
        <section id="work-decisions" className="section" aria-labelledby="decisions-title" data-reveal="section">
          <div className="section__head">
            <p className="caps section__index">05 / ENGINEERING DECISIONS</p>
            <h2 id="decisions-title" className="section__title">每个选择，都有不选的那一边。</h2>
          </div>
          <DecisionsAccordion decisions={detail.decisions} />
        </section>
      )}

      {detail.metrics && detail.metrics.length > 0 && (
        <section id="work-specs" className="section" aria-labelledby="specs-title" data-reveal="section">
          <div className="section__head">
            <p className="caps section__index">06 / SPEC READINGS</p>
            <h2 id="specs-title" className="section__title">只放能从源码或测试里复核的读数。</h2>
          </div>
          <WorkEngineeringSpecs metrics={detail.metrics} />
        </section>
      )}

      {detail.tradeoffs && detail.tradeoffs.length > 0 && (
        <section id="work-tradeoffs" className="section" aria-labelledby="tradeoffs-title" data-reveal="section">
          <div className="section__head">
            <p className="caps section__index">07 / EVOLUTION & BOUNDARIES</p>
            <h2 id="tradeoffs-title" className="section__title">哪些边界，我们没有藏起来。</h2>
          </div>
          <WorkTradeoffsDeck tradeoffs={detail.tradeoffs} />
        </section>
      )}

      <section id="work-related" className="section" aria-labelledby="related-track-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">08 / CAREER PATHWAYS</p>
          <h2 id="related-track-title" className="section__title">这件作品，通向哪些能力路径。</h2>
        </div>
        <WorkRelatedTracks tracks={relatedTracks} />
      </section>

      <nav id="work-switch" className="pager pager--with-overview" aria-label="项目切换" data-reveal="group">
        <Link href={`/works/${previous.slug}`} className="active:scale-[0.98] transition-transform">
          <ArrowLeft aria-hidden="true" size={18} />
          <span>
            <small>上一个项目</small>
            {previous.nameZh}
          </span>
        </Link>
        <WorkReturnLink href="/works" slug={work.slug} className="pager__overview active:scale-[0.98] transition-transform">
          <LayoutGrid aria-hidden="true" size={16} />
          <span>
            <small>总览索引</small>全部项目列表
          </span>
        </WorkReturnLink>
        <Link href={`/works/${next.slug}`} className="active:scale-[0.98] transition-transform">
          <span>
            <small>下一个项目</small>
            {next.nameZh}
          </span>
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </nav>

      <section id="work-join" className="border-t border-[var(--border)] pt-14 pb-16 mt-20" aria-label="加入社团" data-reveal="group">
        <div className="space-y-4">
          <p className="font-mono text-xs text-[var(--accent)] font-bold tracking-widest uppercase m-0">
            09 // RECRUITMENT
          </p>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12">
            <h2 className="text-2xl sm:text-4xl lg:text-[2.5rem] font-bold tracking-tight text-[var(--fg)] leading-[1.18] m-0 max-w-4xl">
              加入云飞扬工程研发团队，参与真实高可用系统与前沿算法攻坚。
            </h2>
            <Button asChild size="md" className="px-7 h-12 text-xs sm:text-sm font-bold shrink-0 self-start lg:self-center">
              <Link href="/join">
                立即投递申请 <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
