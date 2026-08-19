import { expect, test } from "@playwright/test";

import { publicRoutes } from "./routes";

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page, context = page.url()) {
  const layout = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    offenders: [...document.querySelectorAll<HTMLElement>("body *")]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { element: `${element.tagName.toLowerCase()}#${element.id}.${element.className}`, left: rect.left, right: rect.right };
      })
      .filter((item) => item.right > document.documentElement.clientWidth + 1 && item.left < document.documentElement.clientWidth)
      .slice(0, 8),
  }));
  expect(layout.scrollWidth, `${context}: ${JSON.stringify(layout.offenders)}`).toBeLessThanOrEqual(layout.clientWidth + 1);
}

async function tabTo(
  page: import("@playwright/test").Page,
  target: import("@playwright/test").Locator,
  limit = 200,
) {
  await expect(target).toBeVisible();
  for (let index = 0; index < limit; index += 1) {
    await page.keyboard.press("Tab");
    if (await target.evaluate((element) => element === document.activeElement)) return;
  }
  throw new Error(`Keyboard focus did not reach ${target.toString()} after ${limit} Tab presses.`);
}

test("skip link is first and moves focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "跳到主内容" });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("desktop navigation exposes home and marks the current route", async ({ page }) => {
  await page.goto("/works/matrix-calculator");
  const navigation = page.locator(".site-header__nav");
  await expect(navigation.getByRole("link", { name: "返回首页" })).toHaveAttribute("href", "/");
  await expect(navigation.locator('a[href="/works"]')).toHaveAttribute("aria-current", "page");
  await expect(navigation.locator('a[href="/about"]')).not.toHaveAttribute("aria-current", "page");
});

test("home hero preserves the original code shimmer and pointer-scroll motion", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem("theme", "dark"));
  await page.goto("/");
  const code = page.locator(".home-hero__code");
  const develop = page.locator(".develop");
  await expect(code).toHaveCSS("animation-name", /hero-code-shimmer/);
  await expect(develop).toHaveAttribute("data-state", "active");
  await expect.poll(() => page.locator("html").evaluate((element) =>
    getComputedStyle(element).getPropertyValue("--hero-code-accent").trim().toLowerCase(),
  )).toBe("#4da3ff");

  await page.mouse.move(1, 1);
  await page.mouse.move(1200, 500);
  await expect.poll(() => develop.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).getPropertyValue("--hero-mouse-x")),
  )).toBeGreaterThan(0.5);

  await page.evaluate(() => window.scrollTo(0, window.innerHeight / 2));
  await expect.poll(() => develop.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).getPropertyValue("--hero-scroll-progress")),
  )).toBeGreaterThan(0.4);
});

test("home headline keeps the original spacious desktop and stacked mobile composition", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const desktop = await page.locator(".home-hero__title").evaluate((title) => {
    const codeLine = title.querySelector<HTMLElement>(".home-hero__title-line--code")!;
    const futureLine = title.querySelector<HTMLElement>(".home-hero__title-line--future")!;
    return {
      codeSize: Number.parseFloat(getComputedStyle(codeLine).fontSize),
      futureSize: Number.parseFloat(getComputedStyle(futureLine).fontSize),
      codeDirection: getComputedStyle(codeLine).flexDirection,
      codeGap: Number.parseFloat(getComputedStyle(codeLine).columnGap),
    };
  });
  expect(desktop.codeSize).toBeGreaterThanOrEqual(140);
  expect(desktop.futureSize).toBeGreaterThanOrEqual(110);
  expect(desktop.codeDirection).toBe("row");
  expect(desktop.codeGap).toBeGreaterThan(35);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const mobile = await page.locator(".home-hero__title").evaluate((title) => ({
    codeDirection: getComputedStyle(title.querySelector(".home-hero__title-line--code")!).flexDirection,
    futureDirection: getComputedStyle(title.querySelector(".home-hero__title-line--future")!).flexDirection,
  }));
  expect(mobile.codeDirection).toBe("column");
  expect(mobile.futureDirection).toBe("column");
});

test("page and hero shells expand at wide and 2K breakpoints", async ({ page }) => {
  const cases = [
    { viewport: 1440, pageWidth: 1200, heroWidth: 940 },
    { viewport: 1680, pageWidth: 1360, heroWidth: 1200 },
    { viewport: 2200, pageWidth: 1600, heroWidth: 1600 },
  ] as const;

  for (const entry of cases) {
    await page.setViewportSize({ width: entry.viewport, height: 1000 });
    await page.goto("/");
    const widths = await page.evaluate(() => ({
      page: document.querySelector<HTMLElement>("#home-stats")?.getBoundingClientRect().width,
      hero: document.querySelector<HTMLElement>(".home-hero")?.getBoundingClientRect().width,
    }));
    expect(widths.page).toBeCloseTo(entry.pageWidth, 0);
    expect(widths.hero).toBeCloseTo(entry.heroWidth, 0);
  }
});

