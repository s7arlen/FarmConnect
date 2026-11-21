# FarmConnect — Master Development Checklist & Project Tracking

**Project:** FarmConnect — App-Like Agricultural Marketplace Web Application  
**Target Platform:** Single Unified Next.js 14 Web Application (Mobile Browser, Desktop, Tablet, PWA)  
**Current Status:** All Transformation Phases Implemented, Compiled & Verified  

---

## Status Legend
- `[ ] Not Started` — Work has not begun.
- `[~] In Progress` — Currently actively being built or audited.
- `[?] Blocked / Needs Validation` — Dependent on field research or external credentials.
- `[*] Tested & Completed` — Verified and working end-to-end.

---

## 1. Research and Requirements
- [?] Agriculture authority interview *(APMC baseline context)*
- [?] Farmer interviews *(Mandya & coastal Karnataka cluster)*
- [?] Consumer interviews *(Urban direct procurement)*
- [?] Bulk buyer interviews *(Restaurants, hotels, hostel messes)*
- [*] Validate agricultural selling problems *(Documented in docs/srs.md Section 1.3)*
- [*] Understand local agricultural marketing systems *(Documented in docs/srs.md)*
- [*] Identify existing government platforms and initiatives *(e-NAM, APMC Mandis)*
- [*] Finalise project requirements *(Completed in docs/srs.md Section 3)*
- [*] Complete SRS documentation *(FC-SRS-2026-V1.0 in docs/srs.md)*

---

## 2. Frontend and App-Like UI
- [*] GoParm design system palette tokens (`#4D8B38`, `#28552B`, `#E8F4D9`, `#F7F9F2`, `#202A20`)
- [*] Mobile app-like full-screen layout & safe-area insets (`pb-safe`, `pt-safe`, `viewportFit: cover`)
- [*] Responsive desktop layout with sidebar navigation
- [*] Mobile bottom navigation (Farmer: Home, Products, Orders, Stock, Profile)
- [*] Mobile bottom navigation (Buyer: Home, Explore, Cart with badge, Orders, Profile)
- [*] Mobile bottom navigation (Bulk Buyer: Home, Find Farmers, Requirements, Orders, Profile)
- [*] Responsive Admin dashboard navigation with mobile compact header & quick tabs
- [*] Farmer dashboard with GoParm Farm Hero Card (farm banner, owner name, location badge, active harvest status)
- [*] Buyer dashboard (greeting, location pill, category shortcuts, Fresh Today, nearby farmers, active order banner)
- [*] Bulk buyer dashboard (commercial procurement overview)
- [*] Admin dashboard overview
- [*] Product marketplace (`/buyer/explore` with search & filters)
- [*] Product detail screen (desktop grid + mobile card layout with sticky bottom action bar)
- [*] Farmer profile screen
- [*] Add/edit product forms with Zod validation
- [*] Dedicated Stock management screen (`/farmer/stock` with reactive `+` / `−` steppers)
- [*] Cart & checkout workflow (Zustand persistent store with live counter)
- [*] Order tracking (5-step visual timeline)
- [*] Bulk requirements posting & deterministic compatibility matches
- [*] User profiles (Farmer, Buyer, Bulk Buyer)
- [*] Notification interface
- [*] Loading states & skeletons
- [*] Empty states
- [*] Error states
- [*] Form validation with React Hook Form + Zod

### 2.1 Homepage Redesign (Visual Reference: Screenshot media_1795185066070_16b6cc06.jpg)
- [*] Mobile App Header (FarmConnect logo + notification bell with dot + avatar/sign-in)
- [*] Location Selector Pill with current location & dropdown
- [*] Mobile Instant Search Bar routing to `/explore`
- [*] Compact Agricultural Hero Banner (exact copy, Explore Produce & Sell buttons)
- [*] 3-Column Trust Stats Card (200+ Farmers, 50+ Varieties, 5,000+ Happy Buyers)
- [*] Popular Categories shortcut cards (Vegetables, Fruits, Grains, Pulses with photographic imagery)
- [*] Fresh Today marketplace cards with harvest badges & Add-to-Cart
- [*] Nearby Farmers cards matching screenshot (farm image, verified badge, km distance, View Profile pill)
- [*] Popular Products showcase
- [*] Sell on FarmConnect promotional card
- [*] Persistent Mobile Bottom Navigation on homepage with `pb-safe`
- [*] Responsive desktop presentation (professional full navbar, wide hero, responsive grid, full footer)

### 2.2 Interactive Geospatial Map (Option B — Leaflet + OpenStreetMap)
- [*] Client-side Leaflet integration with dynamic SSR safety (`SafeFarmerMap`)
- [*] Custom SVG farm pin markers with agricultural styling and bounce/hover focus
- [*] Rich farm preview popups (cover photo, verified badge, rating, harvest summary, direct profile link)
- [*] User location GPS integration (`navigator.geolocation`) with pulsing blue radar marker
- [*] Interactive radius distance circles (5 km, 15 km, 30 km, All) with bounds auto-fitting
- [*] Dual View Switcher (`[ List View ]` / `[ Map View ]`) on `/buyer/farmers` and `/farmers`
- [*] Direct Map View button on homepage Nearby Farmers section (`/buyer/farmers?view=map`)

