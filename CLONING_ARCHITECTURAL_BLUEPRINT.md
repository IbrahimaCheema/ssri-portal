# 🏗️ Corporate Website Cloning Architectural Blueprint & Standard Operating Procedures (SOP)

This document defines the exact architecture, technology stack, asset storage strategy, UI design system, and Git workflow guidelines established during the high-performance website cloning process.

Feed this document directly to **Antigravity AI** at the start of any new website cloning session to instantly enforce project standards without manual context setup.

## 0. 🔐 Security & Secret Management Protocols (MANDATORY)

- **Strict Zero-Hardcoded-Secrets Policy**: NEVER hardcode API keys, secret access keys, account IDs, tokens, database URIs, or passwords in source files, scripts, or markdown documents.
- **Environment Variable Usage**: Always load sensitive credentials via `process.env` (e.g. `process.env.R2_SECRET_ACCESS_KEY`).
- **`.env` File Isolation**: Store all local keys in `.env` or `.env.local` files, ensuring they are ignored in `.gitignore`.
- **Boilerplate Placeholders**: Use only generic tokens (e.g., `YOUR_R2_ACCESS_KEY_ID`, `YOUR_CLOUDFLARE_ACCOUNT_ID`) in any shared examples or documentation.

---

## 1. 🛠️ Core Technology Stack

- **Framework**: **Astro (Static Site Generator)**
  - Pure static HTML compilation for lightning-fast page loads and zero JS overhead.
- **Styling Architecture**: **Vanilla CSS**
  - Modular CSS variables (`--primary-color`, `--font-heading`, `--font-body`).
  - Dark mode green gradients, glassmorphism, responsive CSS Grid and Flexbox layouts.
- **Iconography**: **Crisp Vector SVGs**
  - 100% inline SVG icons for guaranteed render reliability across all browsers and devices (avoiding icon font loading glitches).
- **Media Storage & CDN**: **Cloudflare R2 Object Storage**
  - S3-compatible R2 storage managed via `@aws-sdk/client-s3` Node.js scripts.

---

## 2. ☁️ Cloudflare R2 Asset Ingestion Protocol

All target website media assets (images, PDFs, documents) are ingested locally and mirrored to Cloudflare R2 for high-speed CDN delivery.

### Automated Node.js Ingestion Pattern:
Create a temporary script (`scripts/ingest_assets.js`) for each page/section using the following boilerplate:

```javascript
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'YOUR_CLOUDFLARE_ACCOUNT_ID';
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || 'YOUR_R2_ACCESS_KEY_ID';
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || 'YOUR_R2_SECRET_ACCESS_KEY';
const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'ssri-uploads';
const PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || 'https://docs.ssri.org.pk';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY },
  forcePathStyle: true
});

const items = [
  {
    url: 'https://www.target-website.com/wp-content/uploads/image1.jpg',
    localName: 'page_feature_1.jpg',
    r2Key: 'images/page_feature_1.jpg',
    mime: 'image/jpeg'
  }
];

async function run() {
  const publicImages = path.resolve('public/images');
  if (!fs.existsSync(publicImages)) fs.mkdirSync(publicImages, { recursive: true });

  for (const item of items) {
    const localPath = path.join(publicImages, item.localName);
    execSync(`curl.exe -k -s -L -A "Mozilla/5.0" "${item.url}" -o "${localPath}"`);
    if (fs.existsSync(localPath)) {
      const buffer = fs.readFileSync(localPath);
      await r2.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: item.r2Key,
        Body: buffer,
        ContentType: item.mime
      }));
      console.log(`✓ Uploaded: ${PUBLIC_DOMAIN}/${item.r2Key}`);
    }
  }
}
run();
```

### Image Component Fallback Rule:
All Astro image tags MUST include a local fallback handler:
```astro
<img 
  src={r2ImageUrl} 
  alt="Feature Description" 
  loading="lazy"
  onerror={`this.src='${localFallbackUrl}'`}
/>
```

---

## 3. 🎨 UI Design System & Component Standardization

> [!IMPORTANT]
> **MANDATORY DESIGN CONTINUITY RULE**: All cloned inner pages MUST automatically inherit the master design system, color palette, typography, button styles, and card aesthetics established on the Homepage. Do not introduce disconnected or non-standard styles on inner pages.

### Standard Top Page Hero Banner (`.page_hero_banner`)
Every inner page must utilize the standardized corporate top page hero banner:

```astro
<section class="page_hero_banner">
  <div class="container">
    <div class="hero_breadcrumbs">
      <a href="/">Home</a> <i class="fa fa-angle-right"></i>
      <span>Section</span> <i class="fa fa-angle-right"></i>
      <span class="current">Page Title</span>
    </div>
    <h1 class="hero_page_title">Page Title</h1>
    <p class="hero_subtitle">Concise 1-2 sentence executive summary of the page content.</p>
  </div>
</section>
```

```css
.page_hero_banner {
  background: linear-gradient(135deg, #004d00 0%, #002b00 100%);
  color: #ffffff;
  padding: 55px 0 45px;
  border-bottom: 3px solid var(--primary-color);
}
.hero_breadcrumbs {
  font-size: 13px;
  color: #a0c8a0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.hero_page_title {
  font-size: 36px;
  font-family: var(--font-heading);
  font-weight: 700;
  margin-bottom: 10px;
  color: #ffffff;
}
.hero_subtitle {
  font-size: 16px;
  color: #e0f0e0;
  max-width: 750px;
}
```

---

## 4. 🔒 Git Commit & Remote Synchronization Protocol

> [!CAUTION]
> **MANDATORY GIT RULE**: NEVER run `git push` autonomously.

- **Local Development**: Format, test, build (`npm run build`), and commit changes locally:
  ```bash
  git add .
  git commit -m "Description of changes"
  ```
- **Remote Push**: Execute `git push origin main` ONLY when the user explicitly requests it in chat (e.g. typing "git push").

---

## 5. 🚀 Step-by-Step Guide for Starting Your New Project

### Step 1: Initialize Astro & Dependencies
Run:
```bash
npm install
```

### Step 2: Set Environment Variables
Copy `.env.example` to `.env` and fill in Cloudflare R2 credentials if asset upload is needed.

### Step 3: Run Ingestion & Development Server
```bash
npm run dev
```

---
*Created and verified on ssri-portal architecture framework.*
