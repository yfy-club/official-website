import { ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { club, tracks, works } from "@/content";

export const metadata: Metadata = {
  title: "起点",
  description: "云飞扬社团成立于 2014 年，在五条技术航道中以真实项目、竞赛和师徒制陪伴成员成长。",
};

export default function Home() {
  const feature = works.find((work) => work.slug === "matrix-calculator");
  return (
    <main id="main-content" className="home-main">
      <section className="home-hero page-shell" aria-labelledby="home-title">
        <div>
          <p className="caps home-hero__meta">YFY / 2014—NOW</p>
          <h1 id="home-title" className="display-latin home-hero__title">We Code<br />the Future</h1>
          <p className="home-hero__subtitle">学生技术社团 · 成立于 {club.founded}</p>
          <p className="home-hero__affiliation">{club.affiliation}</p>
          <div className="home-hero__actions">
            <Button asChild><Link href="/join">加入我们 <ArrowRight aria-hidden="true" size={17} /></Link></Button>
            <Button asChild variant="ghost"><Link href="/tracks">看看五条航道</Link></Button>
          </div>
        </div>
        <p className="caps home-hero__scroll">Scroll / 向下</p>
      </section>
      <div className="home-breath" aria-hidden="true" />
      <section className="section page-shell" aria-labelledby="stats-title">
        <h2 id="stats-title" className="sr-only">社团数字</h2>
        <dl className="stats-grid">
          {[[String(club.founded), "成立"], [String(tracks.length), "技术方向"], [String(club.memberCount), "在册成员"], [club.annualAwards, "年均省级以上奖项"]].map(([value, label]) => (
            <div key={label}><dt className="tabular">{value}</dt><dd>{label}</dd></div>
          ))}
        </dl>
      </section>
      <section className="section page-shell" aria-labelledby="tracks-title">
        <div className="section__head"><p className="caps section__index">02 / Tracks</p><h2 id="tracks-title" className="section__title">五条航道，选一条走深。</h2></div>
        <ol className="home-tracks clean-list">
          {tracks.map((track) => (
            <li key={track.slug}><Link href={`/tracks/${track.slug}`}><span className="tabular">{track.index}</span><strong>{track.nameZh}</strong><span>{track.tagline}</span><ArrowRight aria-hidden="true" size={18} /></Link></li>
          ))}
        </ol>
      </section>
      {feature?.detail && feature.image && (
        <section className="section page-shell" aria-labelledby="feature-title">
          <div className="section__head"><p className="caps section__index">03 / One real thing</p><h2 id="feature-title" className="section__title">一件现在就能打开的真东西。</h2></div>
          <article className="home-feature">
            <div className="home-feature__media"><Image src={feature.image} alt="矩阵计算器亮色主题主界面" width={1600} height={900} sizes="(max-width: 1024px) 100vw, 58vw" /></div>
            <div className="home-feature__copy">
              <p className="caps">{feature.status}</p><h3>{feature.nameZh}</h3><p>{feature.tagline}</p>
              <ul>{feature.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
              <div className="stack-row">{feature.stackSummary.map((item) => <Tag key={item}>{item}</Tag>)}</div>
              <div className="home-feature__links">
                <Button asChild variant="ghost"><Link href={`/works/${feature.slug}`}>查看工程记录</Link></Button>
                {feature.liveUrl && <Button asChild variant="link"><a href={feature.liveUrl} target="_blank" rel="noreferrer">打开使用 <ExternalLink aria-hidden="true" size={15} /></a></Button>}
              </div>
            </div>
          </article>
        </section>
      )}
      <section className="cta-band page-shell" aria-label="加入社团"><p>{club.subSlogan}</p><Button asChild><Link href="/join">立即加入 <ArrowRight aria-hidden="true" size={17} /></Link></Button></section>
    </main>
  );
}
