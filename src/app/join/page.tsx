import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { TrajectoryRail } from "@/components/layout/trajectory-rail";
import { PosterTiltCard } from "@/components/motion/poster-tilt-card";
import { JoinChannels } from "@/components/sections/join-channels";
import { JoinCriteriaMatrix } from "@/components/sections/join-criteria-matrix";
import { JoinFormLoader } from "@/components/sections/join-form-loader";
import { JoinProcessStepper } from "@/components/sections/join-process-stepper";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { MemberVoicesMarquee } from "@/components/sections/member-voices-marquee";
import { StructuredData } from "@/components/seo/structured-data";
import { BrandEmblem } from "@/components/ui/brand-emblem";
import {
  CardCorners,
  CardFrame,
  CardFrameDescription,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from "@/components/ui/card";
import { club, faq, memberVoices, tracks } from "@/content";
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
  { id: "join-application", index: "02", label: "申请与迎新群" },
  { id: "join-fit", index: "03", label: "招新要求" },
  { id: "join-process", index: "04", label: "选拔流程" },
  { id: "join-voices", index: "05", label: "成员心声" },
  { id: "join-faq", index: "06", label: "常见问题" },
  { id: "join-poster", index: "07", label: "招新海报" },
];

export default function JoinPage() {
  const trackOptions = tracks.map((track) => ({ label: track.nameZh, value: track.slug }));

  return (
    <main id="main-content" className="page-main page-shell" tabIndex={-1}>
      <StructuredData data={breadcrumbJsonLd([{ name: "首页", path: "/" }, { name: "加入我们", path: "/join" }])} />
      <TrajectoryRail label="招新概览" sections={sections} />

      {/* 01 / 全屏高留白 Swiss Editorial Hero */}
      <div id="join-start">
        <PageHero
          eyebrow="01 // JOIN US"
          title="Join."
          subtitle="加入我们"
          intro="面向全校热爱技术、追求工程实践与算法攻坚的同学开放招新。选定专注方向，完成体系化工程培养与梯队入驻。"
          scrollToId="join-application"
          scrollLabel="向下滚动至招新申请与迎新群"
        />
      </div>

      {/* 02 / 招新申请与迎新群 */}
      <section id="join-application" className="section join-hero-stage mb-14" aria-labelledby="application-title" data-reveal="section">
        <div className="section__head mb-8">
          <p className="caps section__index">02 / APPLICATION</p>
          <h2 id="application-title" className="section__title">招新申请与迎新群。</h2>
        </div>
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
                  <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.08] tracking-tight text-[var(--fg)] break-words">
                    Join <br />
                    <span className="text-[var(--accent)] font-medium">Yunfeiyang.</span>
                  </h3>
                </div>
              </div>

              {/* 官方 Logo 徽标 */}
              <div className="join-pitch__emblem shrink-0 flex items-center justify-center pt-2 self-start sm:self-center" aria-hidden="true">
                <BrandEmblem className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28" />
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
            <CardFrame className="join-hero-form__frame border-[var(--border-strong)] bg-[var(--surface)] shadow-md">
              <CardCorners />
              <CardFrameHeader>
                <div>
                  <CardFrameTitle>02.1 // 招新报名表单</CardFrameTitle>
                  <CardFrameDescription>填写个人基本信息与感兴趣的技术方向</CardFrameDescription>
                </div>
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

      {/* 03 / 招新要求 */}
      <section id="join-fit" className="section" aria-labelledby="criteria-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">03 / FIT CRITERIA</p>
          <h2 id="criteria-title" className="section__title">招新要求与适合人群。</h2>
        </div>
        <div data-reveal="item">
          <JoinCriteriaMatrix />
        </div>
      </section>

      {/* 04 / 流程 */}
      <section id="join-process" className="section" aria-labelledby="process-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">04 / PROCESS & STAGES</p>
          <h2 id="process-title" className="section__title">选拔与培养流程。</h2>
        </div>
        <JoinProcessStepper />
      </section>

      {/* 05 / 成员声音 */}
      <section id="join-voices" className="section" aria-labelledby="voices-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">05 / MEMBER VOICES</p>
          <h2 id="voices-title" className="section__title">成员心声与成长感悟。</h2>
          <p className="section__intro text-sm text-[var(--fg-faint)]">
            注：成员档案采用二次元匿名代称，头像为虚拟角色示意。
          </p>
        </div>
        <MemberVoicesMarquee voices={memberVoices} />
      </section>

      {/* 06 / 常见问题 */}
      <section id="join-faq" className="section" aria-labelledby="faq-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">06 / FAQ & DIRECTORY</p>
          <h2 id="faq-title" className="section__title">常见问题解答。</h2>
        </div>
        <FaqAccordion items={faq} />
      </section>

      {/* 07 / 海报 */}
      <section id="join-poster" className="section" aria-labelledby="poster-title" data-reveal="section">
        <div className="section__head">
          <p className="caps section__index">07 / OFFICIAL POSTERS</p>
          <h2 id="poster-title" className="section__title">2026 官方招新海报。</h2>
        </div>
        <PosterTiltCard posters={posters} />
      </section>
    </main>
  );
}
