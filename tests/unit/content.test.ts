import { describe, expect, it } from "vitest";

import { awards, club, culturePhotos, faq, mechanisms, memberVoices, timeline, tracks, works } from "@/content";
import { workDeepDives } from "@/content/work-deep-dives";

describe("content model", () => {
  it("validates every content module at build time", () => {
    expect(club.abbreviation).toBe("YFY");
    expect([tracks, works, awards, timeline, faq, culturePhotos, memberVoices, mechanisms].every(Array.isArray)).toBe(true);
    expect(awards).toHaveLength(10);
    expect(culturePhotos).toHaveLength(8);
    expect(memberVoices).toHaveLength(10);
    expect(mechanisms).toHaveLength(7);
    expect(mechanisms.every((m) => m.index && m.title && m.detail && m.tag)).toBe(true);
    expect(memberVoices.every((voice) => voice.author && voice.quote && voice.role && voice.tag && voice.avatar)).toBe(true);
    expect(timeline.some((item) => item.isGap && item.year === "2015–2021")).toBe(true);
    expect(works.find((work) => work.slug === "intellibuddy")?.detail?.demoAccounts).toHaveLength(5);
  });

  it("keeps every featured work deep dive evidence-led", () => {
    expect(Object.keys(workDeepDives).sort()).toEqual([
      "intellibuddy",
      "matrix-calculator",
      "zgyc-smart-light",
    ]);

    for (const deepDive of Object.values(workDeepDives)) {
      expect(deepDive.principles.length).toBeGreaterThanOrEqual(3);
      expect(deepDive.decisions.length).toBeGreaterThanOrEqual(3);
      expect(deepDive.metrics.length).toBeGreaterThanOrEqual(2);
      expect(deepDive.tradeoffs.length).toBeGreaterThanOrEqual(2);
      expect(
        deepDive.decisions.every((item) =>
          Boolean(item.problem && item.solution && item.impact && item.tradeoff),
        ),
      ).toBe(true);
      expect(deepDive.metrics.every((item) => item.progress === undefined)).toBe(true);
      expect(deepDive.tradeoffs.every((item) => item.boundary && item.next)).toBe(true);
    }

    for (const [slug, deepDive] of Object.entries(workDeepDives)) {
      const work = works.find((item) => item.slug === slug);
      expect(work?.detail?.principles?.[0]?.code).toBe(deepDive.principles[0]?.code);
      expect(work?.detail?.metrics?.[0]?.value).toBe(deepDive.metrics[0]?.value);
    }
  });
});
