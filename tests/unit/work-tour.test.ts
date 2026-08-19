import { describe, expect, it } from "vitest";

import { works } from "@/content";
import { countWorkScreenshots } from "@/lib/work-media";
import { buildTourGroups, type WorkGalleryItem } from "@/lib/work-tour";

describe("buildTourGroups & work tour data contracts", () => {
  const zgyc = works.find((w) => w.slug === "zgyc-smart-light");
  const matrix = works.find((w) => w.slug === "matrix-calculator");
  const intellibuddy = works.find((w) => w.slug === "intellibuddy");

  it("builds exactly 5 groups for zgyc-smart-light with correct order, item counts, and slug-scoped IDs", () => {
    expect(zgyc).toBeDefined();
    expect(zgyc?.detail?.galleryMode).toBe("tour");
    expect(zgyc?.detail?.gallery).toBeDefined();

    const groups = buildTourGroups(zgyc!.detail!.gallery, zgyc!.detail!.galleryMode, zgyc!.slug);
    expect(groups).not.toBeNull();
    expect(groups).toHaveLength(5);

    expect(groups![0]).toMatchObject({
      id: "work-tour-zgyc-smart-light-group-1",
      name: "运行总览",
      index: "01",
    });
    expect(groups![0].items).toHaveLength(1);
    expect(groups![0].items[0].label).toBe("地图监控");

    expect(groups![1]).toMatchObject({
      id: "work-tour-zgyc-smart-light-group-2",
      name: "告警与工单",
      index: "02",
    });
    expect(groups![1].items).toHaveLength(3);
    expect(groups![1].items.map((i) => i.label)).toEqual(["告警中心", "告警规则", "工单流转"]);

    expect(groups![2]).toMatchObject({
      id: "work-tour-zgyc-smart-light-group-3",
      name: "资产档案",
      index: "03",
    });
    expect(groups![2].items).toHaveLength(3);
    expect(groups![2].items.map((i) => i.label)).toEqual(["智慧灯杆资产", "区域资产", "逻辑设备"]);

    expect(groups![3]).toMatchObject({
      id: "work-tour-zgyc-smart-light-group-4",
      name: "监测与控制",
      index: "04",
    });
    expect(groups![3].items).toHaveLength(3);
    expect(groups![3].items.map((i) => i.label)).toEqual(["实时遥测", "远程控制记录", "照明策略"]);

    expect(groups![4]).toMatchObject({
      id: "work-tour-zgyc-smart-light-group-5",
      name: "权限与审计",
      index: "05",
    });
    expect(groups![4].items).toHaveLength(5);
    expect(groups![4].items.map((i) => i.label)).toEqual([
      "用户管理",
      "角色权限",
      "操作日志",
      "登录日志",
      "身份认证",
    ]);
  });

  it("supports default prefix when workSlug is omitted", () => {
    const defaultGroups = buildTourGroups(zgyc!.detail!.gallery, zgyc!.detail!.galleryMode);
    expect(defaultGroups).not.toBeNull();
    expect(defaultGroups![0].id).toBe("tour-group-1");
  });

  it("ensures two distinct work instances produce completely isolated, disjoint group IDs", () => {
    const instanceA = buildTourGroups(zgyc!.detail!.gallery, "tour", "project-alpha");
    const instanceB = buildTourGroups(zgyc!.detail!.gallery, "tour", "project-beta");

    expect(instanceA).not.toBeNull();
    expect(instanceB).not.toBeNull();

    const idsA = instanceA!.map((g) => g.id);
    const idsB = instanceB!.map((g) => g.id);

    expect(idsA[0]).toBe("work-tour-project-alpha-group-1");
    expect(idsB[0]).toBe("work-tour-project-beta-group-1");

    const overlap = idsA.filter((id) => idsB.includes(id));
    expect(overlap).toHaveLength(0);
  });

  it("partitions all 15 gallery items uniquely and preserves global itemIndex", () => {
    const groups = buildTourGroups(zgyc!.detail!.gallery, zgyc!.detail!.galleryMode)!;
    const allItems = groups.flatMap((g) => g.items);

    expect(allItems).toHaveLength(15);
    const itemIndices = allItems.map((i) => i.itemIndex);
    expect(itemIndices).toEqual(Array.from({ length: 15 }, (_, i) => i));

    const labels = allItems.map((i) => i.label);
    const uniqueLabels = new Set(labels);
    expect(uniqueLabels.size).toBe(15);
  });

  it("safely falls back to null (grid) when galleryMode is grid or missing, or items lack group", () => {
    // Mode is grid
    const gridResult = buildTourGroups(zgyc!.detail!.gallery, "grid");
    expect(gridResult).toBeNull();

    // Mode is undefined
    const defaultResult = buildTourGroups(zgyc!.detail!.gallery);
    expect(defaultResult).toBeNull();

    // Gallery is empty
    const emptyResult = buildTourGroups([], "tour");
    expect(emptyResult).toBeNull();

    // Some items missing group
    const mockGalleryWithMissingGroup: WorkGalleryItem[] = [
      {
        label: "地图监控",
        description: "监控描述",
        group: "运行总览",
        shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-feature-map.webp", alt: "地图" },
      },
      {
        label: "告警中心",
        description: "告警描述",
        // missing group
        shot: { type: "single", image: "/images/works/zgyc-smart-light/zgyc-alarm-center.webp", alt: "告警" },
      },
    ];
    const invalidResult = buildTourGroups(mockGalleryWithMissingGroup, "tour");
    expect(invalidResult).toBeNull();
  });

  it("ensures countWorkScreenshots still returns 16 for zgyc-smart-light", () => {
    expect(countWorkScreenshots(zgyc!)).toBe(16);
  });

  it("preserves grid mode fallback for matrix-calculator and intellibuddy", () => {
    expect(matrix).toBeDefined();
    expect(matrix?.detail?.galleryMode ?? "grid").toBe("grid");
    expect(buildTourGroups(matrix?.detail?.gallery, matrix?.detail?.galleryMode)).toBeNull();

    expect(intellibuddy).toBeDefined();
    expect(intellibuddy?.detail?.galleryMode ?? "grid").toBe("grid");
    expect(buildTourGroups(intellibuddy?.detail?.gallery, intellibuddy?.detail?.galleryMode)).toBeNull();
  });
});
