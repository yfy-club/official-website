import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { DrawPath } from "@/components/motion/draw-path";
import { StructuredData } from "@/components/seo/structured-data";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardMeta } from "@/components/ui/card";
import { StageIndicator } from "@/components/ui/stage-indicator";
import { Tag } from "@/components/ui/tag";
import { awards, tracks, works } from "@/content";
import { breadcrumbJsonLd, createMetadata, trackJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return tracks.map((track) => ({ slug: track.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const track = tracks.find((item) => item.slug === slug);
  return track
    ? createMetadata({
        title: track.nameZh,
        description: track.positioning,
        path: `/tracks/${track.slug}`,
      })
    : {};
}

export default async function TrackDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trackIndex = tracks.findIndex((item) => item.slug === slug);
  if (trackIndex < 0) notFound();

  const track = tracks[trackIndex];
  const relatedWorks = works.filter((work) => track.relatedWorkSlugs.includes(work.slug));
  const relatedAwards = awards.filter((award) => track.relatedAwardIds.includes(award.id));
  const previous = tracks[(trackIndex - 1 + tracks.length) % tracks.length];
  const next = tracks[(trackIndex + 1) % tracks.length];
  const stackGroups = [
    ["语言", track.stack.languages],
    ["框架与平台", track.stack.frameworks],
    ["工程方向", track.stack.engineering],
  ] as const;
  const primaryStages = [track.roadmap.freshman, track.roadmap.sophomore];
  const branchStages = [
    { ...track.roadmap.junior.employment, code: "STG-03A", path: "就业路径", tone: "success" as const },
    { ...track.roadmap.junior.postgrad, code: "STG-03B", path: "升学路径", tone: "warning" as const },
  ];

  return (
    <main id="main-content" className="page-main page-shell track-detail" tabIndex={-1}>
      <StructuredData data={breadcrumbJsonLd([
        { name: "首页", path: "/" },
        { name: "方向", path: "/tracks" },
        { name: track.nameZh, path: `/tracks/${track.slug}` },
      ])} />
      <StructuredData data={trackJsonLd(track)} />
      <TrajectoryRail
        label={track.nameZh}
        sections={[
          { id: "track-start", index: "01", label: "方向" },
          { id: "track-stack", index: "02", label: "技术栈" },
          { id: "track-roadmap", index: "03", label: "三年航迹" },
          { id: "track-evidence", index: "04", label: "相关产出" },
          { id: "track-switch", index: "05", label: "换道" },
          { id: "track-join", index: "06", label: "加入" },
        ]}
      />

      <header id="track-start" className="track-detail__hero">
        <p className="caps">{track.index} / Track</p>
        <h1>{track.nameZh}</h1>
        <p className="display-latin">{track.nameEn}</p>
        <p>{track.positioning}</p>
      </header>

      <section id="track-stack" className="section" aria-labelledby="stack-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">02 / Stack</p>
          <h2 id="stack-title" className="section__title">要学会什么。</h2>
        </div>
        <div className="stack-groups" data-reveal="group">
          {stackGroups.map(([label, items]) => (
            <div key={label}>
              <h3 className="caps">{label}</h3>
              <div className="stack-row">{items.map((item) => <Tag key={item}>{item}</Tag>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="track-roadmap" className="section" aria-labelledby="roadmap-title">
        <div className="section__head" data-reveal="group">
          <p className="caps section__index">03 / Roadmap</p>
          <h2 id="roadmap-title" className="section__title">三年航迹，终点是两条等权的路。</h2>
        </div>
        <DrawPath />
        <div className="roadmap" data-reveal="group">
          {primaryStages.map((stage, index) => (
            <Card className="roadmap__stage" corners key={stage.label} variant="frame">
              <CardMeta
                code={`STG-0${index + 1}`}
                revision={`STEP ${index + 1}/3`}
                status={{ label: index === 0 ? "FOUNDATION" : "CORE", variant: "active" }}
              />
              <CardBody>
                <StageIndicator active={index + 1} label={stage.label} total={3} />
                <h3>{stage.label}</h3>
                <ul>{stage.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </CardBody>
            </Card>
          ))}
          <div className="roadmap__branches">
            {branchStages.map((stage) => (
              <Card corners key={stage.code} variant="frame">
                <CardMeta
                  code={stage.code}
                  revision="STEP 3/3"
                  status={{ label: stage.path, variant: stage.tone }}
                />
                <CardBody>
                  <StageIndicator active={3} label={stage.label} tone={stage.tone} total={3} />
                  <h3>{stage.label}</h3>
                  <ul>{stage.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {(relatedWorks.length > 0 || relatedAwards.length > 0) && (
        <section id="track-evidence" className="section" aria-labelledby="related-title" data-reveal="section">
          <div className="section__head">
            <p className="caps section__index">04 / Evidence</p>
            <h2 id="related-title" className="section__title">相关产出。</h2>
          </div>
          <div className="related-grid" data-reveal="group">
            {relatedWorks.map((work, index) => (
              <Card corners key={work.slug} variant="frame">
                <CardMeta
                  code={`WRK-${String(index + 1).padStart(2, "0")}`}
                  revision="PROJECT"
                  status={{
                    label: work.status,
                    pulse: work.status === "已上线",
                    variant: work.status === "已上线" ? "active" : work.status === "在研" ? "warning" : "neutral",
                  }}
                />
                <CardBody><h3>{work.nameZh}</h3><p>{work.tagline}</p></CardBody>
                {work.detail && <CardFooter><Link className="text-link" href={`/works/${work.slug}`}>查看工程记录 <ArrowRight aria-hidden="true" size={15} /></Link></CardFooter>}
              </Card>
            ))}
            {relatedAwards.map((award, index) => (
              <Card corners key={award.id} variant="frame">
                <CardMeta
                  code={`AWD-${String(index + 1).padStart(2, "0")}`}
                  revision={award.year}
                  status={{ label: award.level, variant: "success" }}
                />
                <CardBody><h3>{award.competition}</h3><p>{award.result}</p></CardBody>
                <CardFooter><Link className="text-link" href="/awards">查看荣誉档案 <ArrowRight aria-hidden="true" size={15} /></Link></CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      <nav id="track-switch" className="pager" aria-label="方向切换" data-reveal="group">
        <Link href={`/tracks/${previous.slug}`}><ArrowLeft aria-hidden="true" size={18} /><span><small>上一条航道</small>{previous.nameZh}</span></Link>
        <Link href={`/tracks/${next.slug}`}><span><small>下一条航道</small>{next.nameZh}</span><ArrowRight aria-hidden="true" size={18} /></Link>
      </nav>
      <section id="track-join" className="cta-band" aria-label="加入社团" data-reveal="group">
        <p>这条路听起来像你？</p>
        <Button asChild><Link href="/join">加入我们 <ArrowRight aria-hidden="true" size={17} /></Link></Button>
      </section>
    </main>
  );
}
