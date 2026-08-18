import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { CompareSlider } from "@/components/motion/compare-slider";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Tag } from "@/components/ui/tag";
import { tracks, works } from "@/content";

const detailedWorks = works.filter((work) => work.detail);
export function generateStaticParams() { return detailedWorks.map((work) => ({ slug: work.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const work = detailedWorks.find((item) => item.slug === slug); return work ? { title: work.nameZh, description: work.tagline } : {}; }

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const index = detailedWorks.findIndex((item) => item.slug === slug); if (index < 0) notFound();
  const work = detailedWorks[index]; const detail = work.detail; if (!detail) notFound();
  const previous = detailedWorks[(index - 1 + detailedWorks.length) % detailedWorks.length]; const next = detailedWorks[(index + 1) % detailedWorks.length];
  const relatedTracks = tracks.filter((track) => work.trackSlugs.includes(track.slug));
  return (
    <main id="main-content" className="page-main page-shell work-detail">
      <TrajectoryRail label={work.nameZh} sections={[{ id: "work-start", index: "01", label: "项目" }, { id: "work-interface", index: "02", label: "界面" }, { id: "work-problem", index: "03", label: "问题" }, { id: "work-build", index: "04", label: "实现" }, { id: "work-evidence", index: "05", label: "质量" }, { id: "work-limits", index: "06", label: "边界" }, { id: "work-related", index: "07", label: "关联" }, { id: "work-switch", index: "08", label: "切换" }, { id: "work-join", index: "09", label: "加入" }]} />
      <header id="work-start" className="work-detail__hero"><div><p className="caps">01 / Case file · {work.status}</p><h1>{work.nameZh}</h1>{work.nameEn && <p className="display-latin">{work.nameEn}</p>}<p>{work.tagline}</p><div className="stack-row">{work.stackSummary.map((item) => <Tag key={item}>{item}</Tag>)}</div><div className="work-detail__actions">{work.liveUrl && <Button asChild><a href={work.liveUrl} target="_blank" rel="noreferrer">打开使用 <ExternalLink aria-hidden="true" size={16} /></a></Button>}</div></div>{work.logo && <Image className="work-detail__logo" src={work.logo} alt="" width={220} height={220} />}</header>
      {detail.shots && <section id="work-interface" className="section" aria-labelledby="shots-title"><div className="section__head"><p className="caps section__index">02 / Interface</p><h2 id="shots-title" className="section__title">界面实录。</h2></div>{detail.shots.light ? <CompareSlider dark={detail.shots.dark} light={detail.shots.light} alt={detail.shots.alt} /> : <div className="shot-single"><figure><Image src={detail.shots.dark} alt={detail.shots.alt} width={1600} height={900} sizes="100vw" /></figure></div>}</section>}
      <section id="work-problem" className="section" aria-labelledby="problem-title"><div className="section__head"><p className="caps section__index">03 / Problem</p><h2 id="problem-title" className="section__title">它解决什么。</h2></div><div className="prose">{detail.problem.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>
      <section id="work-build" className="section" aria-labelledby="build-title"><div className="section__head"><p className="caps section__index">04 / Build</p><h2 id="build-title" className="section__title">怎么做的。</h2></div><div className="stack-groups">{Object.entries(detail.stack).map(([label, items]) => <div key={label}><h3 className="caps">{label}</h3><div className="stack-row">{items.map((item) => <Tag key={item}>{item}</Tag>)}</div></div>)}</div><div className="decision-list">{detail.decisions.map((decision) => <Card key={decision.what}><h3>{decision.what}</h3><p>{decision.why}</p></Card>)}</div></section>
      <section id="work-evidence" className="section" aria-labelledby="evidence-title"><div className="section__head"><p className="caps section__index">05 / Evidence</p><h2 id="evidence-title" className="section__title">怎么保证对。</h2></div><DataTable caption={`${work.nameZh}质量证据`} columns={[{ key: "label", label: "检查项" }, { key: "value", label: "归档结果" }]} rows={detail.evidence} /></section>
      <section id="work-limits" className="section work-limits" aria-labelledby="limits-title"><div className="section__head"><p className="caps section__index">06 / Boundaries</p><h2 id="limits-title" className="section__title">边界写在明处。</h2></div><ul>{detail.limits.map((limit) => <li key={limit}>{limit}</li>)}</ul></section>
      <section id="work-related" className="section" aria-labelledby="related-track-title"><div className="section__head"><p className="caps section__index">07 / Related</p><h2 id="related-track-title" className="section__title">关联航道。</h2></div><div className="related-grid">{relatedTracks.map((track) => <Card key={track.slug}><p className="caps tabular">{track.index}</p><h3>{track.nameZh}</h3><p>{track.tagline}</p><Link className="text-link" href={`/tracks/${track.slug}`}>查看方向 →</Link></Card>)}</div></section>
      <nav id="work-switch" className="pager" aria-label="作品切换"><Link href={`/works/${previous.slug}`}><ArrowLeft aria-hidden="true" size={18} /><span><small>上一个作品</small>{previous.nameZh}</span></Link><Link href={`/works/${next.slug}`}><span><small>下一个作品</small>{next.nameZh}</span><ArrowRight aria-hidden="true" size={18} /></Link></nav>
      <section id="work-join" className="cta-band" aria-label="加入社团"><p>想做出下一个？</p><Button asChild><Link href="/join">加入我们 <ArrowRight aria-hidden="true" size={17} /></Link></Button></section>
    </main>
  );
}
