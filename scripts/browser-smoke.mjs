import { chromium } from "@playwright/test";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";
const buildDirectory = process.env.NEXT_DIST_DIR ?? ".next";
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

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  }));
  return nested.flat();
}

async function assertNoClientSecrets() {
  const staticRoot = path.join(process.cwd(), buildDirectory, "static");
  const textExtensions = new Set([".css", ".html", ".js", ".json", ".map", ".txt"]);
  const files = (await listFiles(staticRoot)).filter((file) => textExtensions.has(path.extname(file)));
  const forbiddenNames = ["TURNSTILE_SECRET_KEY", "RESEND_API_KEY", "JOIN_WEBHOOK_URL", "JOIN_NOTIFY_EMAIL"];
  const forbiddenValues = forbiddenNames
    .map((name) => process.env[name])
    .filter((value) => typeof value === "string" && value.length >= 8);

  for (const file of files) {
    const contents = await readFile(file, "utf8");
    const leakedName = forbiddenNames.find((name) => contents.includes(name));
    if (leakedName) throw new Error(`Client build ${path.relative(process.cwd(), file)} contains server-only variable name ${leakedName}`);
    if (forbiddenValues.some((value) => contents.includes(value))) {
      throw new Error(`Client build ${path.relative(process.cwd(), file)} contains a configured server secret`);
    }
  }
}

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
        desktopRail: document.querySelector(".trajectory-rail") ? getComputedStyle(document.querySelector(".trajectory-rail")).display : null,
        mobileRail: document.querySelector(".mobile-rail") ? getComputedStyle(document.querySelector(".mobile-rail")).display : null,
        activeAnimations: document.getAnimations().filter((animation) => {
          const target = animation.effect?.target;
          if (!(target instanceof Element)) return false;
          const rect = target.getBoundingClientRect();
          const progress = animation.effect?.getComputedTiming().progress;
          return rect.bottom > 0 && rect.top < innerHeight && progress !== null && progress > 0 && progress < 1;
        }).length,
        infiniteAnimations: document.getAnimations().filter((animation) => animation.effect?.getTiming().iterations === Infinity).length,
      }));
      results.push({ route, viewport: viewport.width, theme, status: response?.status(), ...layout });
      if (response?.status() !== 200) throw new Error(`${route} returned ${response?.status()}`);
      if (layout.scrollWidth > layout.clientWidth) throw new Error(`${route} overflows at ${viewport.width}px: ${layout.scrollWidth} > ${layout.clientWidth}`);
      if (layout.theme !== theme) throw new Error(`${route} expected ${theme} theme, got ${layout.theme}`);
      if (layout.activeAnimations > 2) throw new Error(`${route} runs ${layout.activeAnimations} visible animations at once`);
      if (layout.infiniteAnimations > 0) throw new Error(`${route} contains an infinite animation`);
      if (viewport.width >= 1280 && layout.desktopRail !== "block") throw new Error(`${route} desktop TrajectoryRail is missing`);
      if (viewport.width < 1024 && layout.mobileRail !== "block") throw new Error(`${route} mobile TrajectoryRail is missing`);
    }

    if (consoleErrors.length > 0) throw new Error(`Console errors at ${viewport.width}px/${theme}:\n${consoleErrors.join("\n")}`);
    await context.close();
  }
}

// Every route must remain complete and overflow-free with reduced motion.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of routes) {
    await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
    const state = await page.evaluate(() => ({
      reduce: matchMedia("(prefers-reduced-motion: reduce)").matches,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      infiniteAnimations: document.getAnimations().filter((animation) => animation.effect?.getTiming().iterations === Infinity).length,
    }));
    if (!state.reduce) throw new Error(`${route} did not receive reduced-motion preference`);
    if (state.scrollWidth > state.clientWidth) throw new Error(`${route} reduced-motion overflow: ${state.scrollWidth} > ${state.clientWidth}`);
    if (state.infiniteAnimations > 0) throw new Error(`${route} reduced-motion contains an infinite animation`);
  }
  if (errors.length) throw new Error(`Reduced-motion console errors:\n${errors.join("\n")}`);
  await context.close();
}

