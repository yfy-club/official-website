import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/layout/page-hero";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { awards, club, competitionOverview } from "@/content";

export const metadata: Metadata = { title: "荣誉", description: "云飞扬社团竞赛成果与已脱敏证书档案，包含 iCAN、智能汽车、数学建模与统计建模等赛事。" };

export default function AwardsPage() {
  return (
    <main id="main-content" className="page-main page-shell">
      <PageHero eyebrow="01 / Awards" title="Awards." subtitle="荣誉档案" intro={`国家级与省级赛事持续积累 · 省级及以上年均 ${club.annualAwards} 项`} />
      <section className="section" aria-labelledby="overview-title"><div className="section__head"><p className="caps section__index">02 / Overview</p><h2 id="overview-title" className="section__title">赛事总览。</h2></div><DataTable caption="云飞扬社团竞赛成果总览" columns={[{ key: "competition", label: "竞赛" }, { key: "level", label: "级别" }, { key: "result", label: "成果" }]} rows={[...competitionOverview]} /></section>
      <section className="section" aria-labelledby="archive-title"><div className="section__head"><p className="caps section__index">03 / Archive</p><h2 id="archive-title" className="section__title">证书档案柜。</h2><p className="section__intro">公开图片均使用已脱敏版本；点击可查看完整档案。</p></div><div className="cert-grid">{awards.map((award) => award.image && <Dialog key={award.id} title={award.competition} description={`${award.year} · ${award.level} · ${award.result}`} trigger={<button type="button" className="cert-card"><span className="cert-card__image"><Image src={award.image} alt={`${award.year} 年${award.competition}${award.result}证书`} fill sizes="(max-width: 640px) 50vw, 33vw" /></span><span className="caps tabular">{award.year} / {award.level}</span><strong>{award.competition}</strong><span>{award.result}</span></button>}><Image className="cert-full" src={award.image} alt={`${award.year} 年${award.competition}${award.result}证书，公开脱敏版`} width={1800} height={1300} sizes="90vw" /></Dialog>)}</div></section>
    </main>
  );
}
