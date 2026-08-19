import { ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import { Card, CardBody, CardFooter, CardMeta } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { works } from "@/content";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import { countWorkScreenshots } from "@/lib/work-media";

export const metadata: Metadata = createMetadata({ title: "作品", description: "云飞扬社团已上线项目与在研工程记录，包括精确有理数矩阵计算器、智光耀城和智学伴。", path: "/works" });

export default function WorksPage() {
  const live = works.filter((work) => work.status === "已上线");
  const incubating = works.filter((work) => work.status === "在研");
  return (
    <main id="main-content" className="page-main page-shell" tabIndex={-1}>
      <StructuredData data={breadcrumbJsonLd([{ name: "首页", path: "/" }, { name: "作品", path: "/works" }])} />
      <TrajectoryRail label="作品记录" sections={[{ id: "works-start", index: "01", label: "作品" }, { id: "works-live", index: "02", label: "已上线" }, { id: "works-incubating", index: "03", label: "在研" }, { id: "works-join", index: "04", label: "加入" }]} />
      <div id="works-start"><PageHero eyebrow="01 / Works" title="Works." subtitle="做过什么" intro="技术标签谁都能贴，能被打开、检验和解释边界的作品更有分量。" /></div>
      <section id="works-live" className="section" aria-labelledby="live-title" data-reveal="section">
        <div className="section__head"><p className="caps section__index">02 / Shipped</p><h2 id="live-title" className="section__title">已上线。</h2></div>
        <div className="works-list" data-reveal="group">{live.map((work, index) => <SpotlightCard key={work.slug} image={work.image} alt={`${work.nameZh}运行界面`} flip={index % 2 === 1} workSlug={work.detail ? work.slug : undefined}>
          <div className="work-row__copy"><div className="work-row__status"><Badge variant="active" pulse>{work.status}</Badge>{work.detail && <span className="caps tabular">{countWorkScreenshots(work)} Screens / 系统实录</span>}</div><h2>{work.nameZh}</h2>{work.nameEn && <p className="display-latin work-row__en">{work.nameEn}</p>}<p>{work.tagline}</p><ul>{work.highlights.map((item) => <li key={item}>{item}</li>)}</ul><div className="stack-row">{work.stackSummary.map((item) => <Tag key={item}>{item}</Tag>)}</div><div className="work-row__links">{work.detail && <Button asChild variant="ghost"><Link href={`/works/${work.slug}`}>工程记录 <ArrowRight aria-hidden="true" size={16} /></Link></Button>}{work.liveUrl && <Button asChild variant="link"><a href={work.liveUrl} target="_blank" rel="noreferrer">在线访问 <ExternalLink aria-hidden="true" size={15} /></a></Button>}</div></div>
        </SpotlightCard>)}</div>
      </section>
      {incubating.length > 0 && <section id="works-incubating" className="section" aria-labelledby="incubating-title" data-reveal="section"><div className="section__head"><p className="caps section__index">03 / Incubating</p><h2 id="incubating-title" className="section__title">在研与验证中。</h2></div><div className="incubating-grid" data-reveal="group">{incubating.map((work, index) => <Card corners key={work.slug} variant="frame"><CardMeta code={`LAB-${String(index + 1).padStart(2, "0")}`} revision="REV 2026.1" status={{ label: work.status, variant: "warning" }} /><CardBody><h3>{work.nameZh}</h3><p>{work.tagline}</p><div className="stack-row">{work.stackSummary.map((item) => <Tag key={item}>{item}</Tag>)}</div></CardBody><CardFooter><span>{work.trackSlugs.length} 条关联航道</span><span>{work.stackSummary.length} 项技术</span></CardFooter><BorderBeam borderWidth={1} colorFrom="var(--warn)" colorTo="var(--accent)" delay={index * 2.4} duration={10} initialOffset={index * 17} size={92} /></Card>)}</div></section>}
      <section id="works-join" className="cta-band" aria-label="加入社团" data-reveal="group"><p>想做出下一个？</p><Button asChild><Link href="/join">加入我们 <ArrowRight aria-hidden="true" size={17} /></Link></Button></section>
    </main>
  );
}
