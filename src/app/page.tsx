import { ArrowDown, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CardCorners } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { TechTag } from "@/components/ui/tech-tag";
import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { Develop } from "@/components/motion/develop";
import { TrackOverviewMatrix } from "@/components/sections/track-overview-matrix";
import { createMetadata } from "@/lib/seo";
import { club, tracks, works } from "@/content";

export const metadata: Metadata = createMetadata({
  title: "首页",
  description: "云飞扬社团成立于 2014 年，涵盖五个核心技术方向，以真实项目驱动、学科竞赛与一对一师徒制陪伴成员成长。",
  path: "/",
});

export default function Home() {
  const feature = works.find((work) => work.slug === "matrix-calculator");
  const stats = [
    { value: club.founded, startValue: 2000, label: "成立" },
    { value: tracks.length, label: "技术方向" },
    { value: club.memberCount, label: "在册成员" },
    { value: Number.parseInt(club.annualAwards, 10), suffix: "+", label: "年均省级以上奖项" },
  ] as const;
  return (
    <main id="main-content" className="home-main" tabIndex={-1}>
      <TrajectoryRail label="首页概览" sections={[
        { id: "home-start", index: "01", label: "首页概览" },
        { id: "home-tracks", index: "02", label: "技术方向" },
        { id: "home-feature", index: "03", label: "代表项目" },
        { id: "home-join", index: "04", label: "招新报名" },
      ]} />
      <section id="home-start" className="home-hero page-shell" aria-labelledby="home-title">
        <div className="home-hero__content">
          <Develop title={(
            <h1 id="home-title" className="display-latin home-hero__title">
              <span className="home-hero__title-line home-hero__title-line--code">
                <span className="home-hero__we">We</span>{" "}<span className="home-hero__code">Code</span>
              </span>
              <span className="home-hero__title-line home-hero__title-line--future">
                <span className="home-hero__the">the</span><span className="home-hero__future">Future</span>
              </span>
            </h1>
          )}>
            <p className="home-hero__subtitle">Student Tech Community <span aria-hidden="true">·</span> Est. {club.founded}</p>
            <p className="home-hero__affiliation"><span>{club.nameEn}</span><i aria-hidden="true" /><span>Guided by Prof. Chen Ke</span></p>
            <div className="home-hero__actions">
              <Button asChild><Link href="/join">加入我们 <ArrowRight aria-hidden="true" size={17} /></Link></Button>
              <Button asChild variant="ghost"><Link href="/works">浏览项目</Link></Button>
            </div>
          </Develop>
        </div>
        <a className="caps home-hero__scroll" href="#home-stats">Scroll <ArrowDown aria-hidden="true" size={14} /></a>
      </section>
      <div className="home-breath" aria-hidden="true" />
      <section id="home-stats" className="section page-shell" aria-labelledby="stats-title">
        <h2 id="stats-title" className="sr-only">社团数据</h2>
        <dl className="stats-grid" data-reveal="group">
          {stats.map((item, index) => (
            <div key={item.label}><dt className="tabular"><NumberTicker value={item.value} startValue={"startValue" in item ? item.startValue : 0} delay={index * 0.06} />{"suffix" in item && item.suffix}</dt><dd>{item.label}</dd></div>
          ))}
        </dl>
      </section>
      <section id="home-tracks" className="section page-shell" aria-labelledby="tracks-title" data-reveal="section">
        <div className="section__head"><p className="caps section__index">02 / Tracks</p><h2 id="tracks-title" className="section__title">五个技术方向，专注深耕。</h2></div>
        <TrackOverviewMatrix tracks={tracks} />
      </section>
      {feature?.detail && feature.image && (
        <section id="home-feature" className="section page-shell" aria-labelledby="feature-title" data-reveal="section">
          <div className="section__head">
            <p className="caps section__index">03 / Featured Project</p>
            <h2 id="feature-title" className="section__title">代表项目展示。</h2>
          </div>
          <article className="home-feature relative overflow-hidden border border-[var(--border-strong)] bg-[var(--surface)] shadow-xs rounded-[var(--radius-sm)]" data-reveal="group">
            <CardCorners />
            <div className="home-feature__media relative group overflow-hidden bg-[var(--surface-2)] border-b lg:border-b-0 lg:border-r border-[var(--border)]">
              <Image
                src={feature.image}
                alt="矩阵计算器亮色主题主界面"
                width={1600}
                height={900}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
              />
            </div>
            <div className="home-feature__copy flex flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div>
                <div className="flex items-center justify-between gap-3 text-xs font-mono text-[var(--fg-faint)] pb-3 mb-4 border-b border-[var(--border)]">
                  <span className="font-bold text-[var(--accent)] tracking-wider">
                    {"WRK-01 // SOFTWARE ENGINEERING"}
                  </span>
                  <span>2026</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--fg)] mb-2.5">
                  {feature.nameZh}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed mb-6 font-sans">
                  {feature.tagline}
                </p>

                {/* Swiss Editorial 结构化亮点 */}
                <div className="space-y-2 mb-6">
                  {feature.highlights.map((item, idx) => (
                    <div
                      key={item}
                      className="flex items-start gap-2.5 p-2.5 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/40 hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] transition-all"
                    >
                      <span className="font-mono text-[11px] text-[var(--accent)] font-bold shrink-0 mt-0.5">
                        {`0${idx + 1} //`}
                      </span>
                      <span className="text-xs text-[var(--fg-muted)] leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 技术栈字典化标签 */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {feature.stackSummary.map((item) => (
                    <TechTag key={item} name={item} />
                  ))}
                </div>
              </div>

              {/* 动作栏 */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--border)]">
                <Button asChild variant="primary" className="active:scale-[0.98]">
                  <Link href={`/works/${feature.slug}`}>
                    查看项目详情 <ArrowRight aria-hidden="true" size={15} />
                  </Link>
                </Button>
                {feature.liveUrl && (
                  <Button asChild variant="ghost" className="active:scale-[0.98]">
                    <a href={feature.liveUrl} target="_blank" rel="noreferrer">
                      在线体验 <ExternalLink aria-hidden="true" size={14} />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </article>
        </section>
      )}
      <section id="home-join" className="cta-band page-shell" aria-label="加入社团" data-reveal="group"><p>{club.subSlogan}</p><Button asChild><Link href="/join">立即报名 <ArrowRight aria-hidden="true" size={17} /></Link></Button></section>
    </main>
  );
}
