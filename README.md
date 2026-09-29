# Kabadiwala Connect (कबाड़ीवाला कनेक्ट)

> **Smart India Hackathon 2026** | **Problem Statement SIH26229**  
> **Ministry of Mines / JNARDDC** | Theme: Clean & Green Technology | Category: Software  
> **Title**: *Bringing the Informal Collector into the Formal Recycling Chain*

---

## 1. Overview

Kabadiwala Connect bridges India's informal e-waste collectors (kabadiwalas, waste-pickers, local aggregators) into the formal recycling ecosystem under the **E-Waste (Management) Rules, 2022**. It provides an offline-first, vernacular (Hindi, Marathi, English) PWA designed for budget Android devices with 3-tap price discovery, on-device classification, digital verifiable handover, transparent payment ledgers, and tamper-evident hash-chain audit trails.

---

## 2. Sample Demo Accounts (SAMPLE DATA)

All seeded records are strictly **SAMPLE DATA** for demonstration:

| Role | Login Identifier | Access Code / Password |
| :--- | :--- | :--- |
| **Collector (Hindi)** | `9000000001` | Code: `123456` (in `DEMO_MODE=true`) |
| **Collector (Marathi)** | `9000000002` | Code: `123456` (in `DEMO_MODE=true`) |
| **Recycler (Verified)** | `pune-1@sample.kc` | `Demo@1234` |
| **Recycler (Suspended)**| `thane-2@sample.kc` | `Demo@1234` |
| **Admin Verifier** | `admin@sample.kc` | `Demo@1234` |

---

## 3. Quick Start (Local Development)

### Prerequisites
- Node.js 22 LTS or newer (tested on Node.js 24)
- Docker Engine & Docker Compose (or an active PostgreSQL 17 instance)

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/nikhil7757/kabadiwala-connect.git
cd kabadiwala-connect

# 2. Start PostgreSQL 17 database
docker compose up -d db

# 3. Install dependencies
npm install

# 4. Migrate database schema and seed sample datasets
npm run db:migrate
npm run db:seed

# 5. Start development servers (API on port 4000, Web on port 5173)
npm run dev
```

- **Collector Web App**: https://kabadiwala-connect-henna.vercel.app/welcome
- **Component Catalog**: [http://localhost:5173/dev/ui-kit](http://localhost:5173/dev/ui-kit)
- **API Health Check**: [http://localhost:4000/api/v1/health](http://localhost:4000/api/v1/health)

---

## 4. Mobile Hardware Testing & HTTPS Requirement

Mobile Chrome strictly restricts access to hardware APIs (`navigator.mediaDevices` for camera photo uploads, `navigator.geolocation` for GPS coordinates, and `window.crypto.subtle` for offline SHA-256 digests) to **secure contexts (HTTPS)**:

- **Localhost**: Exempt when accessed directly on the machine.
- **Android Phone Rehearsal**: To test on an Android phone over Wi-Fi, run a local HTTPS tunnel (e.g. Cloudflare Tunnel, ngrok, or mkcert local SSL):
  ```bash
  # Example via Cloudflare tunnel
  cloudflared tunnel --url http://localhost:5173
  ```

---

## 5. Deployment

### Vercel Deployment
This repository includes a zero-dependency static packaging pipeline (`build.js`) and `vercel.json` configured for single-command deployment:

```bash
vercel deploy --prod
```

---

## 6. Monorepo Workspaces Structure

```text
├── packages/shared/     # Pure TypeScript algorithms: matching, valuation, anomaly, hash chain
├── server/              # Express 5 REST API (/api/v1), Prisma 6 ORM, PostgreSQL 17
├── apps/web/            # Vite + React 19 PWA, Tailwind CSS 4, Dexie IndexedDB
├── data/seed/           # Canonical seed data: 8 categories, 8 recyclers, prices, safety tips
└── docs/                # Field research interview guides, notes, and unit economics models
```
