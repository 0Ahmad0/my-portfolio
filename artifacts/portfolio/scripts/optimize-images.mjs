import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { loadEnv } from "vite";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = { ...loadEnv("production", root, "VITE_"), ...process.env };
const manifestPath = path.join(root, "src/assets/images.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const refresh = process.argv.includes("--refresh");
const sources = new Map(
  Object.entries(manifest).map(([url, sizes]) => [
    url,
    sizes.map((image) => image.width),
  ]),
);
sources.set("/avatar.jpg", [320, 640]);
async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response;
}

// Only public portfolio tables are read; never include authentication or contact data.
if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  try {
    const read = async (table, query) =>
      (
        await request(
          `${env.VITE_SUPABASE_URL}/rest/v1/portfolio_${table}?${query}`,
          { headers: { apikey: env.VITE_SUPABASE_PUBLISHABLE_KEY } },
        )
      ).json();
    const [people, projects, testimonials] = await Promise.all([
      read("personal_info", "select=avatar_url&is_primary=eq.true"),
      read("projects", "select=image_url,images&is_published=eq.true"),
      read("testimonials", "select=image_url"),
    ]);
    for (const person of people)
      if (person.avatar_url) sources.set(person.avatar_url, [320, 640]);
    for (const project of projects) {
      for (const src of [project.image_url, ...(project.images || [])])
        if (src) sources.set(src, [480, 960]);
      const cover = project.images?.[0] || project.image_url;
      if (cover) sources.set(cover, [480, 640, 960]);
    }
    for (const review of testimonials)
      if (review.image_url) sources.set(review.image_url, [96]);
  } catch (error) {
    console.warn(
      `Image catalogue unavailable; keeping existing images: ${error.message}`,
    );
  }
}
const hosts = new Set([
  "github.com",
  "raw.githubusercontent.com",
  "images.unsplash.com",
]);
if (env.VITE_SUPABASE_URL) hosts.add(new URL(env.VITE_SUPABASE_URL).hostname);
await fs.mkdir(path.join(root, "public/images"), { recursive: true });
let updated = 0;
const entries = [...sources];
for (let offset = 0; offset < entries.length; offset += 4) {
  await Promise.all(
    entries.slice(offset, offset + 4).map(async ([src, widths]) => {
      try {
        // ponytail: remote URLs identify images; use --refresh if their contents change in place.
        if (
          !refresh &&
          src !== "/avatar.jpg" &&
          widths.every((width) =>
            manifest[src]?.some((image) =>
              image.src.endsWith(`-${width}.webp`),
            ),
          )
        ) {
          const present = await Promise.all(
            manifest[src].map((image) =>
              fs.access(path.join(root, "public", image.src)).then(
                () => true,
                () => false,
              ),
            ),
          );
          if (present.every(Boolean)) return;
        }
        let bytes;
        if (src === "/avatar.jpg")
          bytes = await fs.readFile(path.join(root, "public/avatar.jpg"));
        else {
          const url = new URL(src);
          if (url.protocol !== "https:" || !hosts.has(url.hostname)) return;
          const response = await request(url);
          if (Number(response.headers.get("content-length")) > 10 * 1024 * 1024)
            throw new Error("Image exceeds 10 MiB");
          bytes = Buffer.from(await response.arrayBuffer());
        }
        if (bytes.length > 10 * 1024 * 1024)
          throw new Error("Image exceeds 10 MiB");
        const metadata = await sharp(bytes, {
          limitInputPixels: 40000000,
        }).metadata();
        if (metadata.pages > 1) return; // Keep animated images intact.
        const hash = createHash("sha256")
          .update(bytes)
          .digest("hex")
          .slice(0, 12);
        const variants = [];
        for (const width of [...new Set(widths)].sort((a, b) => a - b)) {
          const result = await sharp(bytes)
            .rotate()
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 78, effort: 5 })
            .toBuffer({ resolveWithObject: true });
          const name = `${hash}-${width}.webp`;
          await fs.writeFile(
            path.join(root, "public/images", name),
            result.data,
          );
          variants.push({
            src: `/images/${name}`,
            width: result.info.width,
            height: result.info.height,
          });
        }
        manifest[src] = variants;
        updated++;
      } catch (error) {
        console.warn(`Keeping previous image for ${src}: ${error.message}`);
      }
    }),
  );
}
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `Optimized ${updated} public images. Unknown image hosts keep their original URLs.`,
);
