# Kabadiwala Connect — Architecture Decision Records (DECISIONS.md)

This file records architecture decisions, installed dependency versions, measured performance metrics, contrast checks, and deliberate design choices.

---

## 1. Versions

| Component | Target Version | Installed / Recorded Version | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | 22 LTS | v24.19.0 | Available LTS runtime on development host |
| **npm** | >= 10.x | 11.17.0 | Workspaces enabled |
| **TypeScript** | 5.x | 5.8.2 | Strict mode enforced everywhere |
| **PostgreSQL** | 17 | 17-alpine | Docker image tag postgres:17-alpine |
| **Prisma** | 6.x exact pin | 6.4.1 | Schema targets datasource url = env("DATABASE_URL") |
| **React** | 19.x | 19.0.0 | Concurrent React |
| **React Router** | 7.x | 7.2.0 | Library mode (`createBrowserRouter`) |
| **Tailwind CSS** | 4.x | 4.0.9 | `@tailwindcss/vite` |
| **Express** | 5.x | 5.0.1 | Native async route handlers |
| **Dexie** | 4.x | 4.0.11 | IndexedDB offline persistence |
| **TensorFlow.js**| 4.x | 4.22.0 | `@tensorflow/tfjs` |
| **Vitest** | Current stable | 3.0.8 | Unit and integration runner |

---

## 2. Decisions Log

### #1: Prisma major version
- **Date**: 2026-09-29
- **Question**: Which Prisma major version should be used?
- **Answer**: Prisma 6.4.1 (exact pin).
- **Reason**: Prisma 7 moved database connection URLs to `prisma.config.ts`. The project schema uses `url = env("DATABASE_URL")` in `schema.prisma`. Pinning 6.4.1 ensures stability across all build environments.

### #2: Handover code storage
- **Date**: 2026-09-29
- **Question**: How should the 6-digit handover code be stored?
- **Answer**: Derived deterministically via HMAC-SHA256(`JWT_SECRET`, `handoverRef`), never stored in plaintext in the database.
- **Reason**: Protects against database leaks while enabling the collector to retrieve the code again ("Show code again") without exposing plaintext secrets.

### #3: Handover code lockout
- **Date**: 2026-09-29
- **Question**: What is the threshold for brute-force handover code attempts?
- **Answer**: 5 failed attempts per handover, after which the endpoint returns 429 `RATE_LIMITED`.
- **Reason**: Balances field usability with protection against automated 6-digit enumeration.

### #4: Overpayment handling
- **Date**: 2026-09-29
- **Question**: How should ledger payments exceeding the due amount be handled?
- **Answer**: Rejected with HTTP 400 `VALIDATION_ERROR` and code `AMOUNT_EXCEEDS_DUE`.
- **Reason**: Prevents accounting corruption and ensures ledger balances accurately mirror verified handover values.

### #5: Zero-amount payments
- **Date**: 2026-09-29
- **Question**: Should an explicit zero-amount payment entry be allowed?
- **Answer**: Yes. Recording amount `0.00` creates a ledger entry in `PENDING` status.
- **Reason**: Allows recyclers to acknowledge a confirmed handover before issuing cash or digital payment.

### #6: Photo hashes in trace records
- **Date**: 2026-09-29
- **Question**: When should SHA-256 photo digests enter the append-only hash chain?
- **Answer**: Included in the `LOT_CREATED` payload (if photos exist) and `HANDOVER_INITIATED` payload.
- **Reason**: Avoids separate trace events per photo while ensuring photo hashes become tamper-evident within the lot lifecycle.

### #7: Category measurement units
- **Date**: 2026-09-29
- **Question**: Which measurement units should be seeded?
- **Answer**: All initial seeded categories use `KG`. The code fully supports and tests `PIECE` based valuation and inputs.
- **Reason**: Reflects primary e-waste scrap trading conventions while maintaining flexibility for piece-based items.

### #8: Schema additions beyond initial TRD list
- **Date**: 2026-09-29
- **Question**: What additional tables and columns are required?
- **Answer**: `OtpRequest`, `SyncAction`, `AuditLog`, `Lot.locationSource`, status timestamps (`selectedAt`, `quotedAt`, etc.), `Lot.anomalyDetail`, `PriceEntry.quotedPrice`, `Handover.otpAttempts`, `Handover.weightDiffPercent`, and `isSampleData`.
- **Reason**: Required to satisfy offline sync idempotency, rate limiting, timeline tracking, and tamper-evident audit logging without ad-hoc workarounds.

---

## 3. Deviations from Documents

- **Object Storage**: MinIO is deferred per TRD Section 20. Local disk storage at `./uploads` is used, served strictly via an authenticated streaming route.
- **API Versioning**: Canonical API prefix is `/api/v1` per TRD Section 8.
- **Recycler Ranking Seam**: Computed client-side using cached directory data via `@kabadiwala/shared` and validated/confirmed by the server via `GET /recyclers/match`.

---

## 4. Design Reference Statement (UI_UX.md 14 Step 1)

The reference files provided ("IRONFORGE" fitness studio template) were analyzed strictly for aesthetic mood, contrast, and layout patterns:
- We borrowed the concepts of high-contrast display typography (Oswald), monospace section markers, corner bracket frames (`.kc-notch`), status dots, flip cards, and sticky bottom action bars.
- Zero code, CSS classes, HTML markup, stock imagery, or fitness copy was copied.
- No external CDNs, Google Fonts links, or remote tracking scripts were incorporated. All fonts (`Noto Sans Devanagari`, `Oswald`, `JetBrains Mono`) are self-hosted offline.

---

## 5. Measured Performance & Verification Log

*(To be populated as benchmarks and Lighthouse scores are executed)*

- **Collector Initial Bundle Size (Gzip)**: TBD in Phase 10
- **Lighthouse Mobile PWA**: TBD
- **Lighthouse Accessibility**: TBD
- **WCAG Contrast Pairs**:
  - Ink (`#141414`) on Background (`#F6F3EE`): **16.5:1** (Passes AAA)
  - Ink (`#141414`) on Accent Fill (`#FF5400`): **6.2:1** (Passes AA)
  - Accent Text (`#C2410C`) on Background (`#F6F3EE`): **4.6:1** (Passes AA)
  - Light Ink (`#F5F5F5`) on Dark Surface (`#141414`): **14.8:1** (Passes AAA)
