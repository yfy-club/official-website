import type { Work } from "@/content/schema";

type WorkShot = NonNullable<NonNullable<Work["detail"]>["shots"]>;

function countShot(shot: WorkShot | undefined) {
  if (!shot) return 0;
  return shot.type === "comparison" ? 2 : 1;
}

export function countWorkScreenshots(work: Work) {
  if (!work.detail) return 0;

  return countShot(work.detail.shots)
    + (work.detail.gallery?.reduce((total, item) => total + countShot(item.shot), 0) ?? 0);
}

export function getWorkImageTransitionName(slug: string) {
  return `work-image-${slug}`;
}
