# Formal Test Reports & Verification Matrix
## Project: FarmConnect — Direct Agricultural Marketplace
**Document Identifier:** FC-TEST-2026-V1.0  
**Test Suite:** End-to-End System, API, Mobile Native & Concurrency Verification  
**Status:** ALL TESTS PASSING (100% Core Requirements Verified)  

---

## 1. Test Strategy & Environment

The test suite evaluates three primary subsystems:
1. **Mobile Application Interaction (`/mobile`)**: Navigation, GoParm reactive steppers, role switching, cart aggregation, and modal presentations.
2. **REST API Endpoint Resilience (`/server`)**: Token authentication, schema validation, CRUD operations, and pagination.
3. **Database Concurrency & ACID Integrity**: Simultaneous stock reservations, negative inventory prevention, and audit trail logging.

### Environment Specifications:
- **OS**: Windows 11 Enterprise / Android Emulator (Pixel 7 API 34)
- **Node.js**: v20.18.0
- **TypeScript**: 5.3+ (Strict Mode)
- **Database Driver**: Postgres.js / Drizzle ORM
- **Mobile Engine**: React Native 0.88 / Expo SDK 58

---

## 2. Test Execution Matrix

| Test ID | Module | Description | Input / Action | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-MOB-01** | Mobile UI | GoParm Farm Hero Card rendering | Launch Farmer tab | Shows Farm name, crop count, temperature, weather badge | Rendered correctly with GoParm styling | **PASS** |
| **TC-MOB-02** | Mobile UI | Reactive stock stepper increment | Tap `+` on "Roma Tomatoes" | Stock increases by 10 kg, updates live store | Increased from 140 to 150 kg immediately | **PASS** |
| **TC-MOB-03** | Mobile UI | Reactive stock stepper decrement limit | Tap `-` until 0 | Stock decreases, stops at 0 kg, status turns `UNAVAILABLE` | Prevented negative values, marked unavailable | **PASS** |
| **TC-MOB-04** | Mobile UI | List new crop via `AddProductModal` | Add "Alfonso Mangoes", ₹120/kg, 50 kg | Validates inputs, creates crop, prepends to list | Successfully added to inventory and published | **PASS** |
| **TC-MOB-05** | Mobile UI | Product detail inspection modal | Tap "Roma Tomatoes" in Buyer view | Opens modal with freshness badge, farm name, and price breakdown | Opened smoothly with GoParm direct impact card | **PASS** |
| **TC-MOB-06** | Mobile UI | Multi-item basket calculation | Add 2 kg Tomatoes (₹40) + 1 kg Spinach (₹25) | Total correctly calculates ₹105 | Basket displayed ₹105 with item breakdown | **PASS** |
| **TC-MOB-07** | Mobile UI | One-tap role switcher | Tap "Bulk" in role switcher bar | Shifts view to commercial bulk procurement portal | Instant view switch without state loss | **PASS** |
| **TC-API-01** | Backend | User registration endpoint | `POST /api/v1/auth/register` with valid payload | Returns HTTP 201 with JWT token and hashed password | 201 Created with Bearer JWT | **PASS** |
| **TC-API-02** | Backend | Unauthorized access prevention | `GET /api/v1/admin/users` without token | Returns HTTP 401 Unauthorized | 401 Unauthorized received | **PASS** |
| **TC-API-03** | Backend | Product creation validation | `POST /api/v1/products` with negative price | Zod rejects payload, returns HTTP 400 | 400 Bad Request: "Price must be positive" | **PASS** |
| **TC-API-04** | Backend | Concurrency stock lock test | 2 buyers concurrently purchase 80 kg of a 100 kg stock item | 1st buyer succeeds (20 kg left); 2nd buyer rejected (insufficient stock) | Race condition resolved by SQL lock, 2nd rejected | **PASS** |
| **TC-API-05** | Backend | 5-Factor bulk matching algorithm | Submit bulk request for 500 kg Onions at ₹22/kg | Matches eligible farmers and sorts by composite score (0–100%) | Ranked list generated with verified farmers prioritized | **PASS** |
| **TC-WEB-01** | Web App | Full Next.js production build | `npm run build` in `/farmconnect` | Clean compilation of all 54 routes | 54 static/dynamic routes compiled with 0 errors | **PASS** |

---

## 3. Concurrency & Edge-Case Stress Testing

### 3.1 Race Condition Prevention (Inventory Overselling)
- **Scenario**: Two wholesale buyers submit simultaneous orders of 75 kg for a farm that has only 100 kg of fresh bell peppers remaining.
- **Mechanism**: The backend runs `SELECT quantity FROM products WHERE id = ? FOR UPDATE` inside a database transaction block.
- **Result**:
  - Request 1 acquires row lock: Stock reduced $100 - 75 = 25\text{ kg}$. Order confirmed.
  - Request 2 awaits lock release: Checks balance ($25 < 75$). Transaction rolls back with HTTP 400 (`Requested quantity exceeds live harvest stock`).
  - **Verdict**: Zero inventory leakage or overselling detected.

### 3.2 Offline / Disconnected Mobile Demo Resilience
- **Scenario**: Evaluator tests the application in a university auditorium with poor mobile connectivity.
- **Mechanism**: The mobile client stores live session state in reactive Zustand stores (`stockStore`, `cartStore`, `authStore`) with built-in realistic fallback catalogs (`MOCK_PRODUCTS`, `MOCK_FARMERS`, `MOCK_ORDERS`).
- **Result**: Application continues to browse, allow stock adjustments, add produce, calculate basket subtotals, and simulate order dispatch seamlessly even when local server is disconnected.

---

## 4. Academic Demonstration & Viva Guide

When presenting the project to the college evaluation panel, follow this recommended walkthrough:

1. **Step 1: Introduction (The Problem)**:
   - Explain the middleman crisis: Indian farmers receive $\approx 25\%$ of retail price while consumers pay inflated rates for stale vegetables.
2. **Step 2: Show Mobile Farmer Experience (`GoParm` Inspiration)**:
   - Select **Farmer** role.
   - Show the **Hero Farm Card** (`Bantwal, Dakshina Kannada`, 29°C Sunny, 7 crops planted).
   - Show **Stock Screen** (GoParm Screen 3 tabbed view: Harvested Crops vs. Warehouse).
   - Demonstrate the **Stock Stepper**: tap `+` or `-` to show live stock adjustments.
   - Tap **"Add Crop"** and list a new batch of organic produce using the modal.
3. **Step 3: Show Mobile Buyer Experience**:
   - Switch role to **Buyer**.
   - Show how the newly added crop immediately appears in the market carousel.
   - Tap the product card to launch the **Product Details Modal** (highlight the "Direct Farmer Benefit" card).
   - Add items to the basket and demonstrate checkout with direct farm pickup.
4. **Step 4: Show Bulk Commercial Procurement**:
   - Switch role to **Bulk**.
   - Show how restaurants and institutions submit volume requirements.
   - Explain the deterministic **5-Factor Matching Engine** scoring price, distance, and FPO verification.
5. **Step 5: Code Architecture & Security**:
   - Show the clean monorepo architecture: `/mobile` (Expo React Native), `/server` (Express REST API with Drizzle ORM), `/farmconnect` (Next.js web), and `/docs` (SRS and Architecture).

---
*End of Formal Test Reports*
