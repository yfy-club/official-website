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

test("desktop navigation active pill stays horizontally bound without vertical drift when navigating from scrolled page", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  // Scroll down significantly
  await page.evaluate(() => window.scrollTo(0, 800));
  const siteHeader = page.locator(".site-header");
  await expect(siteHeader).toHaveAttribute("data-scrolled", "true");

  const headerBox = await siteHeader.boundingBox();
  expect(headerBox).not.toBeNull();

  // Click /about nav link
  const aboutLink = page.locator('.site-header__nav a[href="/about"]');
  await aboutLink.click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(aboutLink).toHaveAttribute("aria-current", "page");

  // Verify active indicator remains vertically within header bounds
  const pill = siteHeader.locator('a[href="/about"] span[class*="absolute"]');
  await expect(pill).toBeVisible();
  const pillBox = await pill.boundingBox();
  expect(pillBox).not.toBeNull();
  expect(pillBox!.y).toBeGreaterThanOrEqual(headerBox!.y);
  expect(pillBox!.y + pillBox!.height).toBeLessThanOrEqual(headerBox!.y + headerBox!.height + 20);
});

test("work cards expose real screenshot counts and unique shared media names", async ({ page }) => {
  const cases = [
    { slug: "matrix-calculator", count: 4 },
    { slug: "zgyc-smart-light", count: 16 },
    { slug: "intellibuddy", count: 6 },
  ] as const;

  for (const item of cases) {
    await page.goto("/works");
    const card = page.locator(`[data-work-slug="${item.slug}"]`);
    const source = card.locator(".work-row__media");
    await expect(card.getByText(`${item.count} Screens / 系统实录`)).toBeVisible();
    await expect(source).toHaveCSS("view-transition-name", `work-image-${item.slug}`);

    await card.getByRole("link", { name: /工程/ }).click();
    await expect(page).toHaveURL(`/works/${item.slug}`);
    const target = page.locator(".work-detail__hero-media");
    await expect(target).toHaveCSS("view-transition-name", `work-image-${item.slug}`);
    await expect(page.locator('[style*="view-transition-name: work-image-"]')).toHaveCount(1);
  }
});

test("incubating works use the existing token-colored BorderBeam", async ({ page }) => {
  await page.goto("/works");
  const beams = page.locator(".incubating-grid .border-beam");
  await expect(beams).toHaveCount(3);
  const tokens = await page.locator("html").evaluate((element) => ({
    accent: getComputedStyle(element).getPropertyValue("--accent").trim(),
    warn: getComputedStyle(element).getPropertyValue("--warn").trim(),
  }));
  for (const beam of await beams.all()) {
    const colors = await beam.locator(".absolute.aspect-square").evaluate((element) => ({
      from: getComputedStyle(element).getPropertyValue("--color-from").trim(),
      to: getComputedStyle(element).getPropertyValue("--color-to").trim(),
    }));
    expect(colors).toEqual({ from: tokens.warn, to: tokens.accent });
  }
});

test("join FAQ uses one collapsible Radix accordion with keyboard navigation", async ({ page }) => {
  await page.goto("/join");
  const triggers = page.locator("#join-faq .mechanism-accordion__trigger");
  const panels = page.locator("#join-faq .mechanism-accordion__content");
  const first = triggers.nth(0);
  const second = triggers.nth(1);

  await first.focus();
  await page.keyboard.press("Enter");
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await expect(panels.nth(0)).toBeVisible();

  await page.keyboard.press("ArrowDown");
  await expect(second).toBeFocused();
  await page.keyboard.press("Space");
  await expect(first).toHaveAttribute("aria-expanded", "false");
  await expect(second).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Space");
  await expect(second).toHaveAttribute("aria-expanded", "false");
  await expect(second).toBeFocused();
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
    const tickerValues = await page.locator("[data-number-ticker-value]").evaluateAll((elements) =>
      elements.map((element) => ({
        expected: element.getAttribute("data-number-ticker-value"),
        rendered: (element as HTMLElement).innerText,
      })),
    );
    expect(tickerValues.every((ticker) => ticker.rendered === ticker.expected)).toBe(true);
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

test("tracks console is strictly isolated from reveal annotations", async ({ page }) => {
  await page.goto("/tracks", { waitUntil: "networkidle" });
  const tracksRoutes = page.locator("#tracks-routes");
  await expect(tracksRoutes).toBeVisible();
  await expect(tracksRoutes).not.toHaveAttribute("data-reveal");
  await expect(page.locator("#tracks-routes [data-reveal]")).toHaveCount(0);
});

test("scroll-driven reveal animates offscreen narrative targets into viewport", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const supportsViewTimeline = await page.evaluate(() => CSS.supports("animation-timeline", "view()"));
  if (!supportsViewTimeline) return;

  const target = page.locator("#home-join p").first();
  await expect(target).toBeAttached();

  const initial = await target.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      opacity: Number.parseFloat(style.opacity),
      translate: style.translate,
    };
  });
  expect(initial.opacity).toBeLessThanOrEqual(0.1);

  await target.scrollIntoViewIfNeeded();

  await expect.poll(async () => {
    return target.evaluate((element) => {
      const style = getComputedStyle(element);
      const opacity = Number.parseFloat(style.opacity);
      const tr = style.translate;
      const settled = tr === "none" || tr === "0px" || tr === "0px 0px" || tr === "0px 0px 0px" || tr === "0% 0%";
      return {
        visible: opacity >= 0.99,
        settled,
      };
    });
  }).toEqual({
    visible: true,
    settled: true,
  });
});

