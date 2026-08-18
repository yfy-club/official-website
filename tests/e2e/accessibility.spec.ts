import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { publicRoutes } from "./routes";

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((selectedTheme) => {
        window.localStorage.setItem("theme", selectedTheme);
      }, theme);
    });

    for (const route of publicRoutes) {
      test(`${route} has no serious or critical axe violations`, async ({ page }) => {
        await page.goto(route, { waitUntil: "networkidle" });
        if (route === "/join") {
          await page.locator("#join-name").waitFor();
        }

        const results = await new AxeBuilder({ page }).analyze();
        const blocking = results.violations.filter(
          (violation) => violation.impact === "serious" || violation.impact === "critical",
        );

        const summary = blocking.flatMap((violation) =>
          violation.nodes.map((node) => `${violation.id}: ${node.target.join(" ")} (${node.failureSummary ?? "no details"})`),
        );
        expect(summary).toEqual([]);
      });
    }
  });
}
