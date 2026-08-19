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
  title: "荣誉",
  description: "云飞扬社团竞赛成果与已脱敏证书档案，包含 iCAN、智能汽车、数学建模与统计建模等赛事。",
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
          { name: "荣誉", path: "/awards" },
        ])}
      />
      <TrajectoryRail
        label="荣誉档案"
        sections={[
          { id: "awards-start", index: "01", label: "荣誉" },
          { id: "awards-overview", index: "02", label: "赛事总览" },
          { id: "awards-archive", index: "03", label: "证书档案" },
        ]}
      />
      <div id="awards-start">
        <PageHero
          eyebrow="01 / Awards"
          title="Awards."
          subtitle="荣誉档案"
          intro={`国家级与省级赛事持续积累 · 省级及以上年均 ${club.annualAwards} 项`}
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
            赛事总览。
          </h2>
          <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-2xl mt-1">
            覆盖算法编程、AI视觉、智能车、数学统计建模与创新创业等多维竞赛梯队。
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
            证书档案柜。
          </h2>
          <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-2xl mt-1">
            公开图片均使用已脱敏版本；支持按赛事级别与年份即时检索，点击可进入暗室灯箱查看原件。
          </p>
        </div>
        <CertArchive awards={certAwards} />
      </section>
    </main>
  );
}
