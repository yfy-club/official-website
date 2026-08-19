import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/layout/page-hero";
import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { CultureGallery } from "@/components/sections/culture-gallery";
import { MemberLadder } from "@/components/sections/member-ladder";
import { MechanismAccordion } from "@/components/sections/mechanism-accordion";
import { StructuredData } from "@/components/seo/structured-data";
import { NumberTicker } from "@/components/ui/number-ticker";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { advisorProfile, annualReport, club, culturePhotos, mechanisms, memberLadder, mentorship, timeline } from "@/content";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "关于",
  description: "了解云飞扬社团的发展历程、梯队建设、考核机制、师徒带学与指导教师。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main id="main-content" className="page-main page-shell" tabIndex={-1}>
      <StructuredData data={breadcrumbJsonLd([{ name: "首页", path: "/" }, { name: "关于", path: "/about" }])} />
      <TrajectoryRail label="社团概况" sections={[
        { id: "about-start", index: "01", label: "社团概况" },
        { id: "about-origin", index: "02", label: "发展起源" },
        { id: "about-years", index: "03", label: "发展历程" },
        { id: "about-report", index: "04", label: "年度档案" },
        { id: "about-ladder", index: "05", label: "梯队体系" },
        { id: "about-mechanism", index: "06", label: "运转机制" },
        { id: "about-mentorship", index: "07", label: "师徒传承" },
        { id: "about-advisor", index: "08", label: "指导教师" },
        { id: "about-culture", index: "09", label: "团队文化" },
      ]} />
      <div id="about-start">
        <PageHero
          eyebrow="01 / About"
          title="About."
          subtitle="社团概况"
          intro="以真实工程项目、学科竞赛与一对一师徒带学为核心的技术成长共同体。"
        />
      </div>
      <section id="about-origin" className="section about-origin" aria-labelledby="origin-title" data-reveal="group">
        <div>
          <p className="caps section__index">02 / Origin</p>
          <h2 id="origin-title" className="section__title">发展起源。</h2>
          <div className="prose"><p>{club.origin}</p></div>
        </div>
        <Image src="/images/photos/lab-main-studio.webp" alt="云飞扬社团主实验室工位全景" width={1400} height={900} sizes="(max-width: 1024px) 100vw, 50vw" />
      </section>
      <section id="about-years" className="section" aria-labelledby="timeline-title">
        <div className="section__head" data-reveal="group">
          <p className="caps section__index">03 / History</p>
          <h2 id="timeline-title" className="section__title">发展历程（2014 至今）。</h2>
        </div>
        <TracingBeam className="year-tracing-beam">
          <ol className="timeline year-scroll clean-list">{timeline.map((item) => <li key={item.year} data-current={item.year === "2026"}><time dateTime={item.year}>{item.year}</time><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol>
        </TracingBeam>
      </section>
      <section id="about-report" className="section annual-report" aria-labelledby="annual-report-title" data-reveal="section">
        <div className="section__head"><p className="caps section__index">04 / Annual file</p><h2 id="annual-report-title" className="section__title">{annualReport.year} · {annualReport.title}。</h2><p className="section__intro">{annualReport.description}</p></div>
        <dl className="annual-report__metrics" data-reveal="group">{annualReport.metrics.map((item, index) => <div key={item.label}><dt className="tabular"><NumberTicker value={Number(item.value)} delay={index * 0.06} /></dt><dd>{item.label}</dd></div>)}</dl>
        <ol className="annual-report__outcomes clean-list" data-reveal="group">{annualReport.outcomes.map((item, index) => <li key={item}><span className="caps tabular">0{index + 1}</span><p>{item}</p></li>)}</ol>
      </section>
      <section id="about-ladder" className="section" aria-labelledby="ladder-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">05 / Ladder</p>
          <h2 id="ladder-title" className="section__title">四年培养梯队与发展路径。</h2>
        </div>
        <MemberLadder items={memberLadder} />
      </section>
      <section id="about-mechanism" className="section" aria-labelledby="mechanism-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">06 / Governance</p>
          <h2 id="mechanism-title" className="section__title">规范化管理与运转机制。</h2>
        </div>
        <MechanismAccordion items={mechanisms} />
      </section>
      <section id="about-mentorship" className="section mentorship" aria-labelledby="mentorship-title" data-reveal="group">
        <div>
          <p className="caps section__index">07 / Mentorship</p>
          <h2 id="mentorship-title" className="section__title">一对一师徒传承机制。</h2>
          <p className="prose">{mentorship.description}</p>
        </div>
        <dl className="mentorship__stats">{mentorship.training.map((item, index) => <div key={item.label}><dt className="tabular"><NumberTicker value={Number(item.value)} delay={index * 0.06} /></dt><dd>{item.label}</dd></div>)}</dl>
      </section>
      <section id="about-advisor" className="section advisor" aria-labelledby="advisor-title" data-reveal="group">
        <div className="advisor__portraits"><div className="advisor__portrait"><Image src={advisorProfile.image} alt={`${advisorProfile.name}教授正式肖像`} fill sizes="(max-width: 768px) 45vw, 19vw" /></div><div className="advisor__portrait"><Image src={advisorProfile.imageSecondary} alt={`${advisorProfile.name}教授工作肖像`} fill sizes="(max-width: 768px) 45vw, 19vw" /></div></div>
        <div>
          <p className="caps section__index">08 / Advisor</p>
          <h2 id="advisor-title" className="section__title">指导教师：{advisorProfile.name} {advisorProfile.title}</h2>
          <p className="section__intro">{advisorProfile.summary}</p>
          <ul>{advisorProfile.roles.map((role) => <li key={role}>{role}</li>)}</ul>
        </div>
      </section>
      <section id="about-culture" className="about-culture" aria-labelledby="culture-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">09 / Culture</p>
          <h2 id="culture-title" className="section__title">
            {club.values.map((value) => <span key={value}>[ {value} ] </span>)}
          </h2>
          <p className="section__intro">{club.motto}</p>
        </div>
        <CultureGallery photos={culturePhotos} />
      </section>
    </main>
  );
}
