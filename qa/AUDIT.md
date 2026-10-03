# Comprehensive Layout, Collision & QA Audit

**Application:** Kabadiwala Connect  
**Live URL:** https://kabadiwala-connect-henna.vercel.app/  
**Audit Date:** October 2026  
**Audited Viewports:** 320px, 360px, 390px, 768px, 1024px, 1280px, 1440px, 1920px  
**Baseline Screenshots Stored:** `/qa/before/` (56 full-page captures across 7 primary pages)

---

## 1. Executive Summary

A comprehensive automated and visual audit across 56 viewport-route configurations revealed systematic layout, bounding-box collision, and accessibility issues. While the visual theme (noir `#0A0B0A` with lime `#A3E635` accents) is established, structural flow has been compromised by ad-hoc absolute positioning, lack of a centralized container system, mobile viewport constraints that block user zoom, and header element crowding below 390px.

---

## 2. Key Audit Findings & Defect Taxonomy

### 2.1 Viewport Meta & Zoom Restriction
- **Affected Files:** `apps/web/index.html`
- **Symptom:** Viewport meta tag explicitly blocks pinch-to-zoom: `maximum-scale=1.0, user-scalable=no`.
- **Viewports:** All mobile viewports (320px, 360px, 390px).
- **Screenshots:** All mobile screenshots in `/qa/before/`.
- **Root Cause:** Hardcoded `maximum-scale=1.0, user-scalable=no` violates WCAG 1.4.4 (Resize text).
- **Remediation Plan:** Change to `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.

---

### 2.2 Header Collision & Crowding at 320px–360px
- **Affected Files:** `apps/web/src/components/layout/Navbar.tsx`
- **Symptom:** On 320px and 360px viewports, Zone 3 actions (Language toggle, Theme toggle, Notification bell, CTA) collide with the Brand Logo or wrap onto second lines, causing vertical jumping and overlapping bounding boxes.
- **Viewports:** 320px, 360px.
- **Screenshots:** `home_320px.png`, `rates_320px.png`, `calculator_320px.png`.
- **Root Cause:** Zone 3 has multiple adjacent buttons (`min-w-[44px]`) without responsive collapsing for narrow mobile viewports. On viewports < 390px, only the Logo, Language Toggle, and Hamburger Menu trigger should be displayed in the top bar. All secondary utilities (Search, Notification drawer, Theme toggle, Auth link) must reside neatly inside the full-screen slide-over drawer.
- **Remediation Plan:** Implement strict 3-zone flex layout (`logo | nav | actions`) with `justify-between`, `gap-4`, and `min-w-0`. On mobile < 640px, condense Zone 3 into Language Switcher + Hamburger trigger, moving secondary controls into the slide-over mobile drawer.

---

### 2.3 Tap Targets Below 44px on Mobile
- **Affected Files:** `Navbar.tsx`, `HeroReel.tsx`, `RateTicker.tsx`, `Rates.tsx`
- **Symptom:** Over 100 interactive buttons, chips, and links on mobile screens measure between `13x21px` and `38x28px`.
- **Viewports:** 320px, 360px, 390px.
- **Screenshots:** `home_320px.png`, `rates_360px.png`, `calculator_390px.png`.
- **Root Cause:** Inline utility links and small badges lack `min-h-[44px]` and `min-w-[44px]` touch target sizing.
- **Remediation Plan:** Enforce `min-h-[44px]` and `min-w-[44px]` on all mobile touch elements using standard flex centering.

---

### 2.4 Lack of Standardized `<Container>` Component
- **Affected Files:** `apps/web/src/pages/Home.tsx`, `ScrapRates.tsx`, `Calculator.tsx`, `SchedulePickup.tsx`, `TrackPickup.tsx`, `FindCollectors.tsx`, `UserDashboard.tsx`
- **Symptom:** Inconsistent page margins, uneven gutters, and content touching viewport edges on smaller tablets (640px–768px).
- **Viewports:** All viewports.
- **Screenshots:** `home_768px.png`, `rates_1024px.png`, `track_768px.png`.
- **Root Cause:** Every page and section independently re-implements wrapper divs with different classes (`max-w-7xl mx-auto px-4`, `max-w-6xl`, etc.).
- **Remediation Plan:** Create a canonical `<Container>` component with `max-width: 1280px`, centered, padding `16px` mobile / `24px` tablet / `32px` desktop. All sections will wrap their content inside `<Container>`.

---

### 2.5 Inconsistent Z-Index & Stacking Context
- **Affected Files:** `apps/web/src/index.css`, `Navbar.tsx`, `FilmGrain.tsx`, `StickyCtaBar.tsx`, `CoinDropModal.tsx`
- **Symptom:** Film grain or modal backdrops occasionally clip or intercept clicks on interactive dropdowns.
- **Viewports:** All viewports.
- **Root Cause:** Ad-hoc z-index values (`z-[30]`, `z-[40]`, `z-[50]`, `z-9999`) scattered across various Tailwind classes.
- **Remediation Plan:** Centralize strict Z-Index scale tokens:
  - Base: `0`
  - Content: `10`
  - Sticky elements: `20`
  - Header: `30`
  - Dropdowns & Popovers: `40`
  - Modals & Drawers: `50`
  - Toasts & Overlays: `60`
  - FilmGrain: `pointer-events: none` at z-base.

---

### 2.6 Fixed Header & Bottom Nav Occlusion
- **Affected Files:** `apps/web/src/components/layout/Layout.tsx`, `apps/web/src/components/layout/BottomNav.tsx`
- **Symptom:** On mobile, content at the very bottom of pages is hidden behind the fixed bottom tab bar or sticky CTA bar. Top section headings can clip beneath the fixed header when navigated to via hash anchors.
- **Viewports:** 320px, 360px, 390px, 768px.
- **Screenshots:** `schedule_360px.png`, `track_390px.png`.
- **Root Cause:** Hardcoded padding values in `Layout.tsx` instead of dynamic CSS variables `--header-h` and `--bottom-nav-h` with safe-area insets.
- **Remediation Plan:** Define `--header-h: 72px` and `--bottom-nav-h: 64px` in `:root`. In `Layout.tsx`, apply `padding-top: var(--header-h)` and `padding-bottom: calc(var(--bottom-nav-h) + env(safe-area-inset-bottom, 16px))` for mobile.

---

### 2.7 Avatar Stack & Collector Card Layouts
- **Affected Files:** `apps/web/src/components/common/StatsStrip.tsx`, `apps/web/src/components/common/CollectorFlipCard.tsx`
- **Symptom:** Collector avatars use raw negative margins (`-space-x-3`) without proper container wrappers or overflow masks, causing occasional overlapping collisions.
- **Viewports:** 320px, 768px, 1024px.
- **Screenshots:** `home_320px.png`, `collectors_768px.png`.
- **Root Cause:** Lack of a dedicated `<AvatarStack>` component with fixed square sizes, ring borders, and a capped `+N` indicator.
- **Remediation Plan:** Implement `<AvatarStack>` adhering to Phase 2 specifications (fixed square sizes, rounded, object-cover, ring border, capped at 4 visible).

---

### 2.8 Partner & Recycler Logo Strips / Marquees
- **Affected Files:** `apps/web/src/pages/Home.tsx` (Logo marquee)
- **Symptom:** Marquee track items can overlap or jitter during CSS infinite animation when width isn't constrained to `max-content`.
- **Viewports:** All viewports.
- **Screenshots:** `home_1280px.png`, `home_1440px.png`.
- **Root Cause:** Marquee items use variable widths without fixed cell sizes.
- **Remediation Plan:** Implement uniform 140x64px logo cells with `object-contain`, centered, with 24px minimum gap on a flex track with `width: max-content`.

---

## 3. Detailed Audit Matrix by Page & Viewport

| Page | Viewport | Screenshot Reference | Component / File | Primary Defect | Root Cause |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **All** | 320px–390px | `*_320px.png`, `*_360px.png` | `apps/web/index.html` | Zoom disabled | `user-scalable=no, maximum-scale=1.0` in viewport meta |
| **All** | 320px | `*_320px.png` | `Navbar.tsx` | Zone 3 button collisions (27 collisions) | Too many actions in header without mobile drawer collapse |
| **All** | 320px–390px | `*_320px.png`, `*_360px.png` | `Navbar.tsx`, `Home.tsx` | Tap targets < 44px (104 items) | Sub-40px links, chips, and utility triggers |
| **Home** | 320px–768px | `home_320px.png`, `home_768px.png` | `HeroReel.tsx` | Hero text/visual collision | Desktop-first columns with unconstrained heights |
| **Home** | 768px–1024px| `home_768px.png` | `StatsStrip.tsx` | Stats grid wrapping awkwardly | Lack of strict 2x2 mobile / 4-column desktop layout |
| **Rates** | 320px–768px | `rates_320px.png`, `rates_360px.png`| `ScrapRates.tsx` | Table horizontal squeeze | Raw table element rather than responsive mobile cards |
| **Schedule**| 320px–390px | `schedule_320px.png` | `SchedulePickup.tsx` | Step cards clipped under sticky bar | Missing `--bottom-nav-h` padding at bottom |
| **Track** | 320px–390px | `track_320px.png` | `TrackPickup.tsx` | Timeline connector line overlaps text | Absolute positioning on step indicators without flex offsets |
| **Collectors**| 320px–1024px| `collectors_768px.png` | `FindCollectors.tsx` | Card badges overlap collector names | Absolute badges without corner-badge slot safe insets |
| **Dashboard**| 320px–768px | `dashboard-user_360px.png` | `UserDashboard.tsx` | Stat cards overflow container | Missing `min-w-0` on card children in grid |

---

## 4. Phase 1–5 Action Plan & Verification

1. **Phase 1: Foundation Layout System**
   - Update viewport meta to remove zoom restrictions.
   - Standardize global CSS reset with `overflow-x: clip`, `box-sizing: border-box`, and fluid typography.
   - Create canonical `<Container>` component.
   - Set up CSS variables for `--header-h`, `--bottom-nav-h`, and spacing tokens (4/8/12/16/24/32/48/64/96px).

2. **Phase 2: Logos, Icons, Images & Avatars**
   - Create unified `<Icon>` component wrapping Lucide icons with fixed sizes (16/20/24px) and `shrink-0`.
   - Update `<Logo>` with fixed props (sm 28px, md 36px, lg 48px).
   - Create `<AvatarStack>` component.
   - Refactor `Navbar.tsx` into strict 3-zone layout with mobile drawer.

3. **Phase 3: Section-by-Section Rebuild**
   - Hero, Stats, How it works, Scrap rates, Collectors, Formal chain, Impact, FAQ, and Footer rebuilt on grid/flex.

4. **Phase 4 & 5: Automated Playwright Tests & Fix Loop**
   - Implement `npm run test:layout` testing horizontal overflow, bounding-box collision detection on `[data-qa-check]`, tap target sizes >= 40px, and console errors across all 8 viewports.
   - Capture comparison screenshots to `/qa/after/`.