test("reduced motion disables all reveal animations with immediate full display", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const route of ["/", "/works", "/about", "/join", "/tracks/ai"] as const) {
    await page.goto(route, { waitUntil: "networkidle" });
    const count = await page.locator("[data-reveal]").count();
    expect(count).toBeGreaterThan(0);

    const invalid = await page.evaluate(() => {
      const elements = [...document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal] > *, [data-reveal='section'] > .section__head > *")];
      return elements
        .filter((el) => {
          const style = getComputedStyle(el);
          const tr = style.translate;
          const isZeroTranslate = tr === "none" || tr === "0px" || tr === "0px 0px" || tr === "0px 0px 0px";
          return style.opacity !== "1" || !isZeroTranslate;
        })
        .map((el) => `${el.tagName.toLowerCase()}.${el.className}`);
    });
    expect(invalid, `${route} had elements not fully visible in reduced motion`).toEqual([]);
  }
  await context.close();
});

test("homepage desktop track preview responds to focus and hover with real works and honest empty state", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/", { waitUntil: "networkidle" });

  const tracksSection = page.locator("#home-tracks");
  await tracksSection.scrollIntoViewIfNeeded();

  const stage = page.locator(".home-track-preview__stage");
  await expect(stage).toBeVisible();

  // Focus AI track link
  const aiLink = page.locator('.home-tracks a[href="/tracks/ai"]');
  await aiLink.focus();
  await expect(aiLink).toHaveAttribute("data-active", "true");
  const activeMarkerOpacity = await aiLink.evaluate((element) => getComputedStyle(element, "::before").opacity);
  expect(activeMarkerOpacity).toBe("1");
  await expect(stage.locator(".home-track-preview__caption-work")).toHaveText("智学伴 · AI 智能学习平台");
  const aiImg = stage.locator(".home-track-preview__img");
  await expect(aiImg).toBeVisible();
  await expect(aiImg).toHaveAttribute("src", /zhixueban/);
  await expect(aiImg).toHaveCSS("object-fit", "contain");

  // Hover Software track link
  const softwareLink = page.locator('.home-tracks a[href="/tracks/software"]');
  await softwareLink.hover();
  await expect(softwareLink).toHaveAttribute("data-active", "true");
  await expect(aiLink).not.toHaveAttribute("data-active", "true");
  await expect(stage.locator(".home-track-preview__caption-work")).toHaveText("矩阵计算器 · 精确有理数");
  const swImg = stage.locator(".home-track-preview__img");
  await expect(swImg).toBeVisible();
  await expect(swImg).toHaveAttribute("src", /matrix/);

  // Focus Industrial track link
  const industrialLink = page.locator('.home-tracks a[href="/tracks/industrial"]');
  await industrialLink.focus();
  await expect(stage.locator(".home-track-preview__caption-work")).toHaveText("暂无关联实录");
  await expect(stage.locator(".home-track-preview__empty")).toBeVisible();
  await expect(stage.locator(".home-track-preview__img")).toHaveCount(0);

  // Click AI link to ensure navigation contract
  await aiLink.click();
  await expect(page).toHaveURL(/\/tracks\/ai$/);
});

