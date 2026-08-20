import { describe, expect, it } from "vitest";

import { trackDeepDives, tracks } from "@/content";
import { trackDeepDiveSchema } from "@/content/schema";

describe("track deep dives content & schema", () => {
  it("provides complete, verified deep dives for all 5 active tracks", () => {
    const requiredSlugs = ["ai", "software", "database", "cloud-iot", "industrial"];
    expect(Object.keys(trackDeepDives).sort()).toEqual(requiredSlugs.sort());

    for (const slug of requiredSlugs) {
      const deepDive = trackDeepDives[slug];
      expect(deepDive).toBeDefined();
      expect(deepDive.slug).toBe(slug);
      expect(deepDive.concepts.length).toBe(3);

      // Validate against Zod schema
      const parsed = trackDeepDiveSchema.parse(deepDive);
      expect(parsed.concepts.length).toBe(3);

      // Validate each concept properties
      for (const concept of deepDive.concepts) {
        expect(concept.code).toMatch(/^[A-Z]{2,4}_[A-Z0-9]+_\d{2}$/);
        expect(concept.title.length).toBeGreaterThanOrEqual(5);
        expect(concept.question).toContain("？");
        expect(concept.summary.length).toBeGreaterThanOrEqual(15);
        expect(concept.mechanism.length).toBeGreaterThanOrEqual(30);
        expect(concept.tags.length).toBeGreaterThanOrEqual(2);

        if (concept.codeSnippet) {
          expect(concept.codeSnippet.code.length).toBeGreaterThan(10);
          expect(concept.codeSnippet.language).toBeDefined();
        }

        if (concept.misconception) {
          expect(concept.misconception.myth.length).toBeGreaterThan(10);
          expect(concept.misconception.truth.length).toBeGreaterThan(10);
        }

        if (concept.ourWork) {
          expect(concept.ourWork.title.length).toBeGreaterThan(2);
          expect(concept.ourWork.evidence.length).toBeGreaterThan(10);
        }
      }
    }
  });

  it("ensures each track in content/tracks corresponds to a deep dive dossier", () => {
    for (const track of tracks) {
      const deepDive = trackDeepDives[track.slug];
      expect(deepDive).toBeDefined();
      expect(deepDive.trackName).toBe(track.nameZh);
    }
  });

  it("validates that all mathematical formulas compile cleanly with KaTeX", async () => {
    const katex = (await import("katex")).default;

    for (const deepDive of Object.values(trackDeepDives)) {
      for (const concept of deepDive.concepts) {
        if (concept.formula) {
          const rendered = katex.renderToString(concept.formula, {
            throwOnError: true,
            displayMode: false,
          });
          expect(rendered).toContain("katex");
          expect(rendered.length).toBeGreaterThan(10);
        }
      }
    }
  });
});
