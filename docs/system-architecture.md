# System Architecture & Technical Design Document
## Project: FarmConnect — Direct Farmer-to-Buyer Marketplace
**Document Identifier:** FC-ARCH-2026-V1.0  
**Target Domain:** Direct Agricultural Supply Chain Platform  
**Target Evaluators:** Academic Community Project Review Committee  

---

## 1. High-Level System Architecture

FarmConnect utilizes a clean three-tier distributed architecture separating presentation, business logic, and transactional persistence.

```mermaid
graph TD
    subgraph Client Layer
        WEB["💻 Web Application (Next.js 14 App Router)<br/>Responsive UI: Farmer, Buyer, Bulk Buyer, Admin"]
    end

    subgraph API & Gateway Layer
        API["⚡ Next.js API Routes (/api/*)<br/>Serverless & Node.js Handlers"]
        AUTH_MID["🔐 Session Cookie Auth & Role Guard Middleware"]
        RATE["🛡️ Centralized Error & Validation Guard (Zod)"]
    end

    subgraph Service & Business Logic
        INV_SRV["📦 Inventory & Stock Service"]
        ORD_SRV["💳 Atomic Concurrency Order Engine"]
        MATCH_SRV["⚖️ 5-Factor Bulk Matching Engine"]
        REV_SRV["⭐ Rating & Reputation Recalculator"]
    end

    subgraph Persistence Layer
        DRIZZLE["⚡ Drizzle ORM Type-Safe Client"]
        PG[("🐘 PostgreSQL Relational Database<br/>ACID Transactions")]
        CDN["☁️ Cloudinary Image CDN"]
    end

    WEB -->|Session / JSON| API
    API --> AUTH_MID
    AUTH_MID --> RATE
    RATE --> INV_SRV
    RATE --> ORD_SRV
    RATE --> MATCH_SRV
    RATE --> REV_SRV

    INV_SRV --> DRIZZLE
    ORD_SRV --> DRIZZLE
    MATCH_SRV --> DRIZZLE
    REV_SRV --> DRIZZLE

    DRIZZLE --> PG
    WEB -.->|Image Uploads| CDN
```

---

## 2. Entity-Relationship Diagram (ERD)

The database schema is normalized to 3NF with foreign key constraints, cascade rules, and dedicated audit/inventory transaction tracking.

```mermaid
erDiagram
    USERS ||--o{ FARMER_PROFILES : "has profile"
    USERS ||--o{ BUYER_PROFILES : "has profile"
    USERS ||--o{ ORDERS : "places as buyer"
    USERS ||--o{ BULK_REQUIREMENTS : "submits"
    USERS ||--o{ REVIEWS : "authors"

    FARMER_PROFILES ||--o{ PRODUCTS : "produces"
    FARMER_PROFILES ||--o{ ORDERS : "fulfills"
    FARMER_PROFILES ||--o{ BULK_OFFERS : "bids on"

    PRODUCTS ||--o{ ORDER_ITEMS : "included in"
    PRODUCTS ||--o{ INVENTORY_LOGS : "stock audit"

    ORDERS ||--o{ ORDER_ITEMS : "contains"
    BULK_REQUIREMENTS ||--o{ BULK_OFFERS : "receives"

    USERS {
        uuid id PK
        string email UK
        string name
        string phone
        string passwordHash
        string role "FARMER | BUYER | BULK_BUYER | ADMIN"
        string status "ACTIVE | SUSPENDED"
        timestamp createdAt
    }

    FARMER_PROFILES {
        uuid id PK
        uuid userId FK
        string farmName
        string address
        decimal latitude
        decimal longitude
        boolean verified
        decimal rating
        int reviewCount
        string coverImage
    }

    BUYER_PROFILES {
        uuid id PK
        uuid userId FK
        string defaultAddress
        string city
        decimal latitude
        decimal longitude
    }

    PRODUCTS {
        uuid id PK
        uuid farmerId FK
        string name
        string category
        decimal price
        decimal quantity
        string unit "kg | quintal | crate"
        string harvestDate
        string status "AVAILABLE | LIMITED | UNAVAILABLE"
    }

    INVENTORY_LOGS {
        uuid id PK
        uuid productId FK
        decimal changeQty
        string reason "HARVEST_ADD | ORDER_DEDUCTION | SPOILAGE"
        decimal balanceAfter
        timestamp createdAt
    }

    ORDERS {
        uuid id PK
        uuid buyerId FK
        uuid farmerId FK
        string status "REQUESTED | ACCEPTED | PREPARING | READY | COMPLETED"
        decimal totalAmount
        string fulfillmentMethod "PICKUP | LOCAL_DELIVERY"
        timestamp createdAt
    }

    ORDER_ITEMS {
        uuid id PK
        uuid orderId FK
        uuid productId FK
        decimal quantity
        decimal unitPrice
        decimal subtotal
    }

    BULK_REQUIREMENTS {
        uuid id PK
        uuid buyerId FK
        string productName
        decimal quantity
        string unit
        decimal maxPrice
        string status "OPEN | MATCHED | ORDERED"
        timestamp requiredDate
    }

    BULK_OFFERS {
        uuid id PK
        uuid requirementId FK
        uuid farmerId FK
        decimal offeredPrice
        decimal quantity
        string status "OFFERED | ACCEPTED | REJECTED"
    }

    REVIEWS {
        uuid id PK
        uuid orderId FK
        uuid farmerId FK
        uuid buyerId FK
        int rating
        string comment
    }
```

