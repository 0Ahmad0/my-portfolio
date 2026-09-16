# Performance and accessibility maintenance

The homepage renders immediately while public portfolio data loads. Dashboard and contact-form code are separate chunks. Backgrounds, project cards, statistics and section transitions avoid continuous JavaScript animation and scroll measurements. Project galleries and testimonials use explicit controls instead of autoplay.

## Images and fonts

- Responsive WebP files live in `public/images`, indexed by source URL in `src/assets/images.json`. Their filenames include content hashes; images reserve their dimensions and load lazily.
- Inter and Cairo WOFF2 fonts are served locally from `public/fonts`; font licenses are included. Only the default Latin font is preloaded.
- `pnpm --filter @workspace/portfolio run images:optimize` discovers new images from public Supabase portfolio tables using the existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` environment variables. It never reads authentication or contact-message tables.
- Builds reuse existing optimized files. If an image changes at the **same URL**, run `pnpm --filter @workspace/portfolio run images:optimize --refresh`, review the generated assets, and rebuild. New dashboard image URLs work immediately using their original source; the next build creates local variants for supported hosts.
- Supported remote sources are GitHub, raw.githubusercontent.com, images.unsplash.com, and the configured Supabase host. Other hosts retain their original URLs. Failed downloads retain the last optimized version.
- Vercel configuration caches hashed assets, images and fonts for one year. Do not rename mutable files into these hashed directories manually.

## Verification

```sh
pnpm --filter @workspace/portfolio run typecheck
pnpm --filter @workspace/portfolio test
pnpm run build:deploy
```

The tests verify actual image formats/dimensions, every generated asset reference, local font files, zoomable viewport metadata and the canonical URL. Manual browser checks cover navigation, language/theme changes, project dialogs and keyboard focus, gallery controls, mobile layouts and form labels. Contact messages are not submitted during checks.

Run Lighthouse against the production build with HTTP compression enabled; the Vite preview server alone does not reproduce production compression. Use consistent hardware and settings, with builds stopped during measurements. Local results are diagnostics, not a guarantee of a hosted PageSpeed score. After deployment, repeat PageSpeed on mobile and desktop, verify cache headers, and check the public content and dashboard sign-in.

## Deployment

The root Vercel configuration builds from the repository root and serves `artifacts/portfolio/dist`. The portfolio-level configuration supports an existing Vercel project whose root directory is `artifacts/portfolio`. Keep the existing public Supabase environment variables in the selected Vercel project; never set a service-role key in a `VITE_` variable.

## Verification status — 2026-09-16

- Production Vite build, portfolio TypeScript check, generated image/font checks and `git diff --check` passed.
- Browser checks covered 320px/390px mobile layouts, English/Arabic, light/dark themes, keyboard dismissal and focus return in project dialogs, gallery controls, and Arabic form validation without submitting a message. Early contact-anchor navigation was retested after asynchronous data loaded: its top aligned at 96px below the fixed header, all 10 projects were present, and there were no broken images.
- Axe WCAG A/AA and best-practice checks returned no violations in the checked states, including the final Arabic light-theme view.
- Before the last small navigation/contrast edits, local Lighthouse mobile runs returned Accessibility/Best Practices/SEO of 100/100/100. Performance varied substantially: 68 and 96 for the same build (FCP about 2.0s, LCP about 2.1s, CLS 0.0035; blocking time varied from 20.5ms to 1599ms). The 68 run overlapped a local type check and must not be treated as an isolated benchmark. An earlier intermediate build scored 89.
- Isolated Lighthouse checks of the final revision on mobile and desktop, and post-deployment PageSpeed verification, remain pending. No final desktop score is claimed.
- The final local build used the existing optimized images. The next network-enabled production build also generates the newly configured 640px project-cover variants.

Do not present these local measurements as the site's final hosted PageSpeed scores. The final production bundle still has a Vite size warning (homepage JavaScript about 608KB minified / 183KB gzip), and further code splitting can be considered if the isolated deployment audit identifies it as a material bottleneck.
