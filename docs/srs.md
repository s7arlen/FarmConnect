# Software Requirements Specification (SRS)
## Project: FarmConnect — Direct Farmer-to-Buyer Agricultural Marketplace
**Document Identifier:** FC-SRS-2026-V1.0  
**Project Category:** Academic Community Engineering Project  
**Target Domain:** Agricultural Supply Chain & Direct Mandi Disintermediation  
**Authors:** Student Project Engineering Team  
**Date:** Academic Year 2026  

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the formal functional and non-functional requirements of **FarmConnect**, an end-to-end full-stack web application designed to eliminate exploitative intermediaries (middlemen/agents) in the agricultural supply chain. The system connects smallholder farmers directly with local retail consumers and bulk commercial procurers (restaurants, hostel messes, grocery cooperatives).

### 1.2 Scope of the System
FarmConnect consists of:
1. **A Full-Stack Web Application (`/farmconnect`)**: Built with Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, and Radix UI primitives, delivering fully responsive portals for Farmers, Retail Buyers, Bulk Buyers, and System Administrators.
2. **Integrated Next.js API Routes (`/app/api/*`)**: Serverless and Node.js route handlers providing transactional order processing, farmer verification, and deterministic buyer-seller matching.
3. **A Relational Database**: PostgreSQL with Drizzle ORM enforcing strict referential integrity, decimal-precise monetary calculations, and role-based audit logging.

### 1.3 Target Audience & Problem Statement
- **Smallholder Farmers (0.5 to 5 Acres)**: Currently receive only 20% to 35% of the consumer retail rupee due to 4–6 layers of APMC agents, commission brokers, and transportation cartels. Perishable produce often spoils when held back by market delays.
- **Urban Retail Buyers & Household Consumers**: Pay inflated prices for chemically treated, cold-stored produce that took 3–5 days to reach retail shelves.
- **Bulk Commercial Procurers (Institutions & Hotels)**: Experience volatile procurement rates and lack direct provenance tracking to farm sources.

---

## 2. Overall Description

### 2.1 Product Perspective
FarmConnect operates as an open-access platform independent of proprietary gatekeepers. It interfaces with:
- Geolocation GPS subsystem for proximity calculations (e.g., `< 10 km` farm radius).
- Direct SMS and notification dispatchers for harvest readiness alerts.
- Cloudinary Content Delivery Network for produce quality inspection images.

### 2.2 User Classes and Characteristics
| User Class | Digital Literacy | Primary Goals | Key Web Application Features |
| :--- | :--- | :--- | :--- |
| **Smallholder Farmer** | Basic to Intermediate | High realization price, prompt payment, low post-harvest wastage | Responsive farm dashboard, produce listing & editing, inventory management, order status pipeline |
| **Retail Consumer** | Intermediate to High | Fresh chemical-free produce, knowing origin farm, transparent prices | Proximity filters, produce modal cards, multi-item cart, order tracking timeline, ratings & reviews |
| **Bulk Buyer** | High (Commercial enterprise) | Predictable volume supply, negotiated bulk pricing, invoice history | Bulk requirement submission, 5-factor deterministic matching score breakdown, order overview |
| **System Admin** | Expert | Platform integrity, fair pricing, dispute arbitration, farmer verification | KYC / Farm verification workflow, user status management (suspend/activate), platform metrics |

### 2.3 Operating Environment
- **Client Platforms**: Modern web browsers (Chrome, Safari, Firefox, Edge) with responsive layouts optimized for Mobile Web, Tablets, and Desktop viewports.
- **Server Runtime**: Node.js runtime v18.x / v20.x LTS with Next.js 14 App Router.
- **Database Engine**: PostgreSQL 15+ (Local or Neon/Supabase Serverless) with ACID transaction isolation.

---

## 3. Specific Requirements

### 3.1 Functional Requirements (FR)

#### Module 1: Authentication & Access Control
- **FR-AUTH-01**: The system shall authenticate web sessions using secure HTTP-only encrypted session cookies (`farmconnect_session`).
- **FR-AUTH-02**: Passwords shall be hashed using `bcrypt` with a minimum salt work factor of 10.
- **FR-AUTH-03**: The web application shall provide role-based redirection and access control enforced by Next.js middleware across Farmer, Buyer, Bulk Buyer, and Admin routes.

