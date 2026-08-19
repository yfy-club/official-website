import { describe, expect, it } from "vitest";

import { clampSliderValue, getSliderValueFromKey } from "@/lib/motion";
import { works } from "@/content";

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
});
