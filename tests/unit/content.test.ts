import { describe, expect, it } from "vitest";

import { awards, club, culturePhotos, faq, timeline, tracks, works } from "@/content";

describe("content model", () => {
  it("validates every content module at build time", () => {
    expect(club.abbreviation).toBe("YFY");
    expect([tracks, works, awards, timeline, faq, culturePhotos].every(Array.isArray)).toBe(true);
    expect(awards).toHaveLength(10);
    expect(culturePhotos).toHaveLength(8);
    expect(works.find((work) => work.slug === "intellibuddy")?.detail?.demoAccounts).toHaveLength(5);
  });
});