### 2.3 Vernacular & Multilingual Support (Option C — Kannada, Hindi, English)
- [*] Core translation dictionaries for English (`en`), Kannada (`kn` / ಕನ್ನಡ), and Hindi (`hi` / हिंदी)
- [*] Persistent Zustand language store (`useLanguageStore`) with `localStorage` sync
- [*] Sleek `LanguageSwitcher` pill and dropdown component with native script labels
- [*] Seamless integration in Desktop Navbar, Mobile App Headers, Sidebar, Hero Banner, and Category shortcuts
- [*] Zero-reload reactive UI translation across public and authenticated portals

---

## 3. Backend & API Services
- [*] Authentication endpoints (`POST /api/auth/login`, `register`, `logout`)
- [*] Role-based access control middleware (`middleware.ts`)
- [*] Farmer profile APIs (`GET`, `PUT /api/farmers/profile`)
- [*] Farmer verification APIs (`PATCH /api/admin/farmers/[id]/verify`)
- [*] Product APIs (`GET`, `POST`, `PUT`, `DELETE /api/products/[id]`)
- [*] Dedicated Stock adjustment API (`PATCH /api/products/[id]`)
- [*] Order APIs with atomic stock reservation (`POST`, `GET`, `PATCH /api/orders/[id]/status`)
- [*] Bulk requirement APIs (`POST`, `GET /api/bulk-requests/[id]`)
- [*] Farmer offer bidding workflow (`/farmer/bulk-requests`)
- [*] Review APIs (`POST /api/reviews`)
- [*] Admin moderation APIs (`GET`, `PATCH /api/admin/users`)
- [*] Data ownership checks (farmers can only edit their own listings)
- [*] Centralized error handling & validation responses
- [*] End-to-end API testing

---

## 4. Database (PostgreSQL + Drizzle ORM)
- [*] `users` table (UUID, email, name, phone, passwordHash, role, status)
- [*] `farmers` table (farmName, address, latitude, longitude, verified, rating)
- [*] `categories` enumeration (vegetables, fruits, grains, dairy, herbs)
- [*] `products` table (farmerId, name, category, price, quantity, unit, harvestDate, status)
- [*] `orders` table (buyerId, farmerId, status, totalAmount, fulfillmentMethod)
- [*] `order_items` table (orderId, productId, quantity, unitPrice, subtotal)
- [*] `bulk_requests` table (buyerId, productName, quantity, unit, maxPrice)
- [*] `bulk_offers` table (requirementId, farmerId, offeredPrice, quantity, status)
- [*] `reviews` table (orderId, farmerId, buyerId, rating, comment)
- [*] `notifications` table (userId, title, message, read)
- [*] Relational foreign keys and indexes
- [*] Stock transaction handling with PostgreSQL row-level locks
- [*] Seed data with authentic agricultural profiles and harvest catalog

---

## 5. PWA (Progressive Web Application)
- [*] Web app manifest (`app/manifest.ts` generating `/manifest.webmanifest`)
- [*] Application icons (192x192, 512x512, apple-touch-icon in `public/icons/`)
- [*] Standalone display mode configuration
- [*] Theme color (`#4D8B38`) and background color (`#F7F9F2`)
- [*] Portrait orientation lock & viewport cover for mobile browsers

---

## 6. Testing and Deployment
- [*] Registration testing
- [*] Login testing with role-based redirection
- [*] Farmer verification testing
- [*] Product creation testing
- [*] Product editing testing
- [*] Search and filter testing
- [*] Stock adjustment stepper testing (`StockStepper`)
- [*] Order workflow testing (`REQUESTED` → `ACCEPTED` → `PREPARING` → `READY` → `COMPLETED`)
- [*] Cancellation testing & stock restoration
- [*] Bulk buyer matching engine testing
- [*] Admin moderation testing
- [*] Server-side authorization testing
- [*] Mobile browser responsiveness testing (Safe-area padding, mobile bottom nav)
- [*] Desktop browser responsiveness testing (Sidebar layouts, max-width constraints)
- [*] Production build verification (`npm run build` — 61 routes compiled successfully)

---

## 7. College Documentation
- [*] Problem statement *(docs/srs.md Section 1.3)*
- [*] Project objectives *(docs/srs.md Section 1.1)*
- [*] Existing system analysis *(docs/project-audit.md)*
- [*] Proposed system *(docs/srs.md Section 1.2)*
- [*] Stakeholder findings *(docs/srs.md Section 2.2)*
- [*] Functional requirements *(docs/srs.md Section 3.1)*
- [*] Non-functional requirements *(docs/srs.md Section 3.2)*
- [*] Architecture diagram *(docs/system-architecture.md Section 1)*
- [*] ER diagram *(docs/system-architecture.md Section 2)*
- [*] Data flow diagrams Level 0, 1, 2 *(docs/system-architecture.md Section 3)*
- [*] Database design documentation *(docs/system-architecture.md Section 2)*
- [*] Test cases and results *(docs/test-reports.md Section 2)*
- [*] Demonstration walkthrough guide *(docs/test-reports.md Section 4)*
- [*] Limitations and future enhancements *(docs/project-audit.md Section 11)*

---
*Updated automatically upon verified test completion.*
