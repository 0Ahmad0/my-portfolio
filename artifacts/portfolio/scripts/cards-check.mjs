// Run against Vite without Supabase env (sample certificates). Credential fixture stays in the browser; no real links are opened.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
});
await fs.mkdir("tmp/geometric-cards", { recursive: true });
try {
  for (const width of [390, 1440])
    for (const language of ["ar", "en"])
      for (const theme of ["light", "dark"]) {
        const page = await browser.newPage({
          viewport: { width, height: 1000 },
        });
        await page.addInitScript(
          ({ language, theme }) => {
            localStorage.setItem("portfolio_lang", language);
            localStorage.setItem("theme", theme);
          },
          { language, theme },
        );
        await page.goto(process.env.UI_URL || "http://127.0.0.1:5290");
        await page.locator("#contact form").waitFor();
        await page.evaluate(() => document.fonts.ready);
        assert.match(
          await page
            .locator("#certificates .engineering-card")
            .first()
            .evaluate((el) => getComputedStyle(el).clipPath),
          /^polygon/,
        );
        assert.equal(
          await page.locator('#certificates a[href="#"]').count(),
          0,
        );
        assert.equal(
          await page
            .locator("#certificates")
            .getByText(
              language === "ar"
                ? "لم يُضف رابط الشهادة بعد"
                : "Certificate link not added yet",
            )
            .count(),
          3,
        );
        await page
          .locator("#certificates")
          .screenshot({
            path: `tmp/geometric-cards/${width}-${language}-${theme}-certificates.png`,
          });
        await page
          .locator("#contact")
          .screenshot({
            path: `tmp/geometric-cards/${width}-${language}-${theme}-contact.png`,
          });
        if (width === 1440) {
          const heights = await page
            .locator("#contact .engineering-card")
            .evaluateAll((els) =>
              els.map((el) => el.getBoundingClientRect().height),
            );
          assert.ok(Math.abs(heights[0] - heights[1]) < 1);
        }
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
        await page.close();
        console.log(
          `PASS ${width} ${language} ${theme}: polygon cards, missing credentials, equal heights, layout`,
        );
      }
  const page = await browser.newPage();
  await page.route("**/src/contexts/portfolio-data.ts*", async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(
      'credentialUrl: "#"',
      'credentialUrl: "https://example.com/test-credential"',
    );
    await route.fulfill({ response, body });
  });
  await page.goto(process.env.UI_URL || "http://127.0.0.1:5290");
  const link = page.getByTestId("cert-link-1");
  await link.waitFor();
  assert.equal(
    await link.getAttribute("href"),
    "https://example.com/test-credential",
  );
  assert.equal(await link.getAttribute("target"), "_blank");
  assert.match(await link.innerText(), /View certificate|عرض الشهادة/);
  assert.equal(await link.locator("svg").count(), 1);
  console.log(
    "PASS valid credential: visible text, arrow, original URL, new tab (browser-only fixture; no external navigation)",
  );
} finally {
  await browser.close();
}