// Every route must also fit a real touch/hover-none profile.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
    const state = await page.evaluate(() => ({
      hoverNone: matchMedia("(hover: none)").matches,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    if (!state.hoverNone) throw new Error(`${route} touch profile still reports hover support`);
    if (state.scrollWidth > state.clientWidth) throw new Error(`${route} touch overflow: ${state.scrollWidth} > ${state.clientWidth}`);
  }
  await context.close();
}

// Join form chapter, responsive control, and keyboard contracts.
{
  const sectionIds = ["join-start", "join-fit", "join-process", "join-voices", "join-faq", "join-form", "join-channel", "join-poster"];

  for (const viewport of [{ width: 320, height: 900 }, { width: 1440, height: 1000 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto(`${baseURL}/join`, { waitUntil: "networkidle" });

    const joinState = await page.evaluate((expectedIds) => {
      const railTargets = [...document.querySelectorAll(".trajectory-rail a")]
        .map((anchor) => anchor.getAttribute("href"));
      const sectionTops = expectedIds.map((id) => document.getElementById(id)?.getBoundingClientRect().top ?? Number.NaN);
      const controls = [...document.querySelectorAll(".join-form .field__control, .join-form button, .join-form__turnstile")]
        .map((control) => {
          const rect = control.getBoundingClientRect();
          return {
            id: control.id || control.className,
            left: rect.left,
            right: rect.right,
            clientWidth: control.clientWidth,
            scrollWidth: control.scrollWidth,
          };
        });
      const honeypot = document.getElementById("join-website");
      return {
        railTargets,
        sectionTops,
        controls,
        honeypotTabIndex: honeypot?.tabIndex,
        honeypotParentLeft: honeypot?.parentElement ? getComputedStyle(honeypot.parentElement).left : null,
        viewportWidth: document.documentElement.clientWidth,
      };
    }, sectionIds);

    const expectedTargets = sectionIds.map((id) => `#${id}`);
    if (JSON.stringify(joinState.railTargets) !== JSON.stringify(expectedTargets)) {
      throw new Error(`/join TrajectoryRail targets do not match its ${sectionIds.length} chapters`);
    }
    if (joinState.sectionTops.some((top, index, tops) => !Number.isFinite(top) || (index > 0 && top <= tops[index - 1]))) {
      throw new Error("/join chapter order does not match TrajectoryRail order");
    }
    if (joinState.honeypotTabIndex !== -1 || joinState.honeypotParentLeft !== "-10000px") {
      throw new Error("/join honeypot is visible or keyboard-focusable");
    }
    for (const control of joinState.controls) {
      if (control.left < -0.5 || control.right > joinState.viewportWidth + 0.5 || control.scrollWidth > control.clientWidth + 1) {
        throw new Error(`/join control ${control.id} overflows at ${viewport.width}px`);
      }
    }
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/join`, { waitUntil: "networkidle" });
  const fieldOrder = ["join-name", "join-student-id", "join-major", "join-grade", "join-contact", "join-track", "join-reason"];
  await page.locator("#join-name").focus();
  for (const expectedId of fieldOrder) {
    const activeId = await page.evaluate(() => document.activeElement?.id);
    if (activeId !== expectedId) throw new Error(`/join Tab order expected ${expectedId}, got ${activeId || "an unnamed element"}`);
    await page.keyboard.press("Tab");
  }

  let reachedSubmit = false;
  for (let step = 0; step < 6; step += 1) {
    const activeId = await page.evaluate(() => document.activeElement?.id);
    if (activeId === "join-website") throw new Error("/join Tab order entered the honeypot field");
    if (activeId === "join-submit") {
      reachedSubmit = true;
      break;
    }
    await page.keyboard.press("Tab");
  }
  if (!reachedSubmit) throw new Error("/join Tab order did not reach the submit button after the form fields");
  await context.close();
}

// Same-session home develop must not replay.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  await page.goto(`${baseURL}/about`, { waitUntil: "networkidle" });
  await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
  if (await page.locator(".develop").getAttribute("data-state") !== "done") throw new Error("Home Develop replayed in the same session");
  await context.close();
}

// Same-origin client navigation should use one 180ms View Transition when supported.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.addInitScript(() => {
    window.__viewTransitionCalls = 0;
    const original = document.startViewTransition?.bind(document);
    if (original) document.startViewTransition = (callback) => {
      window.__viewTransitionCalls += 1;
      return original(callback);
    };
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/tracks`, { waitUntil: "networkidle" });
  const supported = await page.evaluate(() => typeof document.startViewTransition === "function");
  await Promise.all([page.waitForURL("**/tracks/ai"), page.locator(".track-panel").first().click()]);
  if (supported && await page.evaluate(() => window.__viewTransitionCalls) !== 1) throw new Error("Cross-route View Transition did not run exactly once");
  await context.close();
}

// Keyboard and content-truth contracts for the comparison component.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/works/matrix-calculator`, { waitUntil: "networkidle" });
  const slider = page.getByRole("slider", { name: "调整暗色与亮色截图的对比位置" });
  await slider.focus();
  await page.keyboard.press("End");
  if (await slider.getAttribute("aria-valuenow") !== "100") throw new Error("CompareSlider End key failed");
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowRight");
  if (await slider.getAttribute("aria-valuenow") !== "5") throw new Error("CompareSlider arrow key failed");
  await page.goto(`${baseURL}/works/zgyc-smart-light`, { waitUntil: "networkidle" });
  if (await page.getByRole("slider").count() !== 0) throw new Error("Single-shot work rendered a fake comparison slider");
  await context.close();
}

// Dialog keyboard behavior and focus return.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/awards`, { waitUntil: "networkidle" });
  const firstCert = page.locator(".cert-card").first();
  await firstCert.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));
  if (!(await firstCert.evaluate((element) => element === document.activeElement))) throw new Error("CertDrawer did not restore focus");
  await context.close();
}

