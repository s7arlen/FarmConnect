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
The purpose of this document is to define the formal functional and non-functional requirements of **FarmConnect**, an end-to-end mobile and web software platform designed to eliminate exploitative intermediaries (middlemen/agents) in the agricultural supply chain. The system connects smallholder farmers directly with local retail consumers and bulk commercial procurers (restaurants, hostel messes, grocery cooperatives).

### 1.2 Scope of the System
FarmConnect consists of:
1. **A Native Mobile Application (`/mobile`)**: Built with React Native & Expo for Android and iOS devices, designed using the GoParm agricultural user-experience paradigm.
2. **A Node.js REST API Backend (`/server`)**: An Express.js microservice delivering high-concurrency transactional inventory locking and deterministic buyer-seller matching.
3. **A Relational Database**: PostgreSQL with Drizzle ORM enforcing strict referential integrity, decimal-precise monetary calculations, and role-based audit logging.
4. **An Administrative & Public Portal (`/farmconnect`)**: Next.js 14 web application providing public discovery and administrative oversight.

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
| User Class | Digital Literacy | Primary Goals | Key Mobile Features |
| :--- | :--- | :--- | :--- |
| **Smallholder Farmer** | Basic to Intermediate (Vernacular preferred) | High realization price, immediate cash settlements, low wastage | GoParm Farm Banner, 1-tap stock steppers, harvest readiness cards, order acceptance |
| **Retail Consumer** | Intermediate to High | Fresh chemical-free produce, knowing origin farm, transparent prices | Proximity filters, produce inspection modals, basket checkout, order tracking |
| **Bulk Buyer** | High (Commercial enterprise) | Predictable volume supply, negotiated bulk pricing, invoice history | Requirement posting, 5-factor algorithmic farmer matching, automated contract generation |
| **System Admin** | Expert | Platform integrity, fair pricing, dispute arbitration, farmer verification | KYC / FPO document verification, ban abusive actors, real-time volume analytics |

### 2.3 Operating Environment
- **Mobile Client**: Android 8.0+ (API Level 26+) and iOS 14.0+.
- **Backend Host**: Node.js runtime v20.x LTS on Linux/Containerized environment.
- **Database Engine**: PostgreSQL 15+ with ACID transaction isolation.

---

## 3. Specific Requirements

### 3.1 Functional Requirements (FR)

#### Module 1: Authentication & Access Control
- **FR-AUTH-01**: The system shall authenticate users via cryptographically secure JWT tokens (JSON Web Tokens) with 7-day expiration.
- **FR-AUTH-02**: Passwords shall be hashed using `bcrypt` with a minimum salt work factor of 10.
- **FR-AUTH-03**: The mobile client shall support zero-friction demo switching across Farmer, Buyer, and Bulk roles for viva demonstrations.

#### Module 2: Farmer Inventory & Harvest Lifecycle
- **FR-FARM-01**: A farmer shall be able to list new agricultural produce with mandatory fields: Crop Name, Category, Price per Unit, Quantity Available, Unit of Measurement, and Harvest Status.
- **FR-FARM-02**: The farmer stock interface shall implement instant reactive increment/decrement steppers modeled after GoParm Screen 3.
- **FR-FARM-03**: When stock drops below 30 units, the system shall mark the item status as `LIMITED`; when 0 units remain, it shall immediately become `UNAVAILABLE` to prevent overselling.

#### Module 3: Retail Marketplace & Ordering
- **FR-BUY-01**: Buyers shall browse available farm produce filtered by categories (Vegetables, Fruits, Grains, Dairy, Herbs).
- **FR-BUY-02**: Tapping any product shall launch the Product Detail Modal displaying freshness timestamps, farm provenance, distance in kilometers, and direct farmer margin impact.
- **FR-BUY-03**: The system shall process order requests with fulfillment selection (`Direct Farm Gate Pickup` or `Local Delivery`).

#### Module 4: Order Concurrency & Stock Reservation
- **FR-ORD-01**: Placing an order shall atomically decrement available stock in an ACID database transaction.
- **FR-ORD-02**: If requested quantity exceeds live inventory during order placement, the transaction shall rollback with HTTP 400 (`Insufficient farm stock`).
- **FR-ORD-03**: Farmers shall have the ability to advance order states: `REQUESTED` $\rightarrow$ `ACCEPTED` $\rightarrow$ `PREPARING` $\rightarrow$ `READY` $\rightarrow$ `COMPLETED`.

#### Module 5: Bulk Procurement & Compatibility Engine
- **FR-BULK-01**: Commercial buyers shall post bulk supply requirements specifying required quantity, target ceiling price (₹), and delivery deadline.
- **FR-BULK-02**: The backend matching engine shall calculate a composite match score (0–100%) evaluating:
  $$\text{Score} = w_1 \cdot S_{\text{qty}} + w_2 \cdot S_{\text{price}} + w_3 \cdot S_{\text{dist}} + w_4 \cdot S_{\text{rating}} + w_5 \cdot S_{\text{cert}}$$
- **FR-BULK-03**: Bulk buyers shall view ranked farmer offers and accept bids, automatically converting them into purchase orders.

---

### 3.2 Non-Functional Requirements (NFR)

#### NFR-1: Performance & Latency
- The mobile application cold launch time shall be under 2.5 seconds on standard 4G networks.
- All REST API endpoints shall respond within 150 ms under 100 concurrent requests.

#### NFR-2: Reliability & Offline Resilience
- In the event of network disruption, the mobile application shall seamlessly fall back to local reactive Zustand storage so that demonstrations and cached inventory remain browsable without crashing.

#### NFR-3: Usability & Accessibility (GoParm Paradigm)
- High contrast color palette (`#4D8B38`, `#28552B`, `#E8F4D9`, `#F7F9F2`) ensuring readability in bright sunlight for outdoor farm use.
- Minimum touch target size of 44×44 pt for all interactive steppers and navigation pills.

#### NFR-4: Security & Integrity
- All communication must take place over TLS 1.3 / HTTPS.
- Strict ownership verification middleware (`verifyOwnership`) shall prevent unauthorized modifications of another farmer's harvest or pricing.

---

## 4. Verification & Traceability Matrix
| Requirement ID | Verification Method | Associated Module | Test Case ID |
| :--- | :--- | :--- | :--- |
| FR-AUTH-01 | Automated Test | `/server/src/controllers/auth.ts` | TC-AUTH-01 |
| FR-FARM-01 | Manual & UI Test | `/mobile/src/components/AddProductModal.tsx` | TC-MOB-01 |
| FR-FARM-02 | State Verification | `/mobile/src/store/stockStore.ts` | TC-MOB-02 |
| FR-ORD-01 | Transaction Smoke Test | `/server/src/controllers/orders.ts` | TC-API-03 |
| FR-BULK-02 | Mathematical Verification | `/server/src/utils/matching.ts` | TC-ALGO-01 |

---
*End of Software Requirements Specification (SRS)*
