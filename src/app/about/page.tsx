import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/layout/page-hero";
import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { MemberLadder } from "@/components/sections/member-ladder";
import { MechanismAccordion } from "@/components/sections/mechanism-accordion";
import { StructuredData } from "@/components/seo/structured-data";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { advisorProfile, annualReport, club, culturePhotos, mechanisms, memberLadder, mentorship, timeline } from "@/content";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({ title: "关于", description: "了解云飞扬社团的起源、成员梯队、阶段考核、一对一师徒制与指导教师。", path: "/about" });

export default function AboutPage() {
  return (
    <main id="main-content" className="page-main page-shell" tabIndex={-1}>
      <StructuredData data={breadcrumbJsonLd([{ name: "首页", path: "/" }, { name: "关于", path: "/about" }])} />
      <TrajectoryRail label="我们是谁" sections={[
        { id: "about-start", index: "01", label: "我们是谁" }, { id: "about-origin", index: "02", label: "起源" },
        { id: "about-years", index: "03", label: "编年史" }, { id: "about-report", index: "04", label: "年度档案" },
        { id: "about-ladder", index: "05", label: "梯队" }, { id: "about-mechanism", index: "06", label: "运转机制" },
        { id: "about-mentorship", index: "07", label: "师徒制" }, { id: "about-advisor", index: "08", label: "指导老师" },
        { id: "about-culture", index: "09", label: "文化" },
      ]} />
      <div id="about-start"><PageHero eyebrow="01 / About" title="About." subtitle="我们是谁" intro="不只是社团，是未来建设者的训练场。" /></div>
      <section id="about-origin" className="section about-origin" aria-labelledby="origin-title">
        <div>
          <p className="caps section__index">02 / Origin</p><h2 id="origin-title" className="section__title">从第一届云计算专业学生开始。</h2>
          <div className="prose"><p>{club.origin}</p></div>
        </div>
        <Image src="/images/photos/lab-main-studio.webp" alt="云飞扬社团主实验室工位全景" width={1400} height={900} sizes="(max-width: 1024px) 100vw, 50vw" />
      </section>
      <section id="about-years" className="section" aria-labelledby="timeline-title">
        <div className="section__head"><p className="caps section__index">03 / Years</p><h2 id="timeline-title" className="section__title">从 2014 到现在。</h2></div>
        <TracingBeam className="year-tracing-beam">
          <ol className="timeline year-scroll clean-list">{timeline.map((item) => <li key={item.year} data-current={item.year === "2026"}><time dateTime={item.year}>{item.year}</time><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol>
        </TracingBeam>
      </section>
      <section id="about-report" className="section annual-report" aria-labelledby="annual-report-title">
        <div className="section__head"><p className="caps section__index">04 / Annual file</p><h2 id="annual-report-title" className="section__title">{annualReport.year} · {annualReport.title}。</h2><p className="section__intro">{annualReport.description}</p></div>
        <dl className="annual-report__metrics">{annualReport.metrics.map((item) => <div key={item.label}><dt className="tabular">{item.value}</dt><dd>{item.label}</dd></div>)}</dl>
        <ol className="annual-report__outcomes clean-list">{annualReport.outcomes.map((item, index) => <li key={item}><span className="caps tabular">0{index + 1}</span><p>{item}</p></li>)}</ol>
      </section>
      <section id="about-ladder" className="section" aria-labelledby="ladder-title">
        <div className="section__head"><p className="caps section__index">05 / Ladder</p><h2 id="ladder-title" className="section__title">四年成长，大三分岔。</h2></div>
        <MemberLadder items={memberLadder} />
      </section>
      <section id="about-mechanism" className="section" aria-labelledby="mechanism-title">
        <div className="section__head"><p className="caps section__index">06 / How it works</p><h2 id="mechanism-title" className="section__title">制度让协作持续。</h2></div>
        <MechanismAccordion items={mechanisms} />
      </section>
      <section id="about-mentorship" className="section mentorship" aria-labelledby="mentorship-title">
        <div><p className="caps section__index">07 / Mentorship</p><h2 id="mentorship-title" className="section__title">师徒制从进门第一天开始。</h2><p className="prose">{mentorship.description}</p></div>
        <dl className="mentorship__stats">{mentorship.training.map((item) => <div key={item.label}><dt className="tabular">{item.value}</dt><dd>{item.label}</dd></div>)}</dl>
      </section>
      <section id="about-advisor" className="section advisor" aria-labelledby="advisor-title">
        <div className="advisor__portraits"><div className="advisor__portrait"><Image src={advisorProfile.image} alt={`${advisorProfile.name}教授正式肖像`} fill sizes="(max-width: 768px) 45vw, 19vw" /></div><div className="advisor__portrait"><Image src={advisorProfile.imageSecondary} alt={`${advisorProfile.name}教授工作肖像`} fill sizes="(max-width: 768px) 45vw, 19vw" /></div></div>
        <div><p className="caps section__index">08 / Advisor</p><h2 id="advisor-title" className="section__title">{advisorProfile.name} · {advisorProfile.title}</h2><p className="section__intro">{advisorProfile.summary}</p><ul>{advisorProfile.roles.map((role) => <li key={role}>{role}</li>)}</ul></div>
      </section>
      <section id="about-culture" className="about-culture" aria-labelledby="culture-title"><p className="caps">09 / Culture</p><h2 id="culture-title">{club.values.map((value) => <span key={value}>[ {value} ]</span>)}</h2><p>{club.motto}</p><div className="culture-gallery">{culturePhotos.map((photo) => <figure key={photo.src} data-orientation={photo.orientation}><div className="culture-gallery__image"><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /></div><figcaption className="caps">{photo.caption}</figcaption></figure>)}</div></section>
    </main>
  );
}
