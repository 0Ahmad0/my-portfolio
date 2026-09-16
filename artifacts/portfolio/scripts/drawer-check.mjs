// UI_URL defaults to the local production preview. Reuse an installed Playwright
// via PLAYWRIGHT_MODULE and optionally CHROME_PATH; no extra app dependency.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
});
const output = process.env.UI_SCREENSHOTS || "tmp/drawer-check";
await fs.mkdir(output, { recursive: true });
try {
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [768, 390],
  ]) {
    for (const language of ["ar", "en"]) {
      for (const theme of ["light", "dark"]) {
        const page = await browser.newPage({ viewport: { width, height } });
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.addInitScript(
          ({ language, theme }) => {
            localStorage.setItem("portfolio_lang", language);
            localStorage.setItem("theme", theme);
          },
          { language, theme },
        );
        await page.goto(process.env.UI_URL || "http://127.0.0.1:4181");
        const trigger = page.getByTestId("button-mobile-menu");
        const drawer = page.getByTestId("mobile-drawer");
        await trigger.click();
        await drawer.evaluate((el) =>
          Promise.all(
            el.getAnimations().map((animation) => animation.finished),
          ),
        );
        await page.evaluate(() => document.fonts.ready);
        const box = await drawer.boundingBox();
        assert.ok(
          Math.abs(
            (language === "ar" ? box.x + box.width : box.x) -
              (language === "ar" ? width : 0),
          ) < 1,
        );
        assert.equal(box.height, height);
        assert.equal(
          await drawer.getAttribute("dir"),
          language === "ar" ? "rtl" : "ltr",
        );
        assert.equal(await page.locator("#mobile-navigation a").count(), 8);
        assert.equal(
          await page
            .locator("#mobile-navigation a")
            .first()
            .getAttribute("href"),
          "#main-content",
        );
        assert.equal(
          await page.evaluate(() => getComputedStyle(document.body).overflow),
          "hidden",
        );
        await page.screenshot({
          path: `${output}/${width}-${language}-${theme}.png`,
        });
        for (let i = 0; i < 12; i++) {
          await page.keyboard.press("Tab");
          assert.equal(
            await drawer.evaluate((el) => el.contains(document.activeElement)),
            true,
          );
        }
        await page.getByTestId("button-drawer-language").click();
        assert.equal(
          await drawer.getAttribute("dir"),
          language === "ar" ? "ltr" : "rtl",
        );
        await page.getByTestId("button-drawer-language").click();
        await page.getByTestId("button-drawer-theme").click();
        assert.equal(
          await page.evaluate(() =>
            document.documentElement.classList.contains("dark"),
          ),
          theme !== "dark",
        );
        await page.getByTestId("button-drawer-theme").click();
        await page.keyboard.press("Escape");
        await drawer.waitFor({ state: "hidden" });
        assert.equal(
          await trigger.evaluate((el) => el === document.activeElement),
          true,
        );
        await trigger.click();
        await page.mouse.click(language === "ar" ? 8 : width - 8, height / 2);
        await drawer.waitFor({ state: "hidden" });
        await trigger.click();
        await page.getByTestId("button-menu-close").click();
        await drawer.waitFor({ state: "hidden" });
        await trigger.click();
        await page
          .locator('#mobile-navigation a[href="#testimonials"]')
          .click();
        await drawer.waitFor({ state: "hidden" });
        await page.waitForFunction(
          () =>
            Math.abs(
              document.querySelector("#testimonials").getBoundingClientRect()
                .top - 96,
            ) < 2,
        );
        assert.equal(new URL(page.url()).hash, "#testimonials");
        await trigger.click();
        await page.setViewportSize({ width: 1440, height: 1000 });
        await drawer.waitFor({ state: "hidden" });
        assert.notEqual(
          await page.evaluate(() => getComputedStyle(document.body).overflow),
          "hidden",
        );
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await trigger.click();
        assert.ok(
          await drawer.evaluate(
            (el) =>
              parseFloat(getComputedStyle(el).animationDuration) <= 0.00001,
          ),
        );
        assert.deepEqual(errors, []);
        console.log(
          `PASS ${width}x${height} ${language} ${theme}: alignment, focus, settings, dismissal, navigation, resize, reduced motion`,
        );
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}