// Touch devices must use viewport reveal and never register Spotlight pointermove.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await context.addInitScript(() => {
    window.__spotlightPointerMoves = 0;
    const original = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if (type === "pointermove" && this instanceof Element && this.classList.contains("spotlight-card")) window.__spotlightPointerMoves += 1;
      return original.call(this, type, listener, options);
    };
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/works`, { waitUntil: "networkidle" });
  const listeners = await page.evaluate(() => window.__spotlightPointerMoves);
  if (listeners !== 0) throw new Error(`Touch /works registered ${listeners} Spotlight pointermove listener(s)`);
  await page.locator(".spotlight-card").first().scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector(".spotlight-card")?.getAttribute("data-revealed") === "true");
  await context.close();
}

// Reduced motion must skip View Transitions and expose complete static end states.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  await context.addInitScript(() => {
    window.__viewTransitionCalls = 0;
    const original = document.startViewTransition?.bind(document);
    if (original) document.startViewTransition = (callback) => {
      window.__viewTransitionCalls += 1;
      return original(callback);
    };
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/awards`, { waitUntil: "networkidle" });
  await page.locator(".cert-card").first().click();
  if (await page.evaluate(() => window.__viewTransitionCalls) !== 0) throw new Error("Reduced motion used CertDrawer View Transition");
  await page.keyboard.press("Escape");
  await page.goto(`${baseURL}/tracks/ai`, { waitUntil: "networkidle" });
  const endState = await page.evaluate(() => ({
    clip: getComputedStyle(document.querySelector(".draw-path__animated")).clipPath,
    dash: getComputedStyle(document.querySelector(".draw-path path")).strokeDashoffset,
  }));
  if (endState.clip !== "inset(0px)" && endState.clip !== "inset(0% 0% 0% 0%)") throw new Error(`Reduced DrawPath is clipped: ${endState.clip}`);
  if (Number.parseFloat(endState.dash) !== 0) throw new Error(`Reduced DrawPath is incomplete: ${endState.dash}`);
  await context.close();
}

await assertNoClientSecrets();
await browser.close();
console.log(JSON.stringify(results, null, 2));
