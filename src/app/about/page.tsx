import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";
import { advisorProfile, club, mechanisms, memberLadder, mentorship, timeline } from "@/content";

export const metadata: Metadata = { title: "关于", description: "了解云飞扬社团的起源、成员梯队、阶段考核、一对一师徒制与指导教师。" };

export default function AboutPage() {
  return (
    <main id="main-content" className="page-main page-shell">
      <PageHero eyebrow="01 / About" title="About." subtitle="我们是谁" intro="不只是社团，是未来建设者的训练场。" />
      <section className="section about-origin" aria-labelledby="origin-title">
        <div>
          <p className="caps section__index">02 / Origin</p><h2 id="origin-title" className="section__title">从第一届云计算专业学生开始。</h2>
          <div className="prose"><p>{club.origin}</p><p>社团依托{club.platform}，坚持以成员为中心、立足技术实战、注重长远发展，并把兴趣与真实工程结合起来。</p></div>
        </div>
        <Image src="/images/photos/lab-main-studio.png" alt="云飞扬社团主实验室工位全景" width={1400} height={900} sizes="(max-width: 1024px) 100vw, 50vw" />
      </section>
      <section className="section" aria-labelledby="timeline-title">
        <div className="section__head"><p className="caps section__index">03 / Years</p><h2 id="timeline-title" className="section__title">从 2014 到现在。</h2></div>
        <ol className="timeline clean-list">{timeline.map((item) => <li key={item.year}><time dateTime={item.year}>{item.year}</time><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol>
      </section>
      <section className="section" aria-labelledby="ladder-title">
        <div className="section__head"><p className="caps section__index">04 / Ladder</p><h2 id="ladder-title" className="section__title">成长不是直线，大三会分岔。</h2><p className="section__intro">传帮带贯穿全程；阶段主题随年级变化，选择就业与考研两条路径时保持同等支持。</p></div>
        <div className="ladder-grid">{memberLadder.map((item) => <Card key={item.stage}><p className="caps tabular">{item.stage} / {item.count} 人</p><h3>{item.theme}</h3><p>{item.detail}</p></Card>)}</div>
      </section>
      <section className="section" aria-labelledby="mechanism-title">
        <div className="section__head"><p className="caps section__index">05 / How it works</p><h2 id="mechanism-title" className="section__title">靠制度运转，也靠彼此负责。</h2></div>
        <dl className="mechanism-list">{mechanisms.map((item) => <div key={item.title}><dt>{item.title}</dt><dd>{item.detail}</dd></div>)}</dl>
      </section>
      <section className="section mentorship" aria-labelledby="mentorship-title">
        <div><p className="caps section__index">06 / Mentorship</p><h2 id="mentorship-title" className="section__title">师徒制从进门第一天开始。</h2><p className="prose">{mentorship.description}</p></div>
        <dl className="mentorship__stats">{mentorship.training.map((item) => <div key={item.label}><dt className="tabular">{item.value}</dt><dd>{item.label}</dd></div>)}</dl>
      </section>
      <section className="section advisor" aria-labelledby="advisor-title">
        <div className="advisor__portrait"><Image src={advisorProfile.image} alt={`${advisorProfile.name}教授肖像`} fill sizes="(max-width: 768px) 100vw, 38vw" /></div>
        <div><p className="caps section__index">07 / Advisor</p><h2 id="advisor-title" className="section__title">{advisorProfile.name} · {advisorProfile.title}</h2><p className="section__intro">{advisorProfile.summary}</p><ul>{advisorProfile.roles.map((role) => <li key={role}>{role}</li>)}</ul></div>
      </section>
      <section className="about-culture" aria-labelledby="culture-title"><p className="caps">08 / Culture</p><h2 id="culture-title">{club.values.map((value) => <span key={value}>[ {value} ]</span>)}</h2><p>{club.motto}</p></section>
    </main>
  );
}
