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
  title: "作品",
  description: "云飞扬社团已上线项目与在研工程记录，包括精确有理数矩阵计算器、智光耀城和智学伴。",
  path: "/works",
});

export default function WorksPage() {
  return (
    <main id="main-content" className="page-main page-shell" tabIndex={-1}>
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "作品", path: "/works" },
        ])}
      />
      <TrajectoryRail
        label="作品记录"
        sections={[
          { id: "works-start", index: "01", label: "作品" },
          { id: "works-live", index: "02", label: "已上线" },
          { id: "works-incubating", index: "03", label: "在研" },
          { id: "works-join", index: "04", label: "加入" },
        ]}
      />
      <div id="works-start">
        <PageHero
          eyebrow="01 / Works"
          title="Works."
          subtitle="做过什么"
          intro="技术标签谁都能贴，能被打开、检验和解释边界的作品更有分量。"
        />
      </div>

      <WorksMetricsBar />

      <WorksFilterView works={works} />

      <section id="works-join" className="cta-band mt-12" aria-label="加入社团" data-reveal="group">
        <p>想做出下一个？</p>
        <Button asChild>
          <Link href="/join">
            加入我们 <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </Button>
      </section>
    </main>
  );
}
