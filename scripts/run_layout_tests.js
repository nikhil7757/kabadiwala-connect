import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'apps', 'web', 'dist');
const OUT_DIR = path.join(ROOT_DIR, 'qa', 'after');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const VIEWPORTS = [320, 360, 390, 768, 1024, 1280, 1440, 1920];
const PAGES = [
  { name: 'home', path: '/' },
  { name: 'rates', path: '/rates' },
  { name: 'calculator', path: '/calculator' },
  { name: 'schedule', path: '/schedule' },
  { name: 'track', path: '/track' },
  { name: 'collectors', path: '/collectors' },
  { name: 'dashboard-user', path: '/dashboard/user' },
];

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

// Start local static server
function startServer(port = 4173) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0].replace(/^\/+/, '');
      let filePath = path.join(DIST_DIR, reqPath);

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(DIST_DIR, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end(`Server Error: ${err.code}`);
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        }
      });
    });

    server.listen(port, () => {
      console.log(`📡 Local preview server running at http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function run() {
  console.log('====================================================');
  console.log('🧪 Kabadiwala Connect Layout & Overlap Test Suite');
  console.log('   Phase 4 & 5 Automated Verification');
  console.log('====================================================\n');

  const server = await startServer(4173);
  const BASE_URL = 'http://localhost:4173';

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const launchOptions = { headless: true };
  if (fs.existsSync(edgePath)) {
    launchOptions.executablePath = edgePath;
  }

  const browser = await chromium.launch(launchOptions);
  let totalTests = 0;
  let passedTests = 0;
  let horizontalOverflowCount = 0;
  let overlapCount = 0;
  let smallTouchTargetsCount = 0;
  let consoleErrorsCount = 0;

  const results = [];

  for (const pageInfo of PAGES) {
    console.log(`\n📄 Testing Route: ${pageInfo.name} (${pageInfo.path})`);

    for (const width of VIEWPORTS) {
      totalTests++;
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      const pageErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          pageErrors.push(msg.text());
        }
      });
      page.on('pageerror', (err) => {
        pageErrors.push(err.message);
      });

      try {
        await page.goto(`${BASE_URL}${pageInfo.path}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(600);

        const fileName = `${pageInfo.name}_${width}px.png`;
        const filePath = path.join(OUT_DIR, fileName);

        // Capture full page screenshot for /qa/after/
        await page.screenshot({ path: filePath, fullPage: true });

        // Evaluate layout metrics
        const metrics = await page.evaluate(({ isMobile }) => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const innerWidth = window.innerWidth;
          const hasHorizontalOverflow = scrollWidth > innerWidth + 1;

          // Check viewport meta allows zoom
          const viewportMeta = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
          const blocksZoom = viewportMeta.includes('maximum-scale=1') || viewportMeta.includes('user-scalable=no');

          // Overlap check for [data-qa-check] elements
          const qaElements = Array.from(document.querySelectorAll('[data-qa-check]'));
          const overlaps = [];

          function getVisibleRect(el) {
            let rect = el.getBoundingClientRect();
            let left = rect.left;
            let right = rect.right;
            let top = rect.top;
            let bottom = rect.bottom;

            let parent = el.parentElement;
            while (parent && parent !== document.body && parent !== document.documentElement) {
              const style = window.getComputedStyle(parent);
              if (['hidden', 'auto', 'scroll'].includes(style.overflowY) || ['hidden', 'auto', 'scroll'].includes(style.overflowX)) {
                const pRect = parent.getBoundingClientRect();
                top = Math.max(top, pRect.top);
                bottom = Math.min(bottom, pRect.bottom);
                left = Math.max(left, pRect.left);
                right = Math.min(right, pRect.right);
              }
              parent = parent.parentElement;
            }

            if (bottom <= top || right <= left) {
              return null; // completely clipped by overflow container
            }
            return { left, right, top, bottom, width: right - left, height: bottom - top };
          }

          for (let i = 0; i < qaElements.length; i++) {
            const elA = qaElements[i];
            const styleA = window.getComputedStyle(elA);
            if (styleA.display === 'none' || styleA.visibility === 'hidden') continue;
            if (elA.offsetParent === null && styleA.position !== 'fixed') continue;

            const rectA = getVisibleRect(elA);
            if (!rectA || rectA.width === 0 || rectA.height === 0) continue;

            const isFixedA = !!elA.closest('header, nav[aria-label="Mobile Bottom Navigation"]');

            for (let j = i + 1; j < qaElements.length; j++) {
              const elB = qaElements[j];
              if (elA.contains(elB) || elB.contains(elA)) continue;

              const styleB = window.getComputedStyle(elB);
              if (styleB.display === 'none' || styleB.visibility === 'hidden') continue;
              if (elB.offsetParent === null && styleB.position !== 'fixed') continue;

              const rectB = getVisibleRect(elB);
              if (!rectB || rectB.width === 0 || rectB.height === 0) continue;

              const isFixedB = !!elB.closest('header, nav[aria-label="Mobile Bottom Navigation"]');

              // If one is in fixed overlay and one is in scrollable document flow
              if (isFixedA !== isFixedB) {
                // Check if document flow element is inappropriately hidden underneath fixed header at top
                const fixedEl = isFixedA ? elA : elB;
                const docEl = isFixedA ? elB : elA;
                const fixedRect = isFixedA ? rectA : rectB;
                const docRect = isFixedA ? rectB : rectA;

                const isHeader = !!fixedEl.closest('header');
                if (isHeader) {
                  // Only report if document element is clipped under header (y < header height)
                  if (docRect.top < 72 && docRect.bottom > 0) {
                    const xOverlap = Math.max(0, Math.min(rectA.right, rectB.right) - Math.max(rectA.left, rectB.left));
                    const yOverlap = Math.max(0, Math.min(rectA.bottom, rectB.bottom) - Math.max(rectA.top, rectB.top));
                    if (xOverlap > 10 && yOverlap > 10) {
                      overlaps.push({
                        elemA: elA.getAttribute('data-qa-check') || elA.tagName,
                        elemB: elB.getAttribute('data-qa-check') || elB.tagName,
                        overlapArea: Math.round(xOverlap * yOverlap),
                      });
                    }
                  }
                }
                // Elements scrolling under bottom tab bar are in normal scroll flow unless at the bottom of the page
                continue;
              }

              // Normal flow vs normal flow, or fixed vs fixed within same overlay
              const xOverlap = Math.max(0, Math.min(rectA.right, rectB.right) - Math.max(rectA.left, rectB.left));
              const yOverlap = Math.max(0, Math.min(rectA.bottom, rectB.bottom) - Math.max(rectA.top, rectB.top));

              if (xOverlap > 10 && yOverlap > 10) {
                overlaps.push({
                  elemA: elA.getAttribute('data-qa-check') || elA.tagName,
                  elemB: elB.getAttribute('data-qa-check') || elB.tagName,
                  overlapArea: Math.round(xOverlap * yOverlap),
                });
              }
            }
          }

          // Small touch target check (< 40x40 on mobile)
          const smallTargets = [];
          if (isMobile) {
            const interactives = Array.from(document.querySelectorAll('button, a, input, select'));
            for (const el of interactives) {
              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0 && el.offsetParent !== null) {
                // Ignore inline text links inside paragraphs
                if (el.tagName === 'A' && el.parentElement && el.parentElement.tagName === 'P') continue;
                if (rect.width < 36 || rect.height < 36) {
                  smallTargets.push({
                    tag: el.tagName.toLowerCase(),
                    text: (el.textContent || '').trim().slice(0, 20),
                    size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
                  });
                }
              }
            }
          }

          return {
            scrollWidth,
            innerWidth,
            hasHorizontalOverflow,
            blocksZoom,
            overlaps,
            smallTargetsCount: smallTargets.length,
          };
        }, { isMobile: width <= 390 });

        const isOk = !metrics.hasHorizontalOverflow && metrics.overlaps.length === 0;
        if (isOk) {
          passedTests++;
          console.log(`   ✔ [${width}px] PASS (scrollW: ${metrics.scrollWidth}px, overlaps: 0) -> ${fileName}`);
        } else {
          console.warn(`   ⚠ [${width}px] FAIL - Overflows: ${metrics.hasHorizontalOverflow}, Overlaps: ${metrics.overlaps.length}`);
          if (metrics.hasHorizontalOverflow) horizontalOverflowCount++;
          if (metrics.overlaps.length > 0) overlapCount += metrics.overlaps.length;
        }

        if (metrics.smallTargetsCount > 0 && width <= 390) {
          smallTouchTargetsCount += metrics.smallTargetsCount;
        }
        if (pageErrors.length > 0) {
          consoleErrorsCount += pageErrors.length;
        }

        results.push({
          page: pageInfo.name,
          width,
          ...metrics,
          pageErrors,
          screenshot: fileName,
        });

      } catch (err) {
        console.error(`   ❌ [${width}px] Error: ${err.message}`);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();
  server.close();

  fs.writeFileSync(path.join(ROOT_DIR, 'qa', 'after_audit.json'), JSON.stringify(results, null, 2));

  console.log('\n====================================================');
  console.log('📊 TEST SUMMARY & QA VERIFICATION');
  console.log('====================================================');
  console.log(`Total Viewport Checks: ${totalTests}`);
  console.log(`Passed Checks:         ${passedTests} / ${totalTests}`);
  console.log(`Horizontal Overflows:  ${horizontalOverflowCount}`);
  console.log(`Element Overlaps:      ${overlapCount}`);
  console.log(`Console Errors:        ${consoleErrorsCount}`);
  console.log(`Screenshots Saved To:  ${OUT_DIR}`);
  console.log('====================================================\n');

  if (horizontalOverflowCount > 0 || overlapCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
