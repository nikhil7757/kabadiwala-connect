import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT_DIR, 'qa', 'before');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const VIEWPORTS = [320, 360, 390, 768, 1024, 1280, 1440, 1920];
const BASE_URL = process.env.TEST_URL || 'https://kabadiwala-connect-henna.vercel.app';

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'rates', path: '/rates' },
  { name: 'calculator', path: '/calculator' },
  { name: 'schedule', path: '/schedule' },
  { name: 'track', path: '/track' },
  { name: 'collectors', path: '/collectors' },
  { name: 'dashboard-user', path: '/dashboard/user' },
];

async function run() {
  console.log('🚀 Launching Chromium/Edge for Phase 0 Baseline Audit...');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const launchOptions = {
    headless: true,
  };
  if (fs.existsSync(edgePath)) {
    launchOptions.executablePath = edgePath;
  }

  const browser = await chromium.launch(launchOptions);

  const auditFindings = [];

  for (const pageInfo of PAGES) {
    console.log(`\n📄 Auditing page: ${pageInfo.name} (${pageInfo.path})`);
    for (const width of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      try {
        await page.goto(`${BASE_URL}${pageInfo.path}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(1000); // Allow animations & fonts to settle

        const fileName = `${pageInfo.name}_${width}px.png`;
        const filePath = path.join(OUT_DIR, fileName);

        // Take full-page screenshot
        await page.screenshot({ path: filePath, fullPage: true });
        console.log(`   📸 Screenshot: ${fileName}`);

        // Evaluate layout metrics & defects
        const metrics = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const innerWidth = window.innerWidth;
          const hasHorizontalOverflow = scrollWidth > innerWidth + 1;

          // Check viewport meta
          const viewportMeta = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
          const blocksZoom = viewportMeta.includes('maximum-scale=1') || viewportMeta.includes('user-scalable=no');

          // Check elements with data-qa-check or key interactive elements for overlaps
          const checkElements = Array.from(document.querySelectorAll('[data-qa-check], header, nav, footer, button, a, img, svg, h1, h2, h3'));
          const overlaps = [];

          for (let i = 0; i < checkElements.length; i++) {
            const elA = checkElements[i];
            const rectA = elA.getBoundingClientRect();
            if (rectA.width === 0 || rectA.height === 0 || elA.offsetParent === null) continue;

            for (let j = i + 1; j < checkElements.length; j++) {
              const elB = checkElements[j];
              // Skip if one contains the other
              if (elA.contains(elB) || elB.contains(elA)) continue;

              const rectB = elB.getBoundingClientRect();
              if (rectB.width === 0 || rectB.height === 0 || elB.offsetParent === null) continue;

              // Collision check
              const xOverlap = Math.max(0, Math.min(rectA.right, rectB.right) - Math.max(rectA.left, rectB.left));
              const yOverlap = Math.max(0, Math.min(rectA.bottom, rectB.bottom) - Math.max(rectA.top, rectB.top));

              // If substantial overlap (> 10px area) and both visible
              if (xOverlap > 10 && yOverlap > 10) {
                const qaA = elA.getAttribute('data-qa-check') || elA.tagName.toLowerCase();
                const qaB = elB.getAttribute('data-qa-check') || elB.tagName.toLowerCase();
                const clsA = typeof elA.className === 'string' ? elA.className : (elA.className?.baseVal || '');
                const clsB = typeof elB.className === 'string' ? elB.className : (elB.className?.baseVal || '');
                overlaps.push({
                  elemA: `${qaA} (${clsA.substring(0, 30)}...)`,
                  elemB: `${qaB} (${clsB.substring(0, 30)}...)`,
                  overlapArea: `${Math.round(xOverlap)}x${Math.round(yOverlap)}px`,
                });
              }
            }
          }

          // Check tap target sizes on mobile (<768px)
          const smallTargets = [];
          if (innerWidth < 768) {
            const tapables = Array.from(document.querySelectorAll('button, a, input, select'));
            for (const t of tapables) {
              const r = t.getBoundingClientRect();
              if (r.width > 0 && r.height > 0 && (r.width < 40 || r.height < 40)) {
                smallTargets.push({
                  tag: t.tagName.toLowerCase(),
                  text: (t.innerText || t.getAttribute('aria-label') || '').slice(0, 20),
                  size: `${Math.round(r.width)}x${Math.round(r.height)}px`,
                });
              }
            }
          }

          return {
            scrollWidth,
            innerWidth,
            hasHorizontalOverflow,
            overflowDiff: scrollWidth - innerWidth,
            blocksZoom,
            viewportMeta,
            overlapsCount: overlaps.length,
            overlaps: overlaps.slice(0, 5),
            smallTargetsCount: smallTargets.length,
            smallTargets: smallTargets.slice(0, 5),
          };
        });

        auditFindings.push({
          page: pageInfo.name,
          url: pageInfo.path,
          width,
          screenshot: fileName,
          ...metrics,
        });
      } catch (err) {
        console.error(`   ❌ Failed on ${pageInfo.name} @ ${width}px:`, err.message);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();

  // Write raw audit data to json
  fs.writeFileSync(path.join(ROOT_DIR, 'qa', 'audit_raw.json'), JSON.stringify(auditFindings, null, 2));
  console.log('\n✅ Phase 0 Baseline Screenshots & Metrics captured in /qa/before/!');
}

run().catch((err) => {
  console.error('Fatal error running audit:', err);
  process.exit(1);
});
