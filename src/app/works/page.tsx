import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { WorksFilterView } from "@/components/sections/works-filter-view";
import { WorksMetricsBar } from "@/components/sections/works-metrics-bar";
import { StructuredData } from "@/components/seo/structured-data";
import { Button } from "@/components/ui/button";
import { works } from "@/content";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "工程项目",
  description: "云飞扬社团已上线与在研工程项目记录，涵盖矩阵计算器、智光耀城路灯管理平台、智学伴 AI 平台等。",
  path: "/works",
});

export default function WorksPage() {
  return (
    <main id="main-content" className="page-main page-shell" tabIndex={-1}>
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "工程项目", path: "/works" },
        ])}
      />
      <TrajectoryRail
        label="工程项目"
        sections={[
          { id: "works-start", index: "01", label: "项目总览" },
          { id: "works-live", index: "02", label: "已上线" },
          { id: "works-incubating", index: "03", label: "在研项目" },
          { id: "works-join", index: "04", label: "招新报名" },
        ]}
      />
      <div id="works-start">
        <PageHero
          eyebrow="01 / Works"
          title="Works."
          subtitle="工程项目"
          intro="坚持真实可运行的工程落地，展示完整架构设计、技术选型与质量验收依据。"
        />
      </div>

      <WorksMetricsBar />

      <WorksFilterView works={works} />

      <section id="works-join" className="cta-band mt-12" aria-label="加入社团" data-reveal="group">
        <p>想参与开发更多实际工程项目？</p>
        <Button asChild>
          <Link href="/join">
            立即报名 <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </Button>
      </section>
    </main>
  );
}