test("homepage mobile track preview displays inline thumbnails with empty slot reservation and no overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  const tracksSection = page.locator("#home-tracks");
  await tracksSection.scrollIntoViewIfNeeded();

  // Desktop stage must be hidden on mobile
  const stage = page.locator(".home-track-preview__stage");
  await expect(stage).toBeHidden();

  // AI row has thumbnail
  const aiThumb = page.locator('.home-tracks a[href="/tracks/ai"] .home-track-preview__thumb-img');
  await expect(aiThumb).toBeVisible();
  await expect(aiThumb).toHaveAttribute("src", /zhixueban/);

  // Software row has thumbnail
  const swThumb = page.locator('.home-tracks a[href="/tracks/software"] .home-track-preview__thumb-img');
  await expect(swThumb).toBeVisible();
  await expect(swThumb).toHaveAttribute("src", /matrix/);

  // Industrial row has empty placeholder slot
  const indEmpty = page.locator('.home-tracks a[href="/tracks/industrial"] .home-track-preview__thumb-empty');
  await expect(indEmpty).toBeVisible();
  const indImg = page.locator('.home-tracks a[href="/tracks/industrial"] .home-track-preview__thumb-img');
  await expect(indImg).toHaveCount(0);

  // No horizontal overflow
  await expectNoHorizontalOverflow(page, "/");
});

