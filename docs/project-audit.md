# FarmConnect — Comprehensive Project Audit & Technical Analysis

**Project Name:** FarmConnect  
**Date:** November 2026  
**Auditor:** Mobile Application Architect & Lead Full-Stack Engineer  
**Live Web Deployment:** [https://farmconnect-drab.vercel.app/](https://farmconnect-drab.vercel.app/)  
**GitHub Repository:** [https://github.com/s7arlen/FarmConnect](https://github.com/s7arlen/FarmConnect)  

---

## 1. Executive Summary

FarmConnect was originally built as a web-first application using **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Drizzle ORM** with **PostgreSQL**. It offers comprehensive web screens for marketing, buyers, farmers, bulk buyers, and administrators. 

To transform FarmConnect into a genuine, professional native mobile application suitable for college community demonstration and real-world agricultural utility, the core business logic, database schema, matching algorithms, and validation rules must be decoupled and exposed via a dedicated backend, while a native **React Native (Expo + Expo Router)** application is constructed under `/mobile`, visually styled after modern agricultural technology benchmarks (specifically referencing the **GoParm** design system).

---

## 2. Current Architecture & Tech Stack

| Layer | Current Implementation | Status / Observation |
|---|---|---|
| **Framework** | Next.js 14.2 (App Router) | Web-only (SSR + CSR mix). Not suitable as mobile client. |
| **Language** | TypeScript 5.5 (Strict mode) | Type-safe throughout. Fully reusable for mobile models & API. |
| **Styling** | Tailwind CSS + Radix UI Primitives | Web-specific CSS classes; cannot run directly in React Native (requires React Native StyleSheet or NativeWind). |
| **State Management** | Zustand (auth, cart, ui, wishlist) with `persist` | Reusable; logic translates directly to React Native using `@react-native-async-storage/async-storage`. |
| **Data Validation** | Zod v3.23 + React Hook Form | 100% reusable across both React Native forms and Express/API validation. |
| **Database ORM** | Drizzle ORM v0.33 | 9 relational schemas defined. Clean, modern, fully transferable to standalone backend. |
| **Database** | PostgreSQL (Postgres.js driver) | Ready for Supabase / Neon / Local PostgreSQL. |
| **Auth System** | Cookie-based session (`farmconnect_session`, base64 JSON payload) | Web cookie-based; mobile requires Bearer token (JWT in `Authorization` header) stored in SecureStore. |
| **Business Logic** | 5-factor matching algorithm (`lib/matching.ts`) | 100% portable TypeScript code. |

---

## 3. Feature Audit & Classification Matrix

Legend:
- **COMPLETED**: Fully implemented and functional end-to-end.
- **PARTIALLY COMPLETED**: UI exists or partial endpoint exists, but end-to-end flow is incomplete or uses mock fallback.
- **NOT IMPLEMENTED**: Feature is missing completely.
- **NEEDS IMPROVEMENT**: Functional but requires correction, optimization, or mobile-native adaptation.
- **NEEDS VALIDATION**: Requires confirmation through local agricultural stakeholder research.

| Feature Area | Specific Capability | Current Status | Detailed Audit Notes |
|---|---|---|---|
| **Authentication** | Registration (Buyer, Farmer, Bulk Buyer) | PARTIALLY COMPLETED | Web forms work with Zod, writes to DB or demo fallback. Mobile screens not yet built. |
| **Authentication** | Login & Role Redirection | PARTIALLY COMPLETED | Base64 cookie used. Needs cryptographically signed JWT for mobile API. |
| **Authentication** | Password Reset (`/forgot-password`) | NOT IMPLEMENTED | UI exists but has mock `setTimeout(1000)`. No token generation or email delivery. |
| **Farmer Module** | Farm Profile Setup & Edit | PARTIALLY COMPLETED | Web UI and `/api/farmers/profile` exist. Image uploads are local blob previews. |
| **Farmer Module** | Product Listing & Creation | COMPLETED (Web) | Form validation, unit selection, category selection work. |
| **Farmer Module** | Product Edit & Deletion | COMPLETED (Web) | `PUT` and `DELETE /api/products/[id]` implemented. Needs mobile screen. |
| **Farmer Module** | Stock Management & Inventory | PARTIALLY COMPLETED | Products have quantities, but dedicated stock overview (like GoParm Stock screen) does not exist. |
| **Farmer Module** | Order Acceptance / Rejection | COMPLETED (Web) | Status transitions enforced (`REQUESTED` → `ACCEPTED` → `PREPARING` → `READY` → `COMPLETED`). |
| **Farmer Module** | Sales Analytics | NEEDS IMPROVEMENT | Recharts web charts exist with static/demo data. Needs dynamic aggregation. |
| **Buyer Module** | Product Discovery & Search | COMPLETED (Web) | Keyword search, category filtering, price filter, availability sorting work. |
| **Buyer Module** | Farmer Profile Discovery | COMPLETED (Web) | Shows farm location, verified badge, description, and listings. |
| **Buyer Module** | Cart & Checkout | COMPLETED (Web) | Zustand cart persistence, multi-farmer checkout, order creation. |
| **Buyer Module** | Order Tracking & Timeline | COMPLETED (Web) | 5-step visual timeline tracking order progression. |
| **Buyer Module** | Wishlist / Favorites | COMPLETED (Web) | Zustand store + heart toggle + dedicated wishlist screen. |
| **Buyer Module** | Rating & Review Submission | COMPLETED (Web) | Star picker & comment dialog on completed orders updating farm rating. |
| **Bulk Buyer** | Post Requirement | COMPLETED (Web) | Form saves requirement and computes deterministic matches. |
| **Bulk Buyer** | Farmer Matches Breakdown | COMPLETED (Web) | Ranks compatibility (0–100%) across product, quantity, distance, price, availability. |
| **Bulk Buyer** | Farmer Offers & Negotiation | NOT IMPLEMENTED | Farmer offer submission and buyer offer comparison workflow not yet built. |
| **Bulk Buyer** | Bulk Orders View | PARTIALLY COMPLETED | Web screen displays demo shipments; needs dynamic order generation from accepted offers. |
| **Admin Module** | Dashboard Overview | PARTIALLY COMPLETED | Shows platform counters and demo charts. |
| **Admin Module** | Farmer Verification Workflow | COMPLETED (Web) | Approves/rejects farm verification status via API. |
| **Admin Module** | User Management (Suspend/Activate) | COMPLETED (Web) | Updates user status via API. |
| **Admin Module** | Product Moderation & Reports | PARTIALLY COMPLETED | Reports review screen built with resolve action; moderation needs automated flags. |
| **Infrastructure** | Native Mobile App (React Native/Expo) | NOT IMPLEMENTED | Currently web-only Next.js app. Zero native mobile code. |
| **Infrastructure** | Express.js REST API | NOT IMPLEMENTED | API currently runs inside Next.js API route handlers. Needs standalone Express service for mobile. |
| **Infrastructure** | Image Upload (Cloudinary) | PARTIALLY COMPLETED | Abstraction exists in `lib/cloudinary.ts` but commented out. Relies on client blob URLs. |
| **Domain Logic** | Stakeholder Field Research | NEEDS VALIDATION | Local agricultural context (Goa/Karnataka region) needs field validation for digital literacy. |

---

## 4. Reusable Assets & Code

The following existing code can be directly leveraged for the mobile and backend build:

1. **Drizzle Database Schemas (`db/schema/*.ts`):**
   - Clean, modular definitions for `users`, `farmers`, `products`, `orders`, `orderItems`, `reviews`, `bulkRequests`, `bulkMatches`, `notifications`.
   - Complete type inference (`$inferSelect`, `$inferInsert`).
2. **Zod Validation Schemas (`lib/validations.ts`):**
   - Fully compatible with React Native Hook Form resolver (`@hookform/resolvers/zod`).
   - Validates products, orders, bulk requests, farm profiles, registration, and reviews.
3. **Deterministic Matching Algorithm (`lib/matching.ts`):**
   - 5-factor scoring engine with weighting (Product 30%, Quantity 25%, Distance 20%, Price 15%, Availability 10%).
   - Pure TypeScript, zero DOM dependencies, 100% portable to the new Express backend.
4. **Seed Data & Fictional Farms (`db/seed.ts` & `data/demo.ts`):**
   - Realistic Indian agricultural product categories, pricing, seasonal harvest data, and test user credentials.

---

## 5. Technical & Architectural Deficiencies

1. **Web vs. Mobile UI Coupling:**
   - The current UI relies on browser DOM elements (`<div />`, `<button />`, `<input />`, HTML forms, CSS Grid/Flexbox with Tailwind).
   - React Native requires `<View />`, `<Text />`, `<TouchableOpacity />`, `<TextInput />`, and native layout constraints (`StyleSheet`).
2. **Session / Authentication Token Storage:**
   - Web uses Next.js `cookies()` and Base64 encoded JSON strings.
   - Mobile requires Bearer tokens sent in the `Authorization: Bearer <token>` HTTP header, signed cryptographically (JWT with HMAC-SHA256), and stored in native secure storage (`expo-secure-store`).
3. **Monolithic Next.js Hosting vs. Mobile Backend:**
   - The Next.js API routes are coupled to the Next server process. A native app is best served by a dedicated Node.js + Express.js REST API service with CORS, rate limiting, and centralized error middleware.
4. **Image Handling:**
   - Products currently use external Unsplash URLs or temporary `URL.createObjectURL(file)`. Mobile needs real multipart form-data image uploading to Cloudinary or AWS S3.
5. **Inventory Race Conditions:**
   - Multiple buyers ordering the same limited crop at the same time could oversell stock. Must enforce strict PostgreSQL row-locking transactions (`SELECT ... FOR UPDATE`) during order placement.

---

## 6. Recommended Native Mobile Migration Strategy

### Strategy: Two-Tier Architecture with Dedicated Mobile App
To preserve the working web application and website (`https://farmconnect-drab.vercel.app/`) while building the true native mobile application:

1. **Keep Web Platform Intact:**
   - Preserve existing `/app` and `/components` for web users and administrative viewing.
2. **Create Standalone Backend (`/server` or `/backend`):**
   - Node.js + Express.js + TypeScript + Drizzle ORM + PostgreSQL.
   - Exposes clean REST API endpoints consuming JSON and returning standard payloads `{ success: true, data: ... }`.
   - Issues JWT access tokens for mobile authentication.
3. **Build Native Mobile App (`/mobile`):**
   - React Native with **Expo SDK 51+** and **Expo Router v3**.
   - TypeScript strict mode.
   - Native bottom tabs separated by role:
     - **Farmer:** Home, My Products, Orders, Stock, Profile.
     - **Buyer:** Home, Explore, Cart, Orders, Profile.
     - **Bulk Buyer:** Home, Find Farmers, Requirements, Orders, Profile.
   - Design system inspired directly by **GoParm** reference:
     - Soft organic green palette (`#4D8B38`, `#28552B`, `#E8F4D9`, `#F7F9F2`).
     - Card-based layouts with rounded corners (16–24px radius).
     - Clean metric badges, weather/harvest indicators, and stock list item rows.
     - Native header bars and safe-area insets.
4. **Admin Dashboard (`/admin-web` or existing `/admin`):**
   - Lightweight React web interface dedicated to platform management.

---

## 7. Final Implementation Priority Order

1. **Phase 1: Architecture & Project Tracking Setup** (Audit + Checklist).
2. **Phase 2: Mobile Workspace Foundation** (`/mobile` with Expo, Expo Router, TypeScript, GoParm Theme & Base Components).
3. **Phase 3: Backend REST API Service** (`/server` with Express, JWT auth, Drizzle ORM PostgreSQL connection).
4. **Phase 4: Mobile Authentication & Role Selection** (Buyer/Farmer/Bulk Buyer onboarding).
5. **Phase 5: Farmer Mobile Experience** (Dashboard, Crop Catalog, Add/Edit Produce, GoParm-style Stock Screen).
6. **Phase 6: Buyer Mobile Marketplace** (Home Feed, Produce Search, Farm Details, Cart, Order Request).
7. **Phase 7: Order Management & Stock Reservation** (Real-time order statuses, transactions, stock protection).
8. **Phase 8: Bulk Buyer Module** (Post Requirements, Match Explorer, Offer Handling).
9. **Phase 9: Admin Management** (Verification, Suspensions, Content Moderation).
10. **Phase 10: Academic / College Documentation** (SRS, ER Diagrams, Architecture Diagrams, Test Reports).
