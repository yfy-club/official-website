import { describe, expect, it } from "vitest";

import { clampSliderValue, getNumberTickerInitialValue, getSliderValueFromKey } from "@/lib/motion";
import { works } from "@/content";
import { countWorkScreenshots, getWorkImageTransitionName } from "@/lib/work-media";

describe("motion contracts", () => {
  it("keeps compare slider input within its ARIA range", () => {
    expect(clampSliderValue(-12)).toBe(0);
    expect(clampSliderValue(47.6)).toBe(48);
    expect(clampSliderValue(140)).toBe(100);
  });

  it("supports arrows, Home, and End in five percent steps", () => {
    expect(getSliderValueFromKey(50, "ArrowLeft")).toBe(45);
    expect(getSliderValueFromKey(50, "ArrowRight")).toBe(55);
    expect(getSliderValueFromKey(50, "Home")).toBe(0);
    expect(getSliderValueFromKey(50, "End")).toBe(100);
    expect(getSliderValueFromKey(50, "Enter")).toBeNull();
  });

  it("only enables comparison when a real light and dark pair exists", () => {
    const matrix = works.find((work) => work.slug === "matrix-calculator");
    const smartLight = works.find((work) => work.slug === "zgyc-smart-light");
    const intellibuddy = works.find((work) => work.slug === "intellibuddy");
    expect(matrix?.detail?.shots?.type).toBe("comparison");
    expect(matrix?.detail?.gallery?.[0]?.shot.type).toBe("comparison");
    expect(smartLight?.detail?.shots?.type).toBe("single");
    expect(intellibuddy?.detail?.shots?.type).toBe("comparison");
  });

  it("renders the NumberTicker target immediately when motion is reduced", () => {
    expect(getNumberTickerInitialValue({ direction: "up", reduceMotion: true, startValue: 2000, value: 2014 })).toBe(2014);
    expect(getNumberTickerInitialValue({ direction: "down", reduceMotion: true, startValue: 0, value: 42 })).toBe(42);
    expect(getNumberTickerInitialValue({ direction: "up", reduceMotion: false, startValue: 2000, value: 2014 })).toBe(2000);
  });

  it("counts only accessible work screenshots and keeps stable transition names", () => {
    const counts = Object.fromEntries(works.map((work) => [work.slug, countWorkScreenshots(work)]));

    expect(counts["matrix-calculator"]).toBe(4);
    expect(counts["zgyc-smart-light"]).toBe(16);
    expect(counts.intellibuddy).toBe(6);
    expect(getWorkImageTransitionName("intellibuddy")).toBe("work-image-intellibuddy");
  });
});