test("work system tour for zgyc-smart-light exposes 5 groups, 15 items, sticky navigation staying in viewport under header, and syncs active state", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/works/zgyc-smart-light", { waitUntil: "networkidle" });

  const tour = page.locator("#work-tour-zgyc-smart-light");
  await expect(tour).toBeVisible();

  const tourNav = page.locator(".work-tour__nav");
  await expect(tourNav).toBeVisible();
  await expect(tourNav).toHaveAttribute("aria-label", "智光耀城 · 智慧路灯管理平台系统巡览");

  // Verify sticky positioning computed style on the actual sticky element .work-tour__nav
  const navPosition = await tourNav.evaluate((el) => getComputedStyle(el).position);
  expect(navPosition).toBe("sticky");

  const navLinks = page.locator(".work-tour__nav-link");
  await expect(navLinks).toHaveCount(5);

  // Initial SSR state: first group active with slug-scoped ID
  await expect(navLinks.nth(0)).toHaveAttribute("aria-current", "location");
  await expect(navLinks.nth(0)).toHaveAttribute("data-active", "true");
  await expect(navLinks.nth(0)).toHaveAttribute("data-group-id", "work-tour-zgyc-smart-light-group-1");

  // Check 5 groups and 15 figures
  const groups = page.locator(".work-tour__group");
  await expect(groups).toHaveCount(5);
  const items = page.locator(".work-tour__item");
  await expect(items).toHaveCount(15);

  // All screenshots have object-fit: contain
  const tourImgs = page.locator(".work-tour__img");
  await expect(tourImgs).toHaveCount(15);
  const firstImg = tourImgs.first();
  await expect(firstImg).toHaveCSS("object-fit", "contain");

  // Keyboard focus navigation across all 5 links
  await navLinks.nth(0).focus();
  await expect(navLinks.nth(0)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(navLinks.nth(1)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(navLinks.nth(2)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(navLinks.nth(3)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(navLinks.nth(4)).toBeFocused();

  // Fixed header bottom bound for sticky position reference
  const siteHeader = page.locator(".site-header");
  const headerBox = await siteHeader.boundingBox();
  expect(headerBox).not.toBeNull();
  const headerBottom = headerBox!.y + headerBox!.height;

  // Scroll 4th group into view and check sticky nav stays in viewport below header
  const fourthGroup = page.locator("#work-tour-zgyc-smart-light-group-4");
  await fourthGroup.scrollIntoViewIfNeeded();

  await expect(tourNav).toBeInViewport();
  const navRect4 = await tourNav.evaluate((el) => el.getBoundingClientRect());
  expect(navRect4.top).toBeGreaterThanOrEqual(headerBottom - 2);
  expect(navRect4.bottom).toBeLessThanOrEqual(900 + 20);

  // Scroll 5th group into view and observe aria-current update & sticky position
  const fifthGroup = page.locator("#work-tour-zgyc-smart-light-group-5");
  await fifthGroup.scrollIntoViewIfNeeded();

  await expect(navLinks.nth(4)).toHaveAttribute("aria-current", "location");
  await expect(tourNav).toBeInViewport();
  const navRect5 = await tourNav.evaluate((el) => el.getBoundingClientRect());
  expect(navRect5.top).toBeGreaterThanOrEqual(headerBottom - 2);
  expect(navRect5.bottom).toBeLessThanOrEqual(900 + 20);

  // Click 2nd group nav link to jump
  const secondLink = navLinks.nth(1);
  await secondLink.click();
  const secondGroup = page.locator("#work-tour-zgyc-smart-light-group-2");
  await expect(secondGroup).toBeInViewport();
});

test("work system tour isolates multiple instances: second instance observer and anchors only affect second instance", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/works/zgyc-smart-light", { waitUntil: "networkidle" });

  // Dynamically append a second WorkSystemTour instance (mock-system) into DOM
  await page.evaluate(() => {
    const secondTour = document.createElement("div");
    secondTour.className = "work-tour";
    secondTour.id = "work-tour-mock-system";
    secondTour.innerHTML = `
      <nav class="work-tour__nav" aria-label="Mock系统巡览">
        <div class="work-tour__nav-sticky">
          <ul class="work-tour__nav-list clean-list" role="list">
            <li>
              <a href="#work-tour-mock-system-group-1" class="work-tour__nav-link" data-group-id="work-tour-mock-system-group-1" aria-current="location" data-active="true">
                <span class="work-tour__nav-name">实例二 分组一</span>
              </a>
            </li>
            <li>
              <a href="#work-tour-mock-system-group-2" class="work-tour__nav-link" data-group-id="work-tour-mock-system-group-2">
                <span class="work-tour__nav-name">实例二 分组二</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div class="work-tour__stream">
        <section id="work-tour-mock-system-group-1" class="work-tour__group" data-tour-group="work-tour-mock-system-group-1">
          <div style="height: 800px; padding: 20px;">Group 1 Content</div>
        </section>
        <section id="work-tour-mock-system-group-2" class="work-tour__group" data-tour-group="work-tour-mock-system-group-2">
          <div style="height: 800px; padding: 20px;">Group 2 Content</div>
        </section>
      </div>
      <div style="height: 1200px;" aria-hidden="true">Spacer</div>
      <span id="mock-marker" style="display: none;" aria-hidden="true"></span>
    `;
    document.querySelector("main")?.appendChild(secondTour);

    // Initialize IntersectionObserver on second tour simulating WorkTourObserver logic via closest(".work-tour")
    const marker = document.getElementById("mock-marker");
    const root = marker?.closest<HTMLElement>(".work-tour");
    if (!root) return;

    const groupIds = ["work-tour-mock-system-group-1", "work-tour-mock-system-group-2"];
    const groupElements = groupIds
      .map((id) => root.querySelector<HTMLElement>("#" + id))
      .filter((el): el is HTMLElement => el !== null);
    const navLinks = Array.from(root.querySelectorAll<HTMLAnchorElement>(".work-tour__nav-link"));

    function setActiveGroup(id: string) {
      for (const link of navLinks) {
        if (link.getAttribute("data-group-id") === id) {
          link.setAttribute("aria-current", "location");
          link.setAttribute("data-active", "true");
        } else {
          link.removeAttribute("aria-current");
          link.removeAttribute("data-active");
        }
      }
    }

    const visibleGroups = new Map<string, number>();
    const obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleGroups.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleGroups.delete(entry.target.id);
        }
      }
      if (visibleGroups.size > 0) {
        for (const el of groupElements) {
          if (visibleGroups.has(el.id)) {
            setActiveGroup(el.id);
            break;
          }
        }
      }
    }, { rootMargin: "-15% 0px -40% 0px", threshold: [0, 0.1, 0.25, 0.5] });

    for (const el of groupElements) {
      obs.observe(el);
    }
  });

  const tour1 = page.locator("#work-tour-zgyc-smart-light");
  const tour2 = page.locator("#work-tour-mock-system");

  await expect(tour1).toBeVisible();
  await expect(tour2).toBeVisible();

  const tour1Links = tour1.locator(".work-tour__nav-link");
  const tour2Links = tour2.locator(".work-tour__nav-link");

  // Initial state: first link of both instances is active
  await expect(tour1Links.nth(0)).toHaveAttribute("data-active", "true");
  await expect(tour2Links.nth(0)).toHaveAttribute("data-active", "true");

  // Scroll instance 2 group 2 into view
  const instance2Group2 = page.locator("#work-tour-mock-system-group-2");
  await instance2Group2.scrollIntoViewIfNeeded();

  // Assert instance 2 link 2 became active, link 1 became inactive
  await expect(tour2Links.nth(1)).toHaveAttribute("aria-current", "location");
  await expect(tour2Links.nth(0)).not.toHaveAttribute("aria-current", "location");

  // Test anchor jump within second instance
  await tour2Links.nth(0).click();
  const instance2Group1 = page.locator("#work-tour-mock-system-group-1");
  await expect(instance2Group1).toBeInViewport();

  // Assert instance 1 links are completely unaffected and maintain their slug prefix
  const tour1Count = await tour1Links.count();
  expect(tour1Count).toBe(5);
  for (let i = 0; i < tour1Count; i++) {
    const link = tour1Links.nth(i);
    const groupId = await link.getAttribute("data-group-id");
    expect(groupId).toContain("work-tour-zgyc-smart-light-group-");
  }
});

