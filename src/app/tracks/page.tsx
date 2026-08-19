import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { TracksMap } from "@/components/motion/divergence";
import { StructuredData } from "@/components/seo/structured-data";
import { tracks } from "@/content";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({ title: "方向", description: "人工智能、软工智能、数据库、智能云物联与工业数智化五条技术航道。", path: "/tracks" });

export default function TracksPage() {
  return (
    <main id="main-content" className="page-main page-shell" tabIndex={-1}>
      <StructuredData data={breadcrumbJsonLd([{ name: "首页", path: "/" }, { name: "方向", path: "/tracks" }])} />
      <TrajectoryRail label="五条航道" sections={[{ id: "tracks-start", index: "01", label: "五条航道" }, { id: "tracks-routes", index: "02", label: "选择方向" }]} />
      <div id="tracks-start"><PageHero eyebrow="01 / Tracks" title="Tracks." subtitle="五条航道" intro="因材施教。选一条，走三年。" /></div>
      <section id="tracks-routes" className="section tracks-routes" aria-labelledby="track-list-title">
        <h2 id="track-list-title" className="sr-only">五个技术方向</h2>
        <TracksMap tracks={tracks} />
      </section>
    </main>
  );
}
