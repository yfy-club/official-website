import type { Track, Work } from "@/content/schema";

export interface TrackPreviewTarget {
  workSlug: string;
  workNameZh: string;
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
 * Returns the first work associated with a track that has both a detail and an image.
 */
export function getTrackPreview(
  track: Pick<Track, "nameZh" | "relatedWorkSlugs">,
  worksList: readonly Work[],
): TrackPreviewTarget | null {
  for (const slug of track.relatedWorkSlugs) {
    const work = worksList.find((w) => w.slug === slug);
    if (work && work.detail && work.image) {
      return {
        workSlug: work.slug,
        workNameZh: work.nameZh,
        image: work.image,
        alt: `${track.nameZh}航道关联实录：${work.nameZh}`,
      };
    }
  }
  return null;
}

/**
 * Builds preview items for a list of tracks against available works.
 */
export function buildTrackPreviews(
  tracksList: readonly Track[],
  worksList: readonly Work[],
): TrackWithPreview[] {
  return tracksList.map((track) => ({
    slug: track.slug,
    index: track.index,
    nameZh: track.nameZh,
    nameEn: track.nameEn,
    tagline: track.tagline,
    preview: getTrackPreview(track, worksList),
  }));
}
