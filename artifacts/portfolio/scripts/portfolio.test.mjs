import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
test("every responsive image points to a real WebP with accurate srcset dimensions", async () => {
  const manifest = JSON.parse(
    await fs.readFile(path.join(root, "src/assets/images.json"), "utf8"),
  );
  assert.ok(Object.keys(manifest).length > 0);
  for (const [source, variants] of Object.entries(manifest)) {
    assert.ok(variants.length, source);
    let previousWidth = 0;
    for (const variant of variants) {
      assert.match(variant.src, /^\/images\/[a-f0-9]{12}-\d+\.webp$/);
      const bytes = await fs.readFile(path.join(root, "public", variant.src));
      const metadata = await sharp(bytes).metadata();
      assert.equal(metadata.format, "webp", source);
      assert.equal(metadata.width, variant.width, source);
      assert.equal(metadata.height, variant.height, source);
      assert.ok(variant.width >= previousWidth, source);
      previousWidth = variant.width;
    }
  }
});

test("self-hosted fonts exist and the document remains zoomable and crawlable", async () => {
  const css = await fs.readFile(path.join(root, "src/fonts.css"), "utf8");
  const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map((match) => match[1]);
  assert.ok(urls.length > 0);
  for (const url of urls) {
    assert.match(url, /^\/fonts\/[a-f0-9]{12}\.woff2$/);
    const bytes = await fs.readFile(path.join(root, "public", url));
    assert.equal(bytes.subarray(0, 4).toString(), "wOF2");
  }
  const html = await fs.readFile(path.join(root, "index.html"), "utf8");
  assert.doesNotMatch(html, /maximum-scale|user-scalable|fonts\.googleapis/);
  assert.match(html, /name="description"\s+content="[^\"]+"/);
  assert.match(html, /rel="canonical" href="https:\/\/ahmadalhariri\.dev\/"/);
});
