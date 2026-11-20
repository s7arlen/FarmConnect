# FarmConnect — Local Farmer Market Platform

> **Know your farmer. Know your food.**

FarmConnect connects local farmers directly with consumers and bulk buyers, reducing unnecessary middlemen and helping buyers discover fresh local produce.

---

## Features

### Buyers
- Discover and search fresh local produce
- Filter by category, price, distance, availability
- View verified farmer profiles and ratings
- Add to cart, checkout, track orders
- Bulk buying with intelligent farmer matching

### Farmers
- Farm profile with verification badge
- List and manage produce with stock control
- Accept/reject orders, update status (Preparing → Ready → Completed)
- Sales analytics with charts
- View bulk purchase requests

### Bulk Buyers (Restaurants, Hotels, Institutions)
- Post bulk requirements with quantity, price, date
- Deterministic matching algorithm (product/quantity/distance/price/availability)
- Compare farmer responses

### Admins
- User management (suspend/activate)
- Farmer verification workflow
- Product and order monitoring
- Platform analytics

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| UI Components | Custom (Radix UI primitives) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database ORM | Drizzle ORM |
| Database | PostgreSQL |
| Auth | Custom session-based (cookie) |
| Validation | Zod + React Hook Form |
| State | Zustand |
| Charts | Recharts |

---

## Project Structure

```
farmconnect/
├── app/
│   ├── (marketing)/        Public landing pages
│   ├── (auth)/             Login, Register, Forgot Password
│   ├── buyer/              Buyer dashboard + marketplace
│   ├── farmer/             Farmer dashboard + management
│   ├── bulk-buyer/         Bulk buyer portal
│   ├── admin/              Admin panel
│   └── api/                API routes
├── components/             Reusable UI components
├── db/                     Drizzle schema + seed
├── lib/                    Auth, utils, validation, matching
├── store/                  Zustand stores (auth, cart, ui)
├── types/                  TypeScript type definitions
└── data/                   Demo/seed data
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 15+ (or Neon/Supabase for hosted)
- npm

### 1. Install dependencies

```bash
cd farmconnect
npm install
```

### 2. Configure environment variables

Copy `.env.local` and fill in your values:

```bash
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/farmconnect"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Optional (for production image uploads)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### 3. Set up the database

```bash
# Push schema to your database
npm run db:push

# Seed demo data
npm run db:seed
```

### 4. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Buyer | buyer@demo.com | Demo@1234 |
| Farmer | farmer@demo.com | Demo@1234 |
| Bulk Buyer | bulk@demo.com | Demo@1234 |
| Admin | admin@demo.com | Demo@1234 |

> **Note:** Demo farmers (Joseph's Farm, Maria's Organic Farm, Antony's Agro Farm, Lakshmi Farms) are fictional and do not represent real registered businesses. All data is for demonstration purposes only.

---

## Core User Flows

### Buyer Flow
1. Register/Login → Buyer Dashboard
2. Explore → Search/Filter products
3. Product Detail → Add to Cart
4. Cart → Checkout → Order Request
5. Order Tracking → Timeline view

### Farmer Flow
1. Login → Farmer Dashboard
2. Products → Add/Edit produce
3. Orders → Accept → Preparing → Ready → Completed
4. Analytics → Sales charts

### Bulk Buying Flow
1. Post Requirement (product, quantity, price, date)
2. System runs matching algorithm
3. View ranked farmer matches with score breakdown
4. Contact/order from best match

---

## Database Schema

| Table | Purpose |
|---|---|
| `users` | All accounts (FARMER/BUYER/BULK_BUYER/ADMIN) |
| `farmers` | Farm profiles linked to users |
| `products` | Produce listings |
| `orders` | Order records |
| `order_items` | Line items per order |
| `reviews` | Buyer reviews of farmers/products |
| `bulk_requests` | Bulk purchase requirements |
| `bulk_matches` | Farmer matches for bulk requests |
| `notifications` | In-app notifications |

---

## Matching Algorithm

The bulk buyer matching algorithm scores farmers 0–100 based on:

| Criterion | Weight |
|---|---|
| Product compatibility | 30% |
| Quantity compatibility | 25% |
| Distance | 20% |
| Price | 15% |
| Availability | 10% |

Results are ranked by total score. The breakdown and explanation are shown transparently to the buyer.

---

## Security

- Passwords hashed with bcrypt (12 rounds)
- Role-based route protection via middleware
- Server-side role verification on all API routes
- Session cookies: `HttpOnly`, `SameSite=Lax`, `Secure` in production
- Stock validation with database transactions (no overselling)
- Input validation with Zod on all forms and API routes
- Never trust client-side role values

---

## Production Deployment

1. Set all environment variables (see `.env.local`)
2. Replace `DATABASE_URL` with production PostgreSQL
3. Generate a strong `NEXTAUTH_SECRET`
4. Configure Cloudinary for image uploads (`lib/cloudinary.ts`)
5. Run `npm run build` and `npm start`

### Recommended platforms
- **Vercel** (optimal for Next.js)
- **Railway** or **Neon** for PostgreSQL

---

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run db:push      # Push schema to DB
npm run db:generate  # Generate migrations
npm run db:studio    # Drizzle Studio (DB GUI)
npm run db:seed      # Seed demo data
```

---

## License

MIT — For educational and demonstration use.
