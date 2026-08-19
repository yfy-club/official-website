import type { Metadata } from "next";

import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { PosterTiltCard } from "@/components/motion/poster-tilt-card";
import { JoinChannels } from "@/components/sections/join-channels";
import { JoinFormLoader } from "@/components/sections/join-form-loader";
import { MechanismAccordion } from "@/components/sections/mechanism-accordion";
import { MemberVoicesMarquee } from "@/components/sections/member-voices-marquee";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import { BrandEmblem } from "@/components/ui/brand-emblem";
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
  title: "加入我们",
  description: "了解云飞扬社团招新要求、选拔流程与常见问题，提交报名申请并加入 2026 迎新交流群。",
  path: "/join",
});

const posters = [
  { src: "/images/posters/poster-recruit-2026-front.webp", label: "2026 招新海报正面" },
  { src: "/images/posters/poster-recruit-2026-back.webp", label: "2026 招新海报背面" },
] as const;

const sections = [
  { id: "join-start", index: "01", label: "招新概览" },
  { id: "join-fit", index: "02", label: "招新要求" },
  { id: "join-process", index: "03", label: "选拔流程" },
  { id: "join-voices", index: "04", label: "成员心声" },
  { id: "join-faq", index: "05", label: "常见问题" },
  { id: "join-poster", index: "06", label: "招新海报" },
];

export default function JoinPage() {
  const trackOptions = tracks.map((track) => ({ label: track.nameZh, value: track.slug }));

  return (
    <main id="main-content" className="page-main page-shell" tabIndex={-1}>
      <StructuredData data={breadcrumbJsonLd([{ name: "首页", path: "/" }, { name: "加入我们", path: "/join" }])} />
      <TrajectoryRail label="招新概览" sections={sections} />

      {/* 01 / 首屏双翼展台：左侧招新宣言、承诺清单与迎新群舱，右侧报名仪表舱 */}
      <section id="join-start" className="section join-hero-stage" aria-labelledby="join-heading" data-reveal="section">
        <div className="join-hero-layout grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2">
          {/* 左翼：宣言、承诺清单与迎新群 CardFrame */}
          <div className="join-pitch lg:col-span-6 flex flex-col gap-6" data-reveal="item">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)]/60 text-xs font-mono text-[var(--fg-muted)] w-fit shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                  <span>Yunfeiyang Club // 2026 招新</span>
                </div>

                <div className="join-pitch__heading">
                  <h1 id="join-heading" className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-normal leading-[1.08] tracking-tight text-[var(--fg)] break-words">
                    Join <br />
                    <span className="text-[var(--accent)] font-medium">Yunfeiyang.</span>
                  </h1>
                </div>
              </div>

              {/* 官方 Logo 徽标 */}
              <div className="join-pitch__emblem shrink-0 flex items-center justify-center pt-2 self-start sm:self-center" aria-hidden="true">
                <BrandEmblem className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32" />
              </div>
            </div>

            <p className="text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed">
              面向热爱技术、追求工程实践的同学开放招新。无论你想深耕算法应用、软件全栈、数据库还是物联网嵌入式，这里都有完善的培养路径。
            </p>

            <ul className="clean-list flex flex-col gap-3.5 py-1 text-sm text-[var(--fg-muted)]">
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-quiet)] text-[var(--accent)] font-mono text-xs font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">参与体系化技术工坊，接受代码审阅与阶段讲评</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-quiet)] text-[var(--accent)] font-mono text-xs font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">一对一师徒定向带学，从编程基础稳步迈向工程实战</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-quiet)] text-[var(--accent)] font-mono text-xs font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">依托科技园专属工位，深度参与真实项目全流程研发</span>
              </li>
            </ul>

            {/* 迎新群舱直接集成在左翼 */}
            <JoinChannels qqGroup={club.qqGroup} />
          </div>

          {/* 右翼：高质感报名仪表舱 */}
          <div id="join-form" className="join-hero-form lg:col-span-6" data-reveal="item">
            <CardFrame className="border-[var(--border-strong)] bg-[var(--surface)] shadow-md">
              <CardFrameHeader>
                <div>
                  <CardFrameTitle>01 // 招新报名表单</CardFrameTitle>
                  <CardFrameDescription>填写个人基本信息与感兴趣的技术方向</CardFrameDescription>
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

      {/* 02 / 招新要求 */}
      <section id="join-fit" className="section" aria-labelledby="criteria-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">02 / Requirements</p>
          <h2 id="criteria-title" className="section__title">招新要求与适合人群。</h2>
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
          <h2 id="process-title" className="section__title">选拔与培养流程。</h2>
        </div>
        <ol className="join-process clean-list" data-reveal="group">
          {joinProcess.map((item, index) => <li key={item}><span className="tabular">0{index + 1}</span><p>{item}</p></li>)}
        </ol>
      </section>

      {/* 04 / 成员声音 */}
      <section id="join-voices" className="section" aria-labelledby="voices-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">04 / Testimonials</p>
          <h2 id="voices-title" className="section__title">成员心声与成长感悟。</h2>
          <p className="section__intro text-sm text-[var(--fg-faint)]">
            注：成员档案采用二次元匿名代称，头像为虚拟角色示意。
          </p>
        </div>
        <MemberVoicesMarquee voices={memberVoices} />
      </section>

      {/* 05 / 常见问题 */}
      <section id="join-faq" className="section" aria-labelledby="faq-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">05 / FAQ</p>
          <h2 id="faq-title" className="section__title">常见问题解答。</h2>
        </div>
        <MechanismAccordion items={faq.map((item) => ({ title: item.question, detail: item.answer }))} />
      </section>

      {/* 06 / 海报 */}
      <section id="join-poster" className="section" aria-labelledby="poster-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">06 / Poster</p>
          <h2 id="poster-title" className="section__title">2026 官方招新海报。</h2>
        </div>
        <PosterTiltCard posters={posters} />
      </section>
    </main>
  );
}
