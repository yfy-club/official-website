import { describe, expect, it } from "vitest";

import { tracks, works } from "@/content";
import type { Track, Work } from "@/content/schema";
import { buildTrackPreviews, getTrackPreview } from "@/lib/track-previews";

describe("track preview mapping", () => {
  it("maps each track to its verified real work preview or honest empty state", () => {
    const aiTrack = tracks.find((t) => t.slug === "ai")!;
    const softwareTrack = tracks.find((t) => t.slug === "software")!;
    const databaseTrack = tracks.find((t) => t.slug === "database")!;
    const cloudIotTrack = tracks.find((t) => t.slug === "cloud-iot")!;
    const industrialTrack = tracks.find((t) => t.slug === "industrial")!;

    const aiPreview = getTrackPreview(aiTrack, works);
    expect(aiPreview).toEqual({
      workSlug: "intellibuddy",
      workNameZh: "智学伴 · AI 智能学习平台",
      image: "/images/works/zhixueban/zhixueban-light.webp",
      alt: "人工智能航道关联实录：智学伴 · AI 智能学习平台",
    });

    const softwarePreview = getTrackPreview(softwareTrack, works);
    expect(softwarePreview).toEqual({
      workSlug: "matrix-calculator",
      workNameZh: "矩阵计算器 · 精确有理数",
      image: "/images/works/matrix-calculator/matrix-light.webp",
      alt: "软工智能航道关联实录：矩阵计算器 · 精确有理数",
    });

    const databasePreview = getTrackPreview(databaseTrack, works);
    expect(databasePreview).toEqual({
      workSlug: "zgyc-smart-light",
      workNameZh: "智光耀城 · 智慧路灯管理平台",
      image: "/images/works/zgyc-smart-light/zgyc-light.webp",
      alt: "数据库航道关联实录：智光耀城 · 智慧路灯管理平台",
    });

    const cloudIotPreview = getTrackPreview(cloudIotTrack, works);
    expect(cloudIotPreview).toEqual({
      workSlug: "zgyc-smart-light",
      workNameZh: "智光耀城 · 智慧路灯管理平台",
      image: "/images/works/zgyc-smart-light/zgyc-light.webp",
      alt: "智能云物联航道关联实录：智光耀城 · 智慧路灯管理平台",
    });

    const industrialPreview = getTrackPreview(industrialTrack, works);
    expect(industrialPreview).toBeNull();
  });

  it("rejects works that lack a detail object or an image", () => {
    const mockTrack: Pick<Track, "nameZh" | "relatedWorkSlugs"> = {
      nameZh: "测试",
      relatedWorkSlugs: ["no-detail-work", "no-image-work", "valid-work"],
    };

    const mockWorks: Work[] = [
      {
        slug: "no-detail-work",
        nameZh: "无详情作品",
        nameEn: "No Detail Work",
        status: "已上线",
        tagline: "测试",
        trackSlugs: ["software"],
        image: "/images/mock.webp",
        logo: "/images/logo.svg",
        stackSummary: ["Test"],
        highlights: ["Test"],
      } as Work,
      {
        slug: "no-image-work",
        nameZh: "无图片作品",
        nameEn: "No Image Work",
        status: "已上线",
        tagline: "测试",
        trackSlugs: ["software"],
        image: "",
        logo: "/images/logo.svg",
        stackSummary: ["Test"],
        highlights: ["Test"],
        detail: {
          problem: ["problem"],
          stack: {},
          decisions: [],
          evidence: [],
          limits: [],
        },
      } as unknown as Work,
      {
        slug: "valid-work",
        nameZh: "有效作品",
        nameEn: "Valid Work",
        status: "已上线",
        tagline: "测试",
        trackSlugs: ["software"],
        image: "/images/valid.webp",
        logo: "/images/logo.svg",
        stackSummary: ["Test"],
        highlights: ["Test"],
        detail: {
          problem: ["problem"],
          stack: {},
          decisions: [],
          evidence: [],
          limits: [],
        },
      } as Work,
    ];

    const preview = getTrackPreview(mockTrack, mockWorks);
    expect(preview).toEqual({
      workSlug: "valid-work",
      workNameZh: "有效作品",
      image: "/images/valid.webp",
      alt: "测试航道关联实录：有效作品",
    });
  });

  it("builds the complete track previews list maintaining track order", () => {
    const previews = buildTrackPreviews(tracks, works);
    expect(previews).toHaveLength(5);
    expect(previews.map((p) => p.slug)).toEqual(["ai", "software", "database", "cloud-iot", "industrial"]);
    expect(previews[0].preview?.workSlug).toBe("intellibuddy");
    expect(previews[4].preview).toBeNull();
  });
});
