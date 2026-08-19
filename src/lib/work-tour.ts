import type { Work } from "@/content/schema";

export type WorkGalleryItem = NonNullable<NonNullable<Work["detail"]>["gallery"]>[number];

export interface TourGroup {
  id: string;
  name: string;
  index: string;
  items: Array<WorkGalleryItem & { itemIndex: number }>;
}

/**
 * Builds tour groups by order of appearance from a gallery array.
 * If galleryMode is not "tour", or if gallery is empty or items lack valid `group`,
 * returns null so the page safely falls back to standard grid rendering.
 */
export function buildTourGroups(
  gallery: WorkGalleryItem[] | undefined,
  galleryMode: "grid" | "tour" | undefined = "grid",
  workSlug?: string,
): TourGroup[] | null {
  if (galleryMode !== "tour" || !gallery || gallery.length === 0) {
    return null;
  }

  const allHaveGroup = gallery.every(
    (item) => typeof item.group === "string" && item.group.trim().length > 0,
  );
  if (!allHaveGroup) {
    return null;
  }

  const groupsMap = new Map<string, TourGroup>();
  let groupCounter = 1;
  const prefix = workSlug ? `work-tour-${workSlug}` : "tour";

  for (let i = 0; i < gallery.length; i++) {
    const item = gallery[i];
    const groupName = item.group!.trim();

    if (!groupsMap.has(groupName)) {
      const indexStr = String(groupCounter).padStart(2, "0");
      const id = `${prefix}-group-${groupCounter}`;
      groupsMap.set(groupName, {
        id,
        name: groupName,
        index: indexStr,
        items: [],
      });
      groupCounter++;
    }

    groupsMap.get(groupName)!.items.push({
      ...item,
      itemIndex: i,
    });
  }

  return Array.from(groupsMap.values());
}
