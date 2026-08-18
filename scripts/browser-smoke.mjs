import { chromium } from "@playwright/test";

const baseURL = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";
const routes = [
  "/",
  "/about",
  "/tracks",
  "/tracks/ai",
  "/tracks/software",
  "/tracks/database",
  "/tracks/cloud-iot",
  "/tracks/industrial",
  "/works",
  "/works/matrix-calculator",
  "/works/zgyc-smart-light",
  "/awards",
  "/join",
];

const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = [];

for (const viewport of [{ width: 320, height: 900 }, { width: 1440, height: 1000 }]) {
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({ viewport });
    await context.addInitScript((value) => localStorage.setItem("theme", value), theme);
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    for (const route of routes) {
      const response = await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
      const layout = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        theme: document.documentElement.dataset.theme,
      }));
      results.push({ route, viewport: viewport.width, theme, status: response?.status(), ...layout });
      if (response?.status() !== 200) throw new Error(`${route} returned ${response?.status()}`);
      if (layout.scrollWidth > layout.clientWidth) throw new Error(`${route} overflows at ${viewport.width}px: ${layout.scrollWidth} > ${layout.clientWidth}`);
      if (layout.theme !== theme) throw new Error(`${route} expected ${theme} theme, got ${layout.theme}`);
    }

    if (consoleErrors.length > 0) throw new Error(`Console errors at ${viewport.width}px/${theme}:\n${consoleErrors.join("\n")}`);
    await context.close();
  }
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
