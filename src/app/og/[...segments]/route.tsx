import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { club, tracks, works } from "@/content";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false;

const detailedWorks = works.filter((work) => work.detail);
const cards = [
  { segments: ["home"], eyebrow: "YFY / 2014—NOW", title: club.name, subtitle: club.slogan },
  { segments: ["about"], eyebrow: "01 / ABOUT", title: "关于", subtitle: "发展历程、培养机制与团队传承" },
  { segments: ["tracks"], eyebrow: "02 / TRACKS", title: "技术方向", subtitle: "循序渐进，因材施教" },
  ...tracks.map((track) => ({ segments: ["tracks", track.slug], eyebrow: `${track.index} / TRACK`, title: track.nameZh, subtitle: track.nameEn })),
  { segments: ["works"], eyebrow: "03 / WORKS", title: "工程项目", subtitle: "真实可运行的工程实践与质量凭证" },
  ...detailedWorks.map((work) => ({ segments: ["works", work.slug], eyebrow: "CASE FILE", title: work.nameZh, subtitle: work.nameEn ?? work.status })),
  { segments: ["awards"], eyebrow: "04 / AWARDS", title: "竞赛荣誉", subtitle: "学科竞赛成果与脱敏证书档案" },
  { segments: ["join"], eyebrow: "05 / JOIN", title: "招新报名", subtitle: "加入云飞扬，用代码构建未来" },
] as const;

const fontData = readFile(path.join(process.cwd(), "public/fonts/NotoSerifSC-Heading-subset.ttf"));

export function generateStaticParams() {
  return cards.map((card) => ({ segments: [...card.segments] }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ segments: string[] }> },
) {
  const { segments } = await params;
  const key = segments.join("/");
  const card = cards.find((item) => item.segments.join("/") === key);
  if (!card) return new Response("Not found", { status: 404 });
  const fontBuffer = await fontData;
  const font = Uint8Array.from(fontBuffer).buffer;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "64px 72px",
          background: "#0B0D10",
          color: "#ECEFF3",
          fontFamily: "Noto Serif SC",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", color: "#8B94A3", fontSize: 24, letterSpacing: "0.1em" }}>{card.eyebrow}</div>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 600 }}>YFY</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", width: 92, height: 4, background: "#F5794C" }} />
          <div style={{ display: "flex", fontSize: card.title.length > 14 ? 62 : 78, lineHeight: 1.2 }}>{card.title}</div>
          <div style={{ display: "flex", color: "#8B94A3", fontSize: 31 }}>{card.subtitle}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#767F8F", fontSize: 22 }}>
          <span>{club.affiliation}</span>
          <span>yfy.club</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Noto Serif SC", data: font, weight: 600, style: "normal" }],
    },
  );
}
