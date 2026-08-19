import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/layout/page-hero";
import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { JoinChannels } from "@/components/sections/join-channels";
import { JoinFormLoader } from "@/components/sections/join-form-loader";
import { MechanismAccordion } from "@/components/sections/mechanism-accordion";
import { StructuredData } from "@/components/seo/structured-data";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { club, faq, joinCriteria, joinProcess, memberVoices, tracks } from "@/content";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "加入",
  description: "了解云飞扬社团招新标准、流程、常见问题，并加入 2026 云飞扬迎新群。",
  path: "/join",
});

const posters = [
  { src: "/images/posters/poster-recruit-2026-front.webp", label: "2026 招新海报正面" },
  { src: "/images/posters/poster-recruit-2026-back.webp", label: "2026 招新海报背面" },
] as const;

const sections = [
  { id: "join-start", index: "01", label: "登机口" },
  { id: "join-fit", index: "02", label: "适合谁" },
  { id: "join-process", index: "03", label: "流程" },
  { id: "join-voices", index: "04", label: "成员声音" },
  { id: "join-faq", index: "05", label: "常见问题" },
  { id: "join-form", index: "06", label: "报名" },
  { id: "join-channel", index: "07", label: "迎新群" },
  { id: "join-poster", index: "08", label: "海报" },
];

export default function JoinPage() {
  const trackOptions = tracks.map((track) => ({ label: track.nameZh, value: track.slug }));

  return (
    <main id="main-content" className="page-main page-shell" tabIndex={-1}>
      <StructuredData data={breadcrumbJsonLd([{ name: "首页", path: "/" }, { name: "加入", path: "/join" }])} />
      <TrajectoryRail label="登机口" sections={sections} />
      <div id="join-start">
        <PageHero eyebrow="01 / Join" title="Join." subtitle="登机口" intro="我们要的不是已经会的人，是想学会的人。" />
      </div>

      <section id="join-fit" className="section" aria-labelledby="criteria-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">02 / Fit</p>
          <h2 id="criteria-title" className="section__title">先确认这里适不适合你。</h2>
        </div>
        <div className="criteria-grid" data-reveal="group">
          <Card><p className="caps">适合加入</p><ul>{joinCriteria.suitable.map((item) => <li key={item}>{item}</li>)}</ul></Card>
          <Card><p className="caps">暂不适合</p><ul>{joinCriteria.unsuitable.map((item) => <li key={item}>{item}</li>)}</ul></Card>
        </div>
      </section>

      <section id="join-process" className="section" aria-labelledby="process-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">03 / Process</p>
          <h2 id="process-title" className="section__title">从报名到转正。</h2>
        </div>
        <ol className="join-process clean-list" data-reveal="group">
          {joinProcess.map((item, index) => <li key={item}><span className="tabular">0{index + 1}</span><p>{item}</p></li>)}
        </ol>
      </section>

      <section id="join-voices" className="section" aria-labelledby="voices-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">04 / Voices</p>
          <h2 id="voices-title" className="section__title">成员怎么说。</h2>
        </div>
        <div className="voices-grid" data-reveal="group">
          {memberVoices.map((voice) => <blockquote key={voice.author}><p>“{voice.quote}”</p><cite>{voice.author}</cite></blockquote>)}
        </div>
      </section>

      <section id="join-faq" className="section" aria-labelledby="faq-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">05 / FAQ</p>
          <h2 id="faq-title" className="section__title">常见问题。</h2>
        </div>
        <MechanismAccordion items={faq.map((item) => ({ title: item.question, detail: item.answer }))} />
      </section>

      <section id="join-form" className="section" aria-labelledby="join-form-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">06 / Apply</p>
          <h2 id="join-form-title" className="section__title">留下你的航向。</h2>
        </div>
        <JoinFormLoader
          tracks={trackOptions}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || undefined}
        />
      </section>

      <section id="join-channel" className="section" aria-labelledby="channel-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">07 / Boarding</p>
          <h2 id="channel-title" className="section__title">加入 2026 迎新群。</h2>
        </div>
        <JoinChannels qqGroup={club.qqGroup} />
      </section>

      <section id="join-poster" className="section" aria-labelledby="poster-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">08 / Poster</p>
          <h2 id="poster-title" className="section__title">2026 招新海报。</h2>
        </div>
        <div className="poster-grid" data-reveal="group">
          {posters.map((poster) => (
            <Dialog
              key={poster.src}
              title={poster.label}
              trigger={(
                <button type="button" className="poster-card">
                  <Image src={poster.src} alt="" width={900} height={1350} sizes="(max-width: 640px) 50vw, 35vw" />
                  <span>{poster.label}</span>
                </button>
              )}
            >
              <Image src={poster.src} alt={poster.label} width={1400} height={2100} sizes="90vw" />
            </Dialog>
          ))}
        </div>
      </section>
    </main>
  );
}
