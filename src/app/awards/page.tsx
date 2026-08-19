import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { CertArchive } from "@/components/motion/cert-archive";
import { StructuredData } from "@/components/seo/structured-data";
import { DataTable } from "@/components/ui/data-table";
import { NumberTicker } from "@/components/ui/number-ticker";
import { awards, club, competitionOverview } from "@/content";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({ title: "荣誉", description: "云飞扬社团竞赛成果与已脱敏证书档案，包含 iCAN、智能汽车、数学建模与统计建模等赛事。", path: "/awards" });

export default function AwardsPage() {
  const certAwards = awards.flatMap((award) => award.image ? [{ ...award, image: award.image }] : []);
  return (
    <main id="main-content" className="page-main page-shell" tabIndex={-1}>
      <StructuredData data={breadcrumbJsonLd([{ name: "首页", path: "/" }, { name: "荣誉", path: "/awards" }])} />
      <TrajectoryRail label="荣誉档案" sections={[{ id: "awards-start", index: "01", label: "荣誉" }, { id: "awards-overview", index: "02", label: "赛事总览" }, { id: "awards-archive", index: "03", label: "证书档案" }]} />
      <div id="awards-start"><PageHero eyebrow="01 / Awards" title="Awards." subtitle="荣誉档案" intro={`国家级与省级赛事持续积累 · 省级及以上年均 ${club.annualAwards} 项`} /></div>
      <section id="awards-overview" className="section" aria-labelledby="overview-title" data-reveal="section"><div className="section__head"><p className="caps section__index">02 / Overview</p><h2 id="overview-title" className="section__title">赛事总览。</h2></div><DataTable caption="云飞扬社团竞赛成果总览" columns={[{ key: "competition", label: "竞赛" }, { key: "level", label: "级别" }, { key: "result", label: "成果" }]} rows={[...competitionOverview]} /></section>
      <section id="awards-archive" className="section" aria-labelledby="archive-title" data-reveal="section"><div className="section__head"><p className="caps section__index">03 / Archive</p><h2 id="archive-title" className="section__title">证书档案柜。</h2><p className="section__intro">公开图片均使用已脱敏版本；点击可查看完整档案。</p><p className="awards-archive__count" aria-label={`${certAwards.length} 份公开证书`}><strong><NumberTicker value={certAwards.length} /></strong><span className="caps">Public certificates / 公开证书</span></p></div><CertArchive awards={certAwards} /></section>
    </main>
  );
}
