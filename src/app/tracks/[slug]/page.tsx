import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { awards, tracks, works } from "@/content";

export function generateStaticParams() { return tracks.map((track) => ({ slug: track.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const track = tracks.find((item) => item.slug === slug);
  return track ? { title: track.nameZh, description: track.positioning } : {};
}

export default async function TrackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const trackIndex = tracks.findIndex((item) => item.slug === slug); if (trackIndex < 0) notFound();
  const track = tracks[trackIndex]; const relatedWorks = works.filter((work) => track.relatedWorkSlugs.includes(work.slug)); const relatedAwards = awards.filter((award) => track.relatedAwardIds.includes(award.id));
  const previous = tracks[(trackIndex - 1 + tracks.length) % tracks.length]; const next = tracks[(trackIndex + 1) % tracks.length];
  const stackGroups = [["语言", track.stack.languages], ["框架与平台", track.stack.frameworks], ["工程方向", track.stack.engineering]] as const;
  return (
    <main id="main-content" className="page-main page-shell track-detail">
      <header className="track-detail__hero"><p className="caps">{track.index} / Track</p><h1>{track.nameZh}</h1><p className="display-latin">{track.nameEn}</p><p>{track.positioning}</p></header>
      <section className="section" aria-labelledby="stack-title"><div className="section__head"><p className="caps section__index">02 / Stack</p><h2 id="stack-title" className="section__title">要学会什么。</h2></div><div className="stack-groups">{stackGroups.map(([label, items]) => <div key={label}><h3 className="caps">{label}</h3><div className="stack-row">{items.map((item) => <Tag key={item}>{item}</Tag>)}</div></div>)}</div></section>
      <section className="section" aria-labelledby="roadmap-title"><div className="section__head"><p className="caps section__index">03 / Roadmap</p><h2 id="roadmap-title" className="section__title">三年航迹，终点是两条等权的路。</h2></div><div className="roadmap">{[track.roadmap.freshman, track.roadmap.sophomore].map((stage, index) => <Card className="roadmap__stage" key={stage.label}><p className="caps tabular">0{index + 1}</p><h3>{stage.label}</h3><ul>{stage.items.map((item) => <li key={item}>{item}</li>)}</ul></Card>)}<div className="roadmap__branches">{[track.roadmap.junior.employment, track.roadmap.junior.postgrad].map((stage, index) => <Card key={stage.label}><p className="caps tabular">03.{index + 1}</p><h3>{stage.label}</h3><ul>{stage.items.map((item) => <li key={item}>{item}</li>)}</ul></Card>)}</div></div></section>
      {(relatedWorks.length > 0 || relatedAwards.length > 0) && <section className="section" aria-labelledby="related-title"><div className="section__head"><p className="caps section__index">04 / Evidence</p><h2 id="related-title" className="section__title">相关产出。</h2></div><div className="related-grid">{relatedWorks.map((work) => <Card key={work.slug}><p className="caps">作品 · {work.status}</p><h3>{work.nameZh}</h3><p>{work.tagline}</p>{work.detail && <Link className="text-link" href={`/works/${work.slug}`}>查看工程记录 →</Link>}</Card>)}{relatedAwards.map((award) => <Card key={award.id}><p className="caps">荣誉 · {award.year}</p><h3>{award.competition}</h3><p>{award.result}</p><Link className="text-link" href="/awards">查看荣誉档案 →</Link></Card>)}</div></section>}
      <nav className="pager" aria-label="方向切换"><Link href={`/tracks/${previous.slug}`}><ArrowLeft aria-hidden="true" size={18} /><span><small>上一条航道</small>{previous.nameZh}</span></Link><Link href={`/tracks/${next.slug}`}><span><small>下一条航道</small>{next.nameZh}</span><ArrowRight aria-hidden="true" size={18} /></Link></nav>
      <section className="cta-band" aria-label="加入社团"><p>这条路听起来像你？</p><Button asChild><Link href="/join">加入我们 <ArrowRight aria-hidden="true" size={17} /></Link></Button></section>
    </main>
  );
}
