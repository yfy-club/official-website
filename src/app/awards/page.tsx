import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { CertArchive } from "@/components/motion/cert-archive";
import { AwardsMetricsBar } from "@/components/sections/awards-metrics-bar";
import { AwardsOverviewMatrix } from "@/components/sections/awards-overview-matrix";
import { StructuredData } from "@/components/seo/structured-data";
import { awards, club } from "@/content";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "竞赛荣誉",
  description: "云飞扬社团学科竞赛成果与脱敏证书档案，涵盖 iCAN、智能汽车、蓝桥杯、数学建模等赛事。",
  path: "/awards",
});

export default function AwardsPage() {
  const certAwards = awards.flatMap((award) =>
    award.image
      ? [
          {
            ...award,
            image: award.image,
            description: award.description ?? `${award.year} 年 ${award.competition} ${award.result}`,
            trackSlugs: award.trackSlugs ?? [],
          },
        ]
      : []
  );

  return (
    <main id="main-content" className="page-main page-shell" tabIndex={-1}>
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "竞赛荣誉", path: "/awards" },
        ])}
      />
      <TrajectoryRail
        label="竞赛荣誉"
        sections={[
          { id: "awards-start", index: "01", label: "荣誉概况" },
          { id: "awards-overview", index: "02", label: "赛事总览" },
          { id: "awards-archive", index: "03", label: "证书档案" },
        ]}
      />
      <div id="awards-start">
        <PageHero
          eyebrow="01 / Awards"
          title="Awards."
          subtitle="竞赛荣誉"
          intro={`国家级与省级学科竞赛成果持续沉淀 · 年均获省级及以上奖项 ${club.annualAwards} 项`}
        />
      </div>

      <AwardsMetricsBar certCount={certAwards.length} />

      <section
        id="awards-overview"
        className="section mb-14"
        aria-labelledby="overview-title"
        data-reveal="section"
      >
        <div className="section__head">
          <p className="caps section__index">02 / Overview</p>
          <h2 id="overview-title" className="section__title">
            赛事成果总览。
          </h2>
          <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-2xl mt-1">
            涵盖算法编程、AI 视觉、嵌入式智能车、数学与统计建模、创新创业等多个赛道。
          </p>
        </div>
        <AwardsOverviewMatrix />
      </section>

      <section
        id="awards-archive"
        className="section mb-12"
        aria-labelledby="archive-title"
        data-reveal="section"
      >
        <div className="section__head">
          <p className="caps section__index">03 / Archive</p>
          <h2 id="archive-title" className="section__title">
            证书档案库。
          </h2>
          <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-2xl mt-1">
            公开展示证书均已做脱敏处理；支持按级别与年份即时筛选，点击可查看原件大图。
          </p>
        </div>
        <CertArchive awards={certAwards} />
      </section>
    </main>
  );
}