---

## 3. Data Flow Diagrams (DFD)

### 3.1 DFD Level 0 — Context Diagram
The Level 0 context diagram demonstrates how external stakeholders interact with the FarmConnect boundary.

```mermaid
graph LR
    FARMER["👨‍🌾 Farmer"]
    BUYER["🛒 Retail Consumer"]
    BULK["🏢 Bulk Buyer"]
    ADMIN["🛡️ System Admin"]

    SYSTEM(("🌾 FarmConnect<br/>Agricultural Platform"))

    FARMER -->|Post Harvest & Stock Updates| SYSTEM
    SYSTEM -->|Order Notifications & Payout Status| FARMER

    BUYER -->|Search Produce & Place Orders| SYSTEM
    SYSTEM -->|Order Confirmation & Tracking| BUYER

    BULK -->|Submit Bulk Produce Requests| SYSTEM
    SYSTEM -->|Algorithmic Match Offers| BULK

    ADMIN -->|KYC Verification & Moderation| SYSTEM
    SYSTEM -->|Audit Trail & Metrics| ADMIN
```

---

### 3.2 DFD Level 1 — System Functional Decomposition

```mermaid
graph TD
    P1["1.0 Authentication & User Profile Management"]
    P2["2.0 Farm Inventory & Harvest Catalog"]
    P3["3.0 Retail Ordering & Concurrency Stock Lock"]
    P4["4.0 Bulk Bidding & Algorithmic Matching"]
    P5["5.0 Verification & Administrative Oversight"]

    D_USERS[("DB: Users & Profiles")]
    D_PROD[("DB: Products & Inventory Logs")]
    D_ORD[("DB: Orders & Items")]
    D_BULK[("DB: Bulk Demands & Bids")]

    P1 <--> D_USERS
    P2 <--> D_PROD
    P3 <--> D_ORD
    P3 -->|Decrement Stock| D_PROD
    P4 <--> D_BULK
    P4 -->|Fetch Available Farm Capacities| D_PROD
    P5 -->|Audit & Verify| D_USERS
    P5 -->|Moderate| D_PROD
```

---

### 3.3 DFD Level 2 — Order Placement & Concurrency Transaction Flow

```mermaid
sequenceDiagram
    autonumber
    actor Buyer as 🛒 Retail Buyer
    participant Browser as 💻 Web Browser
    participant API as ⚡ Next.js API (/api/orders)
    participant Auth as 🔐 Auth Guard (Session)
    participant DB as 🐘 PostgreSQL (ACID)
    actor Farmer as 👨‍🌾 Farmer

    Buyer->>Browser: Select produce quantity & click "Checkout"
    Browser->>API: POST /api/orders {items, fulfillmentMethod}
    API->>Auth: Validate session cookie
    Auth-->>API: Authorized (buyerId)
    
    rect rgb(240, 248, 240)
        Note over API,DB: BEGIN TRANSACTION (SERIALIZABLE)
        API->>DB: SELECT quantity FROM products WHERE id = ? FOR UPDATE
        alt Stock is Sufficient
            API->>DB: INSERT INTO orders ... RETURNING id
            API->>DB: INSERT INTO order_items ...
            API->>DB: UPDATE products SET quantity = quantity - orderedQty
            API->>DB: INSERT INTO inventory_logs (ORDER_DEDUCTION)
            Note over API,DB: COMMIT TRANSACTION
            API-->>Browser: 201 Created {orderId, status: "REQUESTED"}
            API-)Farmer: Create In-App Notification
            Browser-->>Buyer: Show "Order Placed Successfully" Confirmation
        else Stock is Insufficient
            Note over API,DB: ROLLBACK TRANSACTION
            API-->>Browser: 400 Bad Request ("Stock exhausted by another buyer")
            Browser-->>Buyer: Show "Item Sold Out" Toast / Dialog
        end
    end
```

---

## 4. Security & Network Topology

1. **Authentication Token Flow**:
   - Web application uses HTTP-only encrypted session cookies (`farmconnect_session`) with `SameSite=Lax` for browser XSS and CSRF protection.
   - Server-side Next.js middleware enforces role authentication before rendering protected routes.
2. **Zero-Trust Input Sanitization**:
   - Every incoming request payload passes through Zod schema validation guards prior to hitting database operations.
3. **Role-Based Access Control (RBAC)**:
   - Access to `/api/admin/*` and `/admin/*` is strictly guarded by `requireRole("ADMIN")`.
   - Access to `/farmer/*` enforces farm ownership (`userId === product.farmerId`).

---
*End of System Architecture Document*
