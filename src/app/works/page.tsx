import { ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { works } from "@/content";

export const metadata: Metadata = { title: "作品", description: "云飞扬社团已上线项目与在研工程记录，包括精确有理数矩阵计算器、智光耀城和智学伴。" };

export default function WorksPage() {
  const live = works.filter((work) => work.status === "已上线");
  const incubating = works.filter((work) => work.status === "在研");
  return (
    <main id="main-content" className="page-main page-shell">
      <PageHero eyebrow="01 / Works" title="Works." subtitle="做过什么" intro="技术标签谁都能贴，能被打开、检验和解释边界的作品更有分量。" />
      <section className="section" aria-labelledby="live-title">
        <div className="section__head"><p className="caps section__index">02 / Shipped</p><h2 id="live-title" className="section__title">已上线。</h2></div>
        <div className="works-list">{live.map((work, index) => <article className="work-row" key={work.slug} data-flip={index % 2 === 1}>
          {work.image && <div className="work-row__media"><Image src={work.image} alt={`${work.nameZh}运行界面`} width={1600} height={900} sizes="(max-width: 1024px) 100vw, 54vw" /></div>}
          <div className="work-row__copy"><p className="caps">{work.status}</p><h2>{work.nameZh}</h2>{work.nameEn && <p className="display-latin work-row__en">{work.nameEn}</p>}<p>{work.tagline}</p><ul>{work.highlights.map((item) => <li key={item}>{item}</li>)}</ul><div className="stack-row">{work.stackSummary.map((item) => <Tag key={item}>{item}</Tag>)}</div><div className="work-row__links">{work.detail && <Button asChild variant="ghost"><Link href={`/works/${work.slug}`}>工程记录 <ArrowRight aria-hidden="true" size={16} /></Link></Button>}{work.liveUrl && <Button asChild variant="link"><a href={work.liveUrl} target="_blank" rel="noreferrer">在线访问 <ExternalLink aria-hidden="true" size={15} /></a></Button>}</div></div>
        </article>)}</div>
      </section>
      {incubating.length > 0 && <section className="section" aria-labelledby="incubating-title"><div className="section__head"><p className="caps section__index">03 / Incubating</p><h2 id="incubating-title" className="section__title">在研与验证中。</h2></div><div className="incubating-grid">{incubating.map((work) => <Card key={work.slug}><p className="caps">{work.status}</p><h3>{work.nameZh}</h3><p>{work.tagline}</p><div className="stack-row">{work.stackSummary.map((item) => <Tag key={item}>{item}</Tag>)}</div></Card>)}</div></section>}
      <section className="cta-band" aria-label="加入社团"><p>想做出下一个？</p><Button asChild><Link href="/join">加入我们 <ArrowRight aria-hidden="true" size={17} /></Link></Button></section>
    </main>
  );
}
