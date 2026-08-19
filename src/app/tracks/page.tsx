import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { TracksMap } from "@/components/motion/divergence";
import { StructuredData } from "@/components/seo/structured-data";
import { tracks } from "@/content";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "技术方向",
  description: "人工智能、软工智能、数据库、智能云物联与工业数智化五大核心技术方向。",
  path: "/tracks",
});

export default function TracksPage() {
  return (
    <main id="main-content" className="page-main page-shell" tabIndex={-1}>
      <StructuredData data={breadcrumbJsonLd([{ name: "首页", path: "/" }, { name: "技术方向", path: "/tracks" }])} />
      <div id="tracks-start">
        <PageHero
          eyebrow="01 / Tracks"
          title="Tracks."
          subtitle="技术方向"
          intro="循序渐进，因材施教。选定专注方向，完成体系化工程训练。"
        />
      </div>
      <section id="tracks-routes" className="section tracks-routes" aria-labelledby="track-list-title">
        <h2 id="track-list-title" className="sr-only">五个技术方向</h2>
        <TracksMap tracks={tracks} />
      </section>
    </main>
  );
}
