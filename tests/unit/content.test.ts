import { describe, expect, it } from "vitest";

import { awards, club, culturePhotos, faq, memberVoices, timeline, tracks, works } from "@/content";

describe("content model", () => {
  it("validates every content module at build time", () => {
    expect(club.abbreviation).toBe("YFY");
    expect([tracks, works, awards, timeline, faq, culturePhotos, memberVoices].every(Array.isArray)).toBe(true);
    expect(awards).toHaveLength(10);
    expect(culturePhotos).toHaveLength(8);
    expect(memberVoices).toHaveLength(10);
    expect(memberVoices.every((voice) => voice.author && voice.quote && voice.role && voice.tag && voice.avatar)).toBe(true);
    expect(timeline.some((item) => item.isGap && item.year === "2015–2021")).toBe(true);
    expect(works.find((work) => work.slug === "intellibuddy")?.detail?.demoAccounts).toHaveLength(5);
  });
});
