#!/usr/bin/env node

/**
 * build.js — Resilient Production Build Pipeline for Kabadiwala Connect
 *
 * Adheres to AGENTS.md Deployment Build Resilience Guidelines & Ponytail Principle:
 * 1. Zero-Dependency Static Packaging.
 * 2. Uses portable standard library Node (fs, child_process, path).
 * 3. Never lets silent build failures mask UI updates — strictly verifies output integrity.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const startTime = Date.now();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = __dirname;
const WEB_DIR = path.join(ROOT_DIR, 'apps', 'web');
const DIST_DIR = path.join(WEB_DIR, 'dist');
const PRISMA_SCHEMA = path.join(ROOT_DIR, 'server', 'prisma', 'schema.prisma');

console.log('====================================================');
console.log('📦 Kabadiwala Connect Production Build Pipeline');
console.log('   Target: Vercel / Monorepo Static Hosting');
console.log('====================================================\n');

// 1. Prisma Client Generation
console.log('==> [1/3] Generating Prisma Client...');
if (fs.existsSync(PRISMA_SCHEMA)) {
  try {
    const prismaCmd = `npx --yes prisma generate --schema="${PRISMA_SCHEMA}"`;
    execSync(prismaCmd, { stdio: 'inherit', cwd: ROOT_DIR, shell: true });
    console.log('    ✔ Prisma Client generated successfully.\n');
  } catch (err) {
    console.warn('    ⚠ Prisma generation warning (will continue build):', err.message);
  }
} else {
  console.log('    Prisma schema not found at:', PRISMA_SCHEMA);
}

// 2. Build Shared Package
console.log('==> [2/3] Building @kabadiwala/shared...');
try {
  execSync('npm run build --workspace=packages/shared', { stdio: 'inherit', cwd: ROOT_DIR, shell: true });
  console.log('    ✔ Shared package compiled.\n');
} catch (err) {
  console.error('    ❌ Error building shared package:', err);
  process.exit(1);
}

// 3. Build Web App (Vite + React)
console.log('==> [3/3] Building Web Application (@kabadiwala/web)...');
try {
  execSync('npm run build --workspace=apps/web', { stdio: 'inherit', cwd: ROOT_DIR, shell: true });
  console.log('    ✔ Web app compiled.\n');
} catch (err) {
  console.error('    ❌ Error building web app:', err);
  process.exit(1);
}

// 4. Verification of output
const indexHtml = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(indexHtml)) {
  console.error('    ❌ Build verification failed: apps/web/dist/index.html is missing!');
  process.exit(1);
}

const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(2);
console.log('====================================================');
console.log(`✅ Build completed and verified in ${elapsedSec}s!`);
console.log(`   Output Directory: ${DIST_DIR}`);
console.log('====================================================');
