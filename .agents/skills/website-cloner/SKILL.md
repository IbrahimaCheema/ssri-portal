---
name: website-cloner
description: Automated website cloning skill for Astro, Cloudflare R2/S3 asset mirroring, vanilla CSS design systems, and GitHub deployment safety.
---

# 🌐 Website Cloner Skill

This skill defines the standardized workflow, technical stack, asset ingestion protocol, and quality control procedures for cloning corporate and organization websites into high-performance, static **Astro** applications with **Cloudflare R2** asset hosting and **GitHub** version control.

---

## 🛠️ Stack & Architecture Standards

1. **Static Site Generator**: Astro (`output: 'static'`) for zero JS overhead and lightning-fast loading speeds.
2. **Styling**: Vanilla CSS using root design tokens (`--primary-color`, `--font-heading`, `--font-body`).
3. **Asset Ingestion & Hosting**:
   - Target website images/PDFs are mirror-downloaded via Node.js scripts (`scripts/ingest_assets.js`).
   - Media uploaded directly to Cloudflare R2 via `@aws-sdk/client-s3`.
   - Astro `<img>` components use local fallbacks:
     ```astro
     <img src={r2ImageUrl} alt={altText} loading="lazy" onerror={`this.src='${localFallbackUrl}'`} />
     ```
4. **Git Protocol**:
   - Local commits are encouraged after completing each page.
   - **NEVER** execute `git push` autonomously. Wait for explicit user instruction.

---

## 📋 Iterative Cloning Workflow

### Phase 1: Target Inspection & Token Extraction
1. Fetch target HTML, identify global colors, typography, header, navigation dropdowns, and footer.
2. Define CSS variables in `src/layouts/Layout.astro`.

### Phase 2: Structural Layout & Page Building
1. Create reusable header and footer components in `src/components/`.
2. Build standardized page hero banners using `.page_hero_banner` CSS classes.
3. Build pages sequentially (`index.astro`, `about.astro`, etc.).

### Phase 3: Asset Pipeline & R2 Mirroring
1. Collect external asset URLs from scraped source.
2. Run ingestion script to fetch files locally into `public/images` and upload to Cloudflare R2.
3. Replace raw remote URLs with CDN URLs in Astro templates.

### Phase 4: Local Build & QA Verification
1. Test build using `npm run build`.
2. Launch dev server (`npm run dev`) and test responsiveness across mobile, tablet, and desktop breakpoints.
