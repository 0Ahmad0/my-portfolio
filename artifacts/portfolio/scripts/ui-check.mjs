// Run against Vite with VITE_API_URL=http://127.0.0.1:5174 and PORT=5174.
// Uses Playwright from PLAYWRIGHT_MODULE (or an existing local installation).
// Contact requests are intercepted; no real messages are sent.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
});
const output = process.env.UI_SCREENSHOTS || "tmp/ui-check";
await fs.mkdir(output, { recursive: true });
try {
  for (const width of [320, 390, 768, 1440]) {
    for (const language of ["en", "ar"]) {
      for (const theme of ["light", "dark"]) {
        const page = await browser.newPage({
          viewport: { width, height: 1000 },
          reducedMotion: "no-preference",
        });
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.addInitScript(
          ({ language, theme }) => {
            localStorage.setItem("portfolio_lang", language);
            localStorage.setItem("theme", theme);
          },
          { language, theme },
        );
        let outcome = 500;
        let attempts = 0;
        let release;
        await page.route("**/*", async (route) => {
          const request = route.request();
          if (
            request.method() === "POST" &&
            new URL(request.url()).pathname === "/api/contact"
          ) {
            attempts++;
            await new Promise((resolve) => {
              release = resolve;
            });
            await route.fulfill({
              status: outcome,
              contentType: "application/json",
              body: "{}",
            });
          } else if (!["GET", "HEAD"].includes(request.method())) {
            await route.abort();
          } else {
            await route.continue();
          }
        });
        await page.goto(process.env.UI_URL || "http://127.0.0.1:5174");
        const name = page.getByTestId("input-contact-name");
        const email = page.getByTestId("input-contact-email");
        const message = page.getByTestId("input-contact-message");
        const submit = page.getByTestId("button-contact-submit");
        await name.waitFor();
        await page.evaluate(() => document.fonts.ready);
        const transform = () =>
          page
            .locator(".aurora-orb-one")
            .evaluate((el) => getComputedStyle(el).transform);
        const before = await transform();
        await page.waitForTimeout(300);
        assert.notEqual(
          await transform(),
          before,
          "Background must move on mobile and desktop",
        );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
        await page.screenshot({
          path: `${output}/${width}-${language}-${theme}-hero.png`,
        });
        await page
          .locator("#contact")
          .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
        await page.screenshot({
          path: `${output}/${width}-${language}-${theme}-contact.png`,
        });
        await submit.click();
        assert.equal(attempts, 0, "Invalid forms must not send");
        assert.equal(await name.getAttribute("aria-invalid"), "true");
        assert.equal(
          await name.evaluate((el) => el === document.activeElement),
          true,
        );
        await name.fill(language === "ar" ? "أحمد" : "Test visitor");
        await email.fill("visitor@example.com");
        await message.fill("A test project inquiry, intercepted locally.");
        await submit.click();
        await page.waitForFunction(
          () =>
            document
              .querySelector("#contact form")
              .getAttribute("aria-busy") === "true",
        );
        assert.equal(await name.isDisabled(), true);
        for (let retry = 0; !release && retry < 100; retry++)
          await page.waitForTimeout(20);
        assert.ok(
          release,
          "Expected intercepted request; start Vite with the documented VITE_API_URL",
        );
        release();
        await page.locator("#contact [role=status] p").waitFor();
        assert.match(await message.inputValue(), /intercepted locally/);
        assert.equal(await submit.isEnabled(), true);
        outcome = 200;
        release = null;
        await submit.click();
        for (let retry = 0; !release && retry < 100; retry++)
          await page.waitForTimeout(20);
        assert.ok(release, "Expected intercepted retry");
        release();
        await page.waitForFunction(
          () =>
            document.querySelector('[data-testid="input-contact-message"]')
              .value === "",
        );
        assert.equal(attempts, 2);
        assert.match(
          await page.locator("#contact [role=status]").innerText(),
          language === "ar" ? /بنجاح/ : /Message sent/,
        );
        await page.emulateMedia({ reducedMotion: "reduce" });
        assert.equal(
          await page
            .locator(".aurora-orb-one")
            .evaluate((el) => getComputedStyle(el).animationName),
          "none",
        );
        assert.deepEqual(errors, []);
        console.log(
          `PASS ${width}px ${language} ${theme}: motion, layout, validation, failure recovery, success, reduced motion`,
        );
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}
