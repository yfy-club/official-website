import type { Track } from "@/content/schema";

export interface TrackPreviewTarget {
  title: string;
  image: string;
  alt: string;
}

export interface TrackWithPreview {
  slug: string;
  index: string;
  nameZh: string;
  nameEn: string;
  tagline: string;
  preview: TrackPreviewTarget | null;
}

/**
 * 5 大技术方向在行业/领域的典型示例图定义
 */
export const TRACK_EXAMPLE_PREVIEWS: Record<string, TrackPreviewTarget> = {
  ai: {
    title: "神经网络与大模型算法架构",
    image: "/images/tracks/track-ai.webp",
    alt: "人工智能方向：神经网络与大模型算法架构示例",
  },
  software: {
    title: "现代全栈软件工程与协同开发",
    image: "/images/tracks/track-software.webp",
    alt: "软工智能方向：现代全栈软件工程与协同开发示例",
  },
  database: {
    title: "分布式数据库与数据治理大屏",
    image: "/images/tracks/track-database.webp",
    alt: "数据库方向：分布式数据库与数据治理大屏示例",
  },
  "cloud-iot": {
    title: "端边云协同与嵌入式物联网架构",
    image: "/images/tracks/track-cloud-iot.webp",
    alt: "智能云物联方向：端边云协同与嵌入式物联网架构示例",
  },
  industrial: {
    title: "工业 4.0 数字孪生与智能制造",
    image: "/images/tracks/track-industrial.webp",
    alt: "工业数智化方向：工业 4.0 数字孪生与智能制造示例",
  },
};

/**
 * Returns the typical domain preview for a track.
 */
export function getTrackPreview(track: Pick<Track, "slug">): TrackPreviewTarget | null {
  return TRACK_EXAMPLE_PREVIEWS[track.slug] ?? null;
}

/**
 * Builds preview items for a list of tracks with standard domain example images.
 */
export function buildTrackPreviews(
  tracksList: readonly Track[],
): TrackWithPreview[] {
  return tracksList.map((track) => ({
    slug: track.slug,
    index: track.index,
    nameZh: track.nameZh,
    nameEn: track.nameEn,
    tagline: track.tagline,
    preview: getTrackPreview(track),
  }));
}