#### Module 2: Farmer Inventory & Harvest Lifecycle
- **FR-FARM-01**: A farmer shall be able to list new agricultural produce with mandatory fields: Crop Name, Category, Price per Unit, Quantity Available, Unit of Measurement, and Harvest Status.
- **FR-FARM-02**: The farmer inventory interface shall provide instantaneous stock updates and status indicators.
- **FR-FARM-03**: When stock drops below 30 units, the system shall mark the item status as `LIMITED`; when 0 units remain, it shall immediately become `UNAVAILABLE` to prevent overselling.

#### Module 3: Retail Marketplace & Ordering
- **FR-BUY-01**: Buyers shall browse available farm produce filtered by categories (Vegetables, Fruits, Grains, Dairy, Herbs).
- **FR-BUY-02**: Selecting any product shall launch the Product Detail Modal displaying freshness timestamps, farm provenance, distance in kilometers, and price breakdown.
- **FR-BUY-03**: The system shall process order requests with fulfillment selection (`Direct Farm Gate Pickup` or `Local Delivery`).

#### Module 4: Order Concurrency & Stock Reservation
- **FR-ORD-01**: Placing an order shall atomically decrement available stock in an ACID database transaction.
- **FR-ORD-02**: If requested quantity exceeds live inventory during order placement, the transaction shall rollback with HTTP 400 (`Insufficient farm stock`).
- **FR-ORD-03**: Farmers shall have the ability to advance order states: `REQUESTED` $\rightarrow$ `ACCEPTED` $\rightarrow$ `PREPARING` $\rightarrow$ `READY` $\rightarrow$ `COMPLETED`.

#### Module 5: Bulk Procurement & Compatibility Engine
- **FR-BULK-01**: Commercial buyers shall post bulk supply requirements specifying required quantity, target ceiling price (₹), and delivery deadline.
- **FR-BULK-02**: The backend matching engine (`lib/matching.ts`) shall calculate a composite match score (0–100%) evaluating:
  $$\text{Score} = w_1 \cdot S_{\text{qty}} + w_2 \cdot S_{\text{price}} + w_3 \cdot S_{\text{dist}} + w_4 \cdot S_{\text{rating}} + w_5 \cdot S_{\text{cert}}$$
- **FR-BULK-03**: Bulk buyers shall view ranked farmer offers and deterministic score breakdowns.

---

### 3.2 Non-Functional Requirements (NFR)

#### NFR-1: Performance & Latency
- Initial web page loads shall complete within 1.5 seconds with Next.js Server Components.
- API route handlers shall respond within 150 ms under concurrent load.

#### NFR-2: Reliability & State Integrity
- Persistent client state (cart, wishlist, UI settings) shall sync reactively via Zustand with localStorage persistence.
- Database transactions shall preserve full ACID consistency across concurrent purchase attempts.

#### NFR-3: Usability & Accessibility
- Clean agricultural design system utilizing Tailwind CSS with high-contrast accessibility standards.
- Fully responsive across smartphone, tablet, and desktop viewports.

#### NFR-4: Security & Integrity
- All communication must take place over TLS 1.3 / HTTPS.
- Strict ownership verification middleware shall prevent unauthorized modifications of another farmer's harvest or pricing.

---

## 4. Verification & Traceability Matrix
| Requirement ID | Verification Method | Associated Module | Test / Build Target |
| :--- | :--- | :--- | :--- |
| FR-AUTH-01 | Session Cookie Verification | `app/api/auth/*`, `lib/auth.ts` | TC-WEB-AUTH |
| FR-FARM-01 | Form & Schema Test | `app/farmer/products/new/page.tsx` | TC-WEB-PROD |
| FR-FARM-02 | Inventory API & UI | `app/api/products/[id]/route.ts` | TC-WEB-STOCK |
| FR-ORD-01 | Transaction Smoke Test | `app/api/orders/route.ts` | TC-WEB-ORD |
| FR-BULK-02 | Mathematical Verification | `lib/matching.ts` | TC-WEB-MATCH |

---
*End of Software Requirements Specification (SRS)*
