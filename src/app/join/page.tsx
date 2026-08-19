import type { Metadata } from "next";
import Image from "next/image";

import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { PosterTiltCard } from "@/components/motion/poster-tilt-card";
import { JoinChannels } from "@/components/sections/join-channels";
import { JoinFormLoader } from "@/components/sections/join-form-loader";
import { MechanismAccordion } from "@/components/sections/mechanism-accordion";
import { MemberVoicesMarquee } from "@/components/sections/member-voices-marquee";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import {
  CardFrame,
  CardFrameAction,
  CardFrameDescription,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from "@/components/ui/card";
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
  { id: "join-channel", index: "06", label: "迎新群" },
  { id: "join-poster", index: "07", label: "海报" },
];

export default function JoinPage() {
  const trackOptions = tracks.map((track) => ({ label: track.nameZh, value: track.slug }));

  return (
    <main id="main-content" className="page-main page-shell" tabIndex={-1}>
      <StructuredData data={breadcrumbJsonLd([{ name: "首页", path: "/" }, { name: "加入", path: "/join" }])} />
      <TrajectoryRail label="登机口" sections={sections} />

      {/* 01 / 首屏双翼展台：左侧招新宣言与承诺清单，右侧报名仪表舱 */}
      <section id="join-start" className="section join-hero-stage" aria-labelledby="join-heading" data-reveal="section">
        <div className="join-hero-layout grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2">
          {/* 左翼：宣言、承诺清单与快速入群 Bento */}
          <div className="join-pitch lg:col-span-6 flex flex-col gap-6" data-reveal="item">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)]/60 text-xs font-mono text-[var(--fg-muted)] w-fit shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
              <span>Yunfeiyang Club // Est. 2014</span>
            </div>

            <div className="join-pitch__heading">
              <h1 id="join-heading" className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-normal leading-[1.08] tracking-tight text-[var(--fg)] break-words">
                Join the <br />
                <span className="text-[var(--accent)] font-medium">Revolution.</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed">
                我们在寻找充满激情的建设者、设计师和梦想家。无论你是代码极客还是设计爱好者，这里都有你的位置。
              </p>
            </div>

            <ul className="clean-list flex flex-col gap-3.5 py-1 text-sm text-[var(--fg-muted)]">
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-quiet)] text-[var(--accent)] font-mono text-xs font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">参与专属技术工坊，接受逐行审码与阶段讲评</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-quiet)] text-[var(--accent)] font-mono text-xs font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">一对一师徒制带学，从基础语法跨越至工程实战</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-quiet)] text-[var(--accent)] font-mono text-xs font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">科技园专属工位，亲历企业级真实项目全栈研发</span>
              </li>
            </ul>

            <div className="join-pitch__bento rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-3.5 sm:p-4 flex flex-wrap sm:flex-nowrap items-center gap-3.5 sm:gap-4.5 w-full max-w-md shadow-xs hover:border-[var(--border-strong)] transition-colors">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-[var(--radius-xs)] border border-[var(--border)] bg-white p-1">
                <Image src="/images/qr/qr-group.svg" alt="2026 云飞扬迎新群二维码" width={80} height={80} className="object-contain w-full h-full" />
              </div>
              <div className="flex flex-col justify-center gap-1 min-w-0 flex-1">
                <h4 className="font-mono text-xs font-semibold uppercase text-[var(--fg)] tracking-tight">QQ 扫码加入迎新群</h4>
                <p className="font-sans text-xs text-[var(--fg-muted)] leading-snug">与学长学姐直接交流，获取一手招新资讯</p>
                <span className="font-mono text-xs text-[var(--accent)] mt-0.5 tabular">群号：{club.qqGroup}</span>
              </div>
            </div>
          </div>

          {/* 右翼：高质感报名仪表舱 */}
          <div id="join-form" className="join-hero-form lg:col-span-6" data-reveal="item">
            <CardFrame className="border-[var(--border-strong)] bg-[var(--surface)] shadow-md">
              <CardFrameHeader>
                <div>
                  <CardFrameTitle>01 // 招新报名表单</CardFrameTitle>
                  <CardFrameDescription>留下你的基本信息与志向方向</CardFrameDescription>
                </div>
                <CardFrameAction>
                  <Badge variant="active">2026 RECRUIT</Badge>
                </CardFrameAction>
              </CardFrameHeader>
              <CardPanel className="p-4 sm:p-6 lg:p-7">
                <JoinFormLoader
                  tracks={trackOptions}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || undefined}
                />
              </CardPanel>
            </CardFrame>
          </div>
        </div>
      </section>

      {/* 02 / 适合谁 */}
      <section id="join-fit" className="section" aria-labelledby="criteria-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">02 / Fit</p>
          <h2 id="criteria-title" className="section__title">先确认这里适不适合你。</h2>
        </div>
        <div className="criteria-grid" data-reveal="group">
          <CardFrame>
            <CardFrameHeader>
              <CardFrameTitle>01 // 适合加入</CardFrameTitle>
              <CardFrameAction>
                <Badge variant="success">FIT</Badge>
              </CardFrameAction>
            </CardFrameHeader>
            <CardPanel>
              <ul className="clean-list flex flex-col gap-3 text-sm text-[var(--fg-muted)]">
                {joinCriteria.suitable.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[var(--success)] mt-0.5" aria-hidden="true">+</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CardPanel>
          </CardFrame>
          <CardFrame>
            <CardFrameHeader>
              <CardFrameTitle>02 // 暂不适合</CardFrameTitle>
              <CardFrameAction>
                <Badge variant="neutral">UNFIT</Badge>
              </CardFrameAction>
            </CardFrameHeader>
            <CardPanel>
              <ul className="clean-list flex flex-col gap-3 text-sm text-[var(--fg-muted)]">
                {joinCriteria.unsuitable.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[var(--fg-faint)] mt-0.5" aria-hidden="true">-</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CardPanel>
          </CardFrame>
        </div>
      </section>

      {/* 03 / 流程 */}
      <section id="join-process" className="section" aria-labelledby="process-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">03 / Process</p>
          <h2 id="process-title" className="section__title">从报名到转正。</h2>
        </div>
        <ol className="join-process clean-list" data-reveal="group">
          {joinProcess.map((item, index) => <li key={item}><span className="tabular">0{index + 1}</span><p>{item}</p></li>)}
        </ol>
      </section>

      {/* 04 / 成员声音 */}
      <section id="join-voices" className="section" aria-labelledby="voices-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">04 / Voices</p>
          <h2 id="voices-title" className="section__title">成员怎么说。</h2>
        </div>
        <MemberVoicesMarquee voices={memberVoices} />
      </section>

      {/* 05 / 常见问题 */}
      <section id="join-faq" className="section" aria-labelledby="faq-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">05 / FAQ</p>
          <h2 id="faq-title" className="section__title">常见问题。</h2>
        </div>
        <MechanismAccordion items={faq.map((item) => ({ title: item.question, detail: item.answer }))} />
      </section>

      {/* 06 / 迎新群 */}
      <section id="join-channel" className="section" aria-labelledby="channel-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">06 / Boarding</p>
          <h2 id="channel-title" className="section__title">加入 2026 迎新群。</h2>
        </div>
        <JoinChannels qqGroup={club.qqGroup} />
      </section>

      {/* 07 / 海报 */}
      <section id="join-poster" className="section" aria-labelledby="poster-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">07 / Poster</p>
          <h2 id="poster-title" className="section__title">2026 招新海报。</h2>
        </div>
        <PosterTiltCard posters={posters} />
      </section>
    </main>
  );
}
