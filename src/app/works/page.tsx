import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { WorksFilterView } from "@/components/sections/works-filter-view";
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
          eyebrow="01 // WORKS"
          title="Works."
          subtitle="工程项目"
          intro="坚持真实可运行的工程落地，展示完整架构设计、技术选型与质量验收依据。"
          scrollToId="works-live"
          scrollLabel="向下滚动至已上线项目"
        />
      </div>

      <WorksFilterView works={works} />

      <section id="works-join" className="cta-band mt-16" aria-label="加入社团" data-reveal="group">
        <div className="space-y-1.5 text-left">
          <p className="font-mono text-xs text-[var(--accent)] font-bold tracking-widest uppercase">04 // RECRUITMENT</p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--fg)] m-0">
            参与真实高可用系统、算法原型与前沿边缘计算工程攻坚。
          </h2>
        </div>
        <Button asChild size="md" className="px-6 h-11">
          <Link href="/join">
            立即投递申请 <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </Button>
      </section>
    </main>
  );
}
