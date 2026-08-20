import { AlertTriangle, ArrowLeft, ArrowRight, ExternalLink, LayoutGrid } from "lucide-react";
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
import { WorkTradeoffsDeck } from "@/components/sections/work-tradeoffs-deck";
import { StructuredData } from "@/components/seo/structured-data";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CardCorners, CardFrame } from "@/components/ui/card";
import { ShaderLensBlur } from "@/components/ui/shader-lens-blur";
import { TechTag } from "@/components/ui/tech-tag";
import { tracks, works } from "@/content";
import type { Work } from "@/content/schema";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import { getWorkImageTransitionName } from "@/lib/work-media";

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
  return (
    <main id="main-content" className="page-main page-shell work-detail" tabIndex={-1}>
      <StructuredData data={breadcrumbJsonLd([{ name: "首页", path: "/" }, { name: "作品", path: "/works" }, { name: work.nameZh, path: `/works/${work.slug}` }])} />
      <TrajectoryRail
        label={work.nameZh}
        sections={[
          { id: "work-start", index: "01", label: "项目概览" },
          { id: "work-interface", index: "02", label: "系统实录" },
          { id: "work-problem", index: "03", label: "核心约束" },
          { id: "work-build", index: "04", label: "内核机制" },
          { id: "work-decisions", index: "05", label: "架构抉择" },
          { id: "work-specs", index: "06", label: "规格读数" },
          { id: "work-tradeoffs", index: "07", label: "演进边界" },
          { id: "work-related", index: "08", label: "关联航道" },
          { id: "work-join", index: "09", label: "加入我们" },
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

          {detail.demoNotice && (
            <div className="mb-6 p-4 rounded-[var(--radius-xs)] border-l-4 border-l-[var(--warn)] border border-[var(--warn)]/35 bg-[var(--warn)]/10 dark:bg-[var(--warn)]/15">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[var(--warn)] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--warn)]">
                    MOCK DEMO NOTICE // 演示环境提示
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--fg)] font-medium leading-relaxed m-0">
                    {detail.demoNotice}
                  </p>
                </div>
              </div>
            </div>
          )}

          {detail.demoAccounts && (
            <DemoAccountsTable
              workNameZh={work.nameZh}
              accounts={detail.demoAccounts}
            />
          )}
          {detail.shots && <WorkShotMedia shot={detail.shots} />}
          {detail.gallery && detail.gallery.length > 0 && (
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
          )}
        </section>
      )}

      <section id="work-problem" className="section" aria-labelledby="problem-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">03 / PROBLEM CONSTRAINTS</p>
          <h2 id="problem-title" className="section__title">工程背景与核心约束。</h2>
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
          <h2 id="build-title" className="section__title">内核切面与实现机制。</h2>
        </div>
        <WorkPrincipleWorkbench principles={detail.principles} fallbackStack={detail.stack} />
      </section>

      {detail.decisions && detail.decisions.length > 0 && (
        <section id="work-decisions" className="section" aria-labelledby="decisions-title" data-reveal="section">
          <div className="section__head">
            <p className="caps section__index">05 / ENGINEERING DECISIONS</p>
            <h2 id="decisions-title" className="section__title">架构抉择与取舍论证。</h2>
          </div>
          <DecisionsAccordion decisions={detail.decisions} />
        </section>
      )}

      {detail.metrics && detail.metrics.length > 0 && (
        <section id="work-specs" className="section" aria-labelledby="specs-title" data-reveal="section">
          <div className="section__head">
            <p className="caps section__index">06 / SPEC READINGS</p>
            <h2 id="specs-title" className="section__title">工程规格与测试读数。</h2>
          </div>
          <WorkEngineeringSpecs metrics={detail.metrics} />
        </section>
      )}

      {detail.tradeoffs && detail.tradeoffs.length > 0 && (
        <section id="work-tradeoffs" className="section" aria-labelledby="tradeoffs-title" data-reveal="section">
          <div className="section__head">
            <p className="caps section__index">07 / EVOLUTION & BOUNDARIES</p>
            <h2 id="tradeoffs-title" className="section__title">演进边界与已知限制。</h2>
          </div>
          <WorkTradeoffsDeck tradeoffs={detail.tradeoffs} />
        </section>
      )}

      <section id="work-related" className="section" aria-labelledby="related-track-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">08 / CAREER PATHWAYS</p>
          <h2 id="related-track-title" className="section__title">工程能力与航道映射。</h2>
        </div>
        <WorkRelatedTracks tracks={relatedTracks} />
      </section>

      {/* 底部项目切换导引 */}
      <nav id="work-switch" aria-label="工程项目快速切换" className="my-16" data-reveal="group">
        <CardFrame className="border border-[var(--border-strong)] bg-[var(--surface)] shadow-xs rounded-[var(--radius-sm)] overflow-hidden">
          <CardCorners />
          <div className="grid grid-cols-1 sm:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)] items-stretch">
            {/* 上一个项目 */}
            <Link
              href={`/works/${previous.slug}`}
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
                    PREV {"//"} WRK-{String((index - 1 + detailedWorks.length) % detailedWorks.length + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[var(--fg)] tracking-tight truncate block group-hover:text-[var(--accent)] transition-colors">
                    {previous.nameZh}
                  </span>
                </div>
              </div>
            </Link>

            {/* 中间：返回总览 */}
            <WorkReturnLink
              href="/works"
              slug={work.slug}
              className="sm:col-span-4 p-4 sm:p-5 flex items-center justify-center gap-2 font-mono text-xs font-bold text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)] transition-all active:scale-[0.98] group bg-[var(--surface-2)]/25 select-none"
            >
              <LayoutGrid
                size={14}
                className="text-[var(--accent)] transition-transform group-hover:scale-110"
                aria-hidden="true"
              />
              <span className="tracking-wider uppercase">ALL WORKS {"//"} 项目总览</span>
            </WorkReturnLink>

            {/* 下一个项目 */}
            <Link
              href={`/works/${next.slug}`}
              className="sm:col-span-4 p-5 sm:p-6 flex items-center justify-between group bg-[var(--surface)] hover:bg-[var(--surface-2)]/60 transition-colors active:scale-[0.99] text-right select-none"
            >
              <div className="min-w-0 flex-1">
                <span className="font-mono text-[10px] font-bold text-[var(--fg-faint)] group-hover:text-[var(--accent)] uppercase tracking-wider block transition-colors">
                  NEXT {"//"} WRK-{String((index + 1) % detailedWorks.length + 1).padStart(2, "0")}
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

      <section id="work-join" className="border-t border-[var(--border)] pt-14 pb-16 mt-20" aria-label="加入社团" data-reveal="group">
        <div className="flex flex-col gap-4 sm:gap-5">
          <p className="font-mono text-xs text-[var(--accent)] font-bold tracking-widest uppercase mb-1">
            09 // RECRUITMENT
          </p>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12">
            <h2 className="text-2xl sm:text-4xl lg:text-[2.5rem] font-bold tracking-tight text-[var(--fg)] leading-[1.22] m-0 max-w-4xl">
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