test("work system tour reflows properly at mobile viewports with static positioning and no overflow", async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 568 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/works/zgyc-smart-light", { waitUntil: "networkidle" });

    const tour = page.locator(".work-tour");
    await expect(tour).toBeVisible();

    const tourNav = page.locator(".work-tour__nav");
    const navPosition = await tourNav.evaluate((el) => getComputedStyle(el).position);
    expect(navPosition).toBe("static");

    const navSticky = page.locator(".work-tour__nav-sticky");
    const stickyPosition = await navSticky.evaluate((el) => getComputedStyle(el).position);
    expect(stickyPosition).toBe("static");

    const groups = page.locator(".work-tour__group");
    await expect(groups).toHaveCount(5);
    const items = page.locator(".work-tour__item");
    await expect(items).toHaveCount(15);

    await expectNoHorizontalOverflow(page, "/works/zgyc-smart-light");
  }
});

test("work system tour applies proper print rules: hidden nav, avoiding item page-break, and allowing group page-break", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/works/zgyc-smart-light", { waitUntil: "networkidle" });

  await page.emulateMedia({ media: "print" });

  const tourNav = page.locator(".work-tour__nav");
  await expect(tourNav).toBeHidden();
  const navDisplay = await tourNav.evaluate((el) => getComputedStyle(el).display);
  expect(navDisplay).toBe("none");

  const groups = page.locator(".work-tour__group");
  await expect(groups).toHaveCount(5);
  const groupBreakInside = await groups.first().evaluate((el) => getComputedStyle(el).breakInside);
  expect(groupBreakInside).not.toBe("avoid");

  const items = page.locator(".work-tour__item");
  await expect(items).toHaveCount(15);
  const itemBreakInside = await items.first().evaluate((el) => getComputedStyle(el).breakInside);
  expect(itemBreakInside).toBe("avoid");
});

test("work system tour satisfies reduced-motion and forced-colors contracts", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  // Reduced motion: nav-link transition disabled
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/works/zgyc-smart-light", { waitUntil: "networkidle" });
  const navLink = page.locator(".work-tour__nav-link").first();
  const linkTransition = await navLink.evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(linkTransition === "0s" || linkTransition === "none" || linkTransition === "").toBeTruthy();

  // Forced colors: active nav link has visible outline
  await page.emulateMedia({ forcedColors: "active" });
  const activeLink = page.locator(".work-tour__nav-link[data-active='true']").first();
  const outlineStyle = await activeLink.evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(outlineStyle).not.toBe("none");
});

test("matrix-calculator and intellibuddy preserve standard gallery layout without regression", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });

  // Matrix Calculator
  await page.goto("/works/matrix-calculator", { waitUntil: "networkidle" });
  await expect(page.locator(".work-tour")).toHaveCount(0);
  const matrixGallery = page.locator(".work-gallery");
  await expect(matrixGallery).toBeVisible();
  await expect(matrixGallery.locator(".work-gallery__item")).toHaveCount(1);

  // IntelliBuddy
  await page.goto("/works/intellibuddy", { waitUntil: "networkidle" });
  await expect(page.locator(".work-tour")).toHaveCount(0);
  const intelliGallery = page.locator(".work-gallery");
  await expect(intelliGallery).toBeVisible();
  await expect(intelliGallery.locator(".work-gallery__item")).toHaveCount(4);
});

test("join page renders 3D poster tilt cards with dialog lightbox", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/join", { waitUntil: "networkidle" });

  const posterGrid = page.locator(".poster-tilt-grid");
  await expect(posterGrid).toBeVisible();

  const tiltCards = page.locator(".poster-tilt");
  await expect(tiltCards).toHaveCount(2);

  // First card trigger opens Dialog
  await tiltCards.first().click();
  const dialog = page.locator(".dialog__content");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("about page renders culture bento photo gallery with focus dimming and lightbox", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/about", { waitUntil: "networkidle" });

  const cultureBento = page.locator(".culture-bento");
  await expect(cultureBento).toBeVisible();

  const cards = page.locator(".culture-bento__card");
  await expect(cards).toHaveCount(8);

  // Hover first card triggers focus dimming on others
  await cards.first().hover();
  await expect(cards.first()).toHaveAttribute("data-hovered", "true");
  await expect(cards.nth(1)).toHaveAttribute("data-dimmed", "true");

  // Click card opens Dialog lightbox
  await cards.first().click();
  const dialog = page.locator(".dialog__content");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});
