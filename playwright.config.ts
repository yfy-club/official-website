import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";
const browserChannel = process.env.PLAYWRIGHT_CHANNEL;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 120_000,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["line"], ["html", { open: "never" }]] : "line",
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    ...(browserChannel ? { channel: browserChannel } : {}),
    colorScheme: "dark",
    locale: "zh-CN",
    trace: "retain-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run start:quality -- -p 3100",
        env: { NEXT_DIST_DIR: process.env.NEXT_DIST_DIR ?? ".next-quality" },
        reuseExistingServer: false,
        timeout: 120_000,
        url: baseURL,
      },
});
