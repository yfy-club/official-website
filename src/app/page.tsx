import { ArrowDown, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Tag } from "@/components/ui/tag";
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
        { id: "home-stats", index: "02", label: "社团数据" },
        { id: "home-tracks", index: "03", label: "技术方向" },
        { id: "home-feature", index: "04", label: "代表项目" },
        { id: "home-join", index: "05", label: "招新报名" },
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
          <div className="section__head"><p className="caps section__index">03 / Featured Project</p><h2 id="feature-title" className="section__title">代表项目展示。</h2></div>
          <article className="home-feature" data-reveal="group">
            <div className="home-feature__media"><Image src={feature.image} alt="矩阵计算器亮色主题主界面" width={1600} height={900} sizes="(max-width: 1024px) 100vw, 58vw" /></div>
            <div className="home-feature__copy">
              <p className="caps">{feature.status}</p><h3>{feature.nameZh}</h3><p>{feature.tagline}</p>
              <ul>{feature.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
              <div className="stack-row">{feature.stackSummary.map((item) => <Tag key={item}>{item}</Tag>)}</div>
              <div className="home-feature__links">
                <Button asChild variant="ghost"><Link href={`/works/${feature.slug}`}>查看项目详情</Link></Button>
                {feature.liveUrl && <Button asChild variant="link"><a href={feature.liveUrl} target="_blank" rel="noreferrer">在线体验 <ExternalLink aria-hidden="true" size={15} /></a></Button>}
              </div>
            </div>
          </article>
        </section>
      )}
      <section id="home-join" className="cta-band page-shell" aria-label="加入社团" data-reveal="group"><p>{club.subSlogan}</p><Button asChild><Link href="/join">立即报名 <ArrowRight aria-hidden="true" size={17} /></Link></Button></section>
    </main>
  );
}