test("keyboard path reaches a track detail and the join form", async ({ page }) => {
  await page.goto("/");
  const tracksLink = page.locator('.site-header__nav a[href="/tracks"]');
  await tabTo(page, tracksLink);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/tracks$/);

  const firstTrack = page.locator(".track-panel").first();
  await tabTo(page, firstTrack);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/tracks\/ai$/);

  const joinLink = page.locator('.site-header__nav a[href="/join"]');
  await tabTo(page, joinLink);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/join$/);
  await page.locator("#join-name").waitFor();

  const expectedOrder = [
    "join-name",
    "join-student-id",
    "join-major",
    "join-grade",
    "join-contact",
    "join-track",
    "join-reason",
  ];
  await tabTo(page, page.locator("#join-name"));
  for (const id of expectedOrder) {
    await expect(page.locator(`#${id}`)).toBeFocused();
    await page.keyboard.press("Tab");
  }
  await expect(page.locator("#join-submit")).toBeFocused();
});

test("all pages reflow at a 320px CSS viewport, equivalent to 400% zoom", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const route of publicRoutes) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expectNoHorizontalOverflow(page, route);
  }
});

test("system large text does not clip the primary mobile path", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/tracks/ai", "/join"] as const) {
    await page.goto(route, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: ":root { font-size: 200% !important; }" });
    await expectNoHorizontalOverflow(page, route);
    const clippedControls = await page.locator("a, button, input, select, textarea").evaluateAll((elements) =>
      elements
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1);
        })
        .map((element) => element.getAttribute("aria-label") || element.textContent?.trim() || element.id),
    );
    expect(clippedControls).toEqual([]);
  }
});

test("forced colors preserves visible controls and focus", async ({ browser }) => {
  const context = await browser.newContext({ forcedColors: "active", viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const route of publicRoutes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.locator("main#main-content").waitFor();
    await expectNoHorizontalOverflow(page, route);
  }
  const trigger = page.getByRole("button", { name: "打开主导航" });
  await trigger.focus();
  const focus = await trigger.evaluate((element) => {
    const style = getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  expect(focus.outlineStyle).not.toBe("none");
  expect(Number.parseFloat(focus.outlineWidth)).toBeGreaterThanOrEqual(2);
  await context.close();
});

test("reduced motion exposes complete static states", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const route of publicRoutes) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expectNoHorizontalOverflow(page, route);
    const infiniteAnimations = await page.evaluate(() =>
      document.getAnimations().filter((animation) => animation.effect?.getTiming().iterations === Infinity).length,
    );
    expect(infiniteAnimations).toBe(0);
  }
  await context.close();
});

test("semantic, canonical, image, sitemap, and robots contracts", async ({ page, request }) => {
  for (const route of publicRoutes) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main#main-content")).toHaveCount(1);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBeTruthy();
    expect(new URL(canonical ?? "").pathname).toBe(route);
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(ogImage).toBeTruthy();
    const expectedOgPath = route === "/" ? "/og/home" : `/og${route}`;
    expect(new URL(ogImage ?? "").pathname).toBe(expectedOgPath);
    const ogResponse = await request.get(expectedOgPath);
    expect(ogResponse.ok(), `${route}: dynamic OG request failed`).toBe(true);
    expect(ogResponse.headers()["content-type"]).toContain("image/png");
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.length).toBeGreaterThanOrEqual(route === "/" ? 1 : 2);

    const responsiveImages = await page.locator("main img").evaluateAll((images) =>
      images
        .filter((image): image is HTMLImageElement => image instanceof HTMLImageElement && !image.getAttribute("src")?.includes(".svg"))
        .map((image) => ({ alt: image.alt, src: image.currentSrc, srcset: image.getAttribute("srcset") })),
    );
    for (const image of responsiveImages) {
      expect(image.alt).toBeDefined();
      expect(image.srcset, `${route}: ${image.src}`).toBeTruthy();
    }
  }

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect((sitemap.match(/<loc>/g) ?? []).length).toBe(publicRoutes.length);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  expect(robots).toContain("Sitemap:");
});
