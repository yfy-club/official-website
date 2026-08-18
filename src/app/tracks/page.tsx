import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { Tag } from "@/components/ui/tag";
import { tracks } from "@/content";

export const metadata: Metadata = { title: "方向", description: "人工智能、软工智能、数据库、智能云物联与工业数智化五条技术航道。" };

export default function TracksPage() {
  return (
    <main id="main-content" className="page-main page-shell">
      <PageHero eyebrow="01 / Tracks" title="Tracks." subtitle="五条航道" intro="因材施教。选一条，走三年。" />
      <section className="section" aria-labelledby="track-list-title">
        <h2 id="track-list-title" className="sr-only">五个技术方向</h2>
        <ol className="tracks-grid clean-list">{tracks.map((track) => <li key={track.slug}><Link href={`/tracks/${track.slug}`} className="track-panel"><span className="track-panel__index tabular">{track.index}</span><div><h2>{track.nameZh}</h2><p className="track-panel__en">{track.nameEn}</p><p>{track.positioning}</p><div className="stack-row">{[...track.stack.languages, ...track.stack.frameworks].slice(0, 4).map((item) => <Tag key={item}>{item}</Tag>)}</div><p className="track-panel__goal">→ {track.goal}</p></div><ArrowRight aria-hidden="true" size={20} /></Link></li>)}</ol>
      </section>
    </main>
  );
}
