# CashFlowCrew — Full-Stack Platform Documentation

> **Audience:** New developers onboarding to this codebase.  
> **Scope:** Architecture, directory structure, database models, API surface, authentication, payment flow, environment setup, and deployment.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Repository Layout](#3-repository-layout)
4. [Environment Variables](#4-environment-variables)
5. [Getting Started (Local Dev)](#5-getting-started-local-dev)
6. [Database — Prisma Schema](#6-database--prisma-schema)
7. [Route Groups & Pages](#7-route-groups--pages)
8. [API Reference](#8-api-reference)
9. [Authentication & Authorisation](#9-authentication--authorisation)
10. [Payment Flow — Cashfree](#10-payment-flow--cashfree)
11. [State Management](#11-state-management)
12. [File Uploads](#12-file-uploads)
13. [Admin Dashboard Integration](#13-admin-dashboard-integration)
14. [CORS & Middleware](#14-cors--middleware)
15. [SEO & Metadata](#15-seo--metadata)
16. [Deployment](#16-deployment)
17. [Key Conventions & Gotchas](#17-key-conventions--gotchas)

---

## 1. Project Overview

`ai-autual-fund-analysis` is the **main Next.js application** for the CashFlowCrew brand. It serves two distinct roles simultaneously:

| Role | Description |
|---|---|
| **Student-facing storefront** | Marketing pages, course catalogue, cart, checkout, and student dashboard |
| **Backend API server** | REST-style API routes consumed by this frontend AND the separate `admin-cashflowcrew` React/Vite admin panel |

The companion `admin-cashflowcrew` project (in the sibling folder) is a standalone Vite + React SPA that **has no own backend**. Every data operation it performs goes through the API routes in this Next.js app.

---

## 2. Tech Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 16 — App Router |
| Language | TypeScript 5 (strict) |
| Database | MongoDB (Atlas) via **Prisma 6** ORM |
| Auth | **NextAuth v5** (beta) with Prisma adapter |
| Payments | **Cashfree Payments** (SDK + server-side PG SDK) |
| Styling | **Tailwind CSS v4**, Radix UI, `class-variance-authority`, `tailwind-merge` |
| State | **Zustand** (cart store) |
| Forms | **React Hook Form** + **Zod** validation |
| Animations | **Framer Motion** |
| File Uploads | **UploadThing** + **Cloudinary** (dual provider) |
| Email templating | Custom templates via `nodemailer` / `@sendgrid` |
| Notifications | **Sonner** (toast library) |
| Analytics util | Custom UTM/session helpers in `src/lib/analytics-helper.ts` |

---

## 3. Repository Layout

```
ai-autual-fund-analysis/
├── prisma/
│   └── schema.prisma          # Single source of truth for all DB models
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router root
│   │   ├── (auth)/            # Sign-in / Sign-up pages
│   │   ├── (checkout)/        # Cart → Checkout → Order-status flow
│   │   ├── (marketing)/       # Public landing & blog pages
│   │   ├── (shop)/            # Course catalogue & detail pages
│   │   ├── (student)/         # Protected student dashboard
│   │   ├── api/               # All REST API endpoints
│   │   │   ├── admin/         # Admin-only endpoints (require ADMIN role)
│   │   │   ├── auth/          # NextAuth route handler
│   │   │   ├── payment/       # Cashfree initiate / verify / webhook
│   │   │   ├── uploadthing/   # UploadThing route handler
│   │   │   └── zwitch/        # Zwitch payment integration (legacy/alt)
│   │   ├── layout.tsx         # Root layout (fonts, theme, ToastProvider)
│   │   ├── globals.css        # Tailwind base + custom global styles
│   │   ├── robots.ts          # SEO: robots.txt generation
│   │   └── sitemap.ts         # SEO: dynamic sitemap generation
│   ├── components/            # Shared UI components
│   ├── config/
│   │   └── seo.ts             # siteConfig: base URL, OG image, description
│   ├── data/
│   │   └── courses.ts         # Static seed / helper data
│   ├── hooks/                 # Custom React hooks
│   ├── lib/
│   │   ├── dbPrisma.ts        # Prisma client singleton
│   │   ├── auth-admin.ts      # verifyAdmin() — DB-backed role check
│   │   ├── authDetails.ts     # getServerSideAuth() helper
│   │   ├── analytics-helper.ts# UTM param utilities
│   │   ├── cloudinary.ts      # Cloudinary SDK config
│   │   ├── PGinitialize.ts    # Cashfree JS SDK initialiser (client-side)
│   │   ├── trainer-central.ts # TrainerCentral API wrapper
│   │   └── utils.ts           # cn() and misc helpers
│   ├── middleware.ts           # Edge middleware — CORS headers
│   ├── server/
│   │   ├── actions/           # Next.js Server Actions (data fetching)
│   │   ├── auth/              # NextAuth config (auth.ts, providers, callbacks)
│   │   └── types/             # Shared TypeScript types
│   ├── store/
│   │   └── cart-store.ts      # Zustand cart store
│   └── Utils/                 # Misc pure utility functions
├── next.config.ts             # Image remote patterns, etc.
├── tsconfig.json
└── package.json
```

---

## 4. Environment Variables

Create a `.env.local` file at the project root. **Never commit this file.**

```env
# ── Database ──────────────────────────────────────────
DATABASE_URL="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority"

# ── NextAuth ──────────────────────────────────────────
NEXTAUTH_SECRET="a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"          # Change for production

# ── Cashfree Payments ─────────────────────────────────
CASHFREE_APP_ID="your_cashfree_app_id"
CASHFREE_SECRET_KEY="your_cashfree_secret_key"
NEXT_PUBLIC_CASHFREE_ENV="sandbox"            # "production" in prod

# ── Cloudinary ────────────────────────────────────────
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# ── UploadThing ───────────────────────────────────────
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your_app_id"

# ── Admin Panel (CORS whitelist) ──────────────────────
ADMIN_PANNEL_URL="http://localhost:5173"

# ── TrainerCentral ────────────────────────────────────
TRAINER_CENTRAL_API_KEY="tc_..."

# ── App URL ───────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 5. Getting Started (Local Dev)

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client (also runs automatically via postinstall)
npx prisma generate

# 3. (Optional) Push schema to a fresh DB
npx prisma db push

# 4. Start the dev server
npm run dev
```

The app runs at **http://localhost:3000**.  
The admin panel (`admin-cashflowcrew`) runs at **http://localhost:5173** and must point `VITE_SERVER_URL` at this Next.js app.

> **Prisma Studio** — run `npx prisma studio` to inspect your MongoDB data visually.

---

## 6. Database — Prisma Schema

All models live in `prisma/schema.prisma`. The database is **MongoDB** (NoSQL), but Prisma gives us full type safety.

### 6.1 Enums

| Enum | Values |
|---|---|
| `CourseType` | `RECORDED`, `LIVE`, `HYBRID` |
| `Role` | `USER`, `ADMIN` |
| `OrderStatus` | `PENDING`, `PAID`, `FAILED` |

### 6.2 Identity Models

#### `User`
Full account. Fields: `email`, `password` (hashed with bcrypt), `phone`, `image`, `role` (USER/ADMIN). Relations: `Cart`, `Order[]`, `Purchase[]`, `Blog[]`. NextAuth `Account` and `Session` models hang off this.

#### `Lead`
Lightweight guest record — captured during checkout or marketing forms. Fields: `email`, `name`, `phone`, `source`. No password. An `Order` can belong to **either a `User` or a `Lead`** (both FK fields are optional, one must be set).

#### `Account` / `Session` / `VerificationToken`
Standard NextAuth v5 models managed automatically by `@auth/prisma-adapter`.

### 6.3 Course Ecosystem

#### `Course`
The central product entity.

| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `subHeading` | String? | Optional subtitle |
| `description` | String | Short text summary |
| `content` | String? | Rich HTML from Tiptap editor |
| `thumbnail` | String? | Image URL (Cloudinary/UploadThing) |
| `price` | Float | Selling price in INR |
| `originalPrice` | Float? | "Strike-through" compare-at price |
| `type` | `CourseType` | RECORDED / LIVE / HYBRID |
| `status` | String | `"Available"` or `"Coming Soon"` |
| `isPublished` | Boolean | Hide from shop when false |
| `visibility` | String | `"show"` / `"hide"` (admin toggle) |
| `slug` | String (unique) | URL-friendly identifier |
| `staticRoute` | String? | Optional custom URL override |
| `tcCourseId` | String (unique) | TrainerCentral external course ID |
| `tcCourseUrl` | String? | TrainerCentral direct enrolment URL |
| `startDate` | DateTime? | For LIVE / HYBRID sessions |
| `duration` | String? | e.g. `"2 Hours"` |
| `maxSeats` | Int? | Seat cap for live events |
| `seatsSold` | Int | Auto-incremented on purchase |
| `theme` | String | `"standard"` (reserved for UI variants) |

#### `Category`
Simple `{ id, name }` model. Each Course belongs to one Category.

#### `Cart` & `CartItem`
One `Cart` per `User` (1-to-1). `CartItem` joins a Cart to a Course.

### 6.4 Order & Payment Flow

```
User/Lead clicks "Checkout"
        │
        ▼
  POST /api/payment/cashfree/initiate
  ── creates Order (PENDING) + OrderItems
  ── calls Cashfree API → receives payment_session_id
        │
        ▼
  Cashfree payment UI (redirect / SDK drop-in)
        │
        ▼
  Cashfree calls POST /api/payment/cashfree/webhook (server-side)
  ── verifies signature
  ── creates PaymentTransaction record
  ── updates Order.status → PAID or FAILED
  ── creates Purchase record (gives user course access)
  ── sends confirmation email
        │
        ▼
  User lands on /order-status?orderId=...
  GET /api/payment/cashfree/verify
  ── polled by client to get final status
```

#### `Order`
| Field | Notes |
|---|---|
| `userId` / `leadId` | One must be set — supports both registered and guest users |
| `guestEmail` / `guestPhone` | Snapshot backup (in case Lead record is deleted) |
| `utmSource/Medium/Campaign/Term/Content` | Full UTM attribution stored at order creation |
| `couponId` | Link to applied `Coupon` |
| `discountAmount` | Calculated at checkout |
| `orderId` | Cashfree's CF order ID (unique) |
| `bundleItems` | List of `BundleOrderItem` records associated with this order |

#### `PaymentTransaction`
Stores the raw Cashfree webhook payload (`rawResponse: Json`), `paymentMethod` (UPI/CARD/NET_BANKING), and `status` string.

#### `Purchase`
Final access record: `{ userId, courseId }` with a `@@unique` constraint — prevents double purchases.

### 6.5 Supporting Models

| Model | Purpose |
|---|---|
| `Bundle` | Represents a collection of courses sold together. Includes pricing, feature lists, and an array of `courseIds`. |
| `BundleOrderItem` | A junction model linking an `Order` to a purchased `Bundle`. |
| `Coupon` | Discount codes with `PERCENTAGE` or `FIXED` types, expiry, usage limits, and optional `applicableCourseIds` or `applicableBundleIds` |
| `NotificationRequest` | Waitlist for Coming Soon courses — stores `email + courseId` (unique pair) |
| `Image` | Central store for uploaded image metadata (UploadThing `key`, URL, etc.) |
| `Blog` | Admin-authored blog posts with SEO fields (`seoTitle`, `seoDesc`), `tags[]`, and rich HTML `content` |

---

## 7. Route Groups & Pages

Next.js **route groups** (parenthesised folders) let us share layouts without affecting the URL.

### `(auth)` — `/sign-in`, `/sign-up`
Public auth pages. These use the server-side NextAuth flow and custom credential providers.

### `(marketing)` — `/`
Public-facing marketing pages. Includes:
- `/` — Homepage with Hero, Features, Testimonials, FAQ
- `/blogs` and `/blogs/[slug]` — Blog listing & detail
- `/contact-us`, `/privacy-policy`, `/terms-conditions`, `/refund-policy`, `/delivery-policy`
- `/ai-mutual-fund`, `/ai-mutual-fund-workshop`, `/master-mutual-funds` — Specific campaign landing pages

### `(shop)` — `/courses`, `/courses/[slug]`, `/cart`
Course discovery and detail. The `[slug]` page:
- Uses `course.thumbnail` as a full-bleed hero background when available
- Renders `course.content` (rich HTML) via a `dangerouslySetInnerHTML` prose block
- Falls back to plain `course.description` when `content` is absent

### `(checkout)` — `/checkout`, `/order-status`
Protected checkout flow. Requires a session or guest email. Reads the Zustand cart store and calls `/api/payment/cashfree/initiate`.

### `(student)` — `/dashboard`
Protected student area. Shows purchased courses with TrainerCentral access links.

---

## 8. API Reference

All routes live under `/src/app/api/`. Admin routes require an active `ADMIN`-role session (verified by `verifyAdmin(req)` in `src/lib/auth-admin.ts`).

### 8.1 Public / Auth APIs

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/[...nextauth]` | NextAuth handler (sign-in, sign-out, session) |
| `GET` | `/api/uploadthing` | UploadThing file endpoint |
| `POST` | `/api/uploadthing` | UploadThing file upload |

### 8.2 Payment APIs

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/payment/cashfree/initiate` | Create Cashfree order, return `payment_session_id` |
| `POST` | `/api/payment/cashfree/webhook` | Cashfree server-to-server webhook — updates order and creates Purchase |
| `GET` | `/api/payment/cashfree/verify` | Polled by client to get final order status |

### 8.3 Admin APIs (`/api/admin/*`)

All require `role === "ADMIN"`.

#### Masterclass (Course) Management
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/masterclass/all-classes` | List all courses |
| `POST` | `/api/admin/masterclass/create` | Create a new course |
| `PATCH` | `/api/admin/masterclass/update/[masterclassId]` | Partial update — only provided fields are written |
| `DELETE` | `/api/admin/masterclass/delete/[masterclassId]` | Delete a course |
| `GET` | `/api/admin/masterclass/[masterclassId]` | Get course detail + waitlist |
| `GET` | `/api/admin/masterclass/myclasses` | Courses visible to current user |

#### Bundle Management
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/bundles` | List all active combinations of course bundles |
| `POST` | `/api/admin/bundles` | Create a new bundle |
| `PATCH` | `/api/admin/bundles/[id]` | Update bundle information and pricing |

**Update route field behaviour:**  
`nullableStringFields` (including `content`, `description`, `thumbnail`, etc.) are set to `null` when explicitly sent as `null` — this allows clearing a field. Fields **absent** from the request body are ignored entirely (no accidental overwrites).

#### Category Management
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/category` | List all categories |
| `POST` | `/api/admin/category` | Create category |
| `PATCH` / `DELETE` | `/api/admin/category/[id]` | Update / delete |

#### Users & Orders
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/get-all-users` | Paginated user list |
| `GET` | `/api/admin/users-with-all-transactions` | Users enriched with purchase history |
| `GET` | `/api/admin/all-users-transaction` | All transactions |
| `GET` | `/api/admin/orders` | All orders |

#### Analytics
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/dashboard-stats` | Revenue, order counts, new users |
| `GET` | `/api/admin/payment-analytics` | Payment success/failure breakdown |
| `GET` | `/api/admin/registration-trends` | Sign-up trends over time |
| `GET` | `/api/admin/session-analytics` | Session and engagement metrics |

#### Other Admin
| Method | Path | Description |
|---|---|---|
| `GET/POST/PATCH/DELETE` | `/api/admin/blogs` | Blog CRUD |
| `GET/POST/DELETE` | `/api/admin/images` | Image library CRUD |
| `GET/POST/PATCH/DELETE` | `/api/admin/coupons` | Coupon management |
| `GET` | `/api/admin/notifications` | Waitlist notification requests |
| `GET` | `/api/admin/is-admin` | Quick role check used by admin SPA on init |

---

## 9. Authentication & Authorisation

### How sessions work
NextAuth v5 is configured in `src/server/auth/auth.ts`. It uses:
- **Credentials provider** — email/password (bcrypt-hashed, stored on `User.password`)
- **Prisma adapter** — sessions stored in `Session` collection in MongoDB

### `verifyAdmin(req)` — `src/lib/auth-admin.ts`
Every admin API route calls this helper. It:
1. Reads the current session via `auth()`.
2. **Re-queries the DB** to confirm `user.role === "ADMIN"` is still current (prevents stale session privilege escalation).
3. Returns the full user record on success or `null` on failure.

```ts
// Pattern used in every /api/admin/* route:
const admin = await verifyAdmin(req);
if (!admin) return NextResponse.json({ message: "Access denied" }, { status: 403 });
```

### Route protection (middleware)
`src/middleware.ts` handles CORS headers for the allowed origins list. Page-level protection for the student dashboard and checkout is done server-side via `getServerSideAuth()` in `src/lib/authDetails.ts`.

---

## 10. Payment Flow — Cashfree

### Client-side SDK
`src/lib/PGinitialize.ts` lazily initialises the Cashfree JS SDK (sandbox in development, production in deploy). It memoises the instance so the SDK is only loaded once per page session.

### End-to-end flow

```
1. User clicks "Enroll Now"
      │
      ▼
2. Client calls POST /api/payment/cashfree/initiate
   Body: { courseIds[], couponCode?, utmParams }
   ── Validates coupon (if any)
   ── Creates Order (PENDING) + OrderItems
   ── Calls Cashfree backend SDK: createOrder()
   ── Returns { payment_session_id, orderId }
      │
      ▼
3. Client mounts Cashfree drop-in or redirects
   cashfree.checkout({ paymentSessionId })
      │
      ▼
4. Cashfree calls our webhook: POST /api/payment/cashfree/webhook
   ── Verifies HMAC signature (using CASHFREE_SECRET_KEY)
   ── Creates PaymentTransaction record
   ── On SUCCESS:
       • Order.status = PAID
       • Creates Purchase records
       • Sends confirmation email
   ── On FAILURE:
       • Order.status = FAILED
      │
      ▼
5. User is redirected to /order-status?orderId=CF_...
   ── Client polls GET /api/payment/cashfree/verify?orderId=...
   ── Shows success/failure UI
```

> **Important:** Course access is granted **only** via the webhook (`Purchase` creation). Never trust the client-side redirect alone.

---

## 11. State Management

Only the **cart** uses global client state. Everything else is server-rendered or fetched per-component.

### `src/store/cart-store.ts` (Zustand)
```ts
// Key shape:
{
  items: CartItem[],           // { courseId, title, price, thumbnail }
  addItem(item): void,
  removeItem(courseId): void,
  clearCart(): void,
  totalPrice: number,          // computed
}
```
The cart is **persisted to `localStorage`** via Zustand's `persist` middleware so it survives page refreshes.

---

## 12. File Uploads

Two upload providers are used:

| Provider | Usage | Config file |
|---|---|---|
| **UploadThing** | Primary — used from admin panel (course thumbnails, blog images, image library) | `src/app/api/uploadthing/` |
| **Cloudinary** | Secondary — used for some legacy upload flows | `src/lib/cloudinary.ts` |

Uploaded images are recorded in the `Image` model for centralised library management accessible at `/api/admin/images`.

Allowed image hostnames in `next.config.ts`:
- `images.unsplash.com`
- `res.cloudinary.com`
- `utfs.io` (UploadThing CDN)
- `y6aq91jvva.ufs.sh` (UploadThing app-specific CDN)

---

## 13. Admin Dashboard Integration

The `admin-cashflowcrew` folder is a **separate Vite + React SPA**. It has no backend of its own. Every API call it makes goes to this Next.js app.

### Key integration points

| Admin Feature | API endpoint in this app |
|---|---|
| Login check | `GET /api/admin/is-admin` (uses shared NextAuth session cookie) |
| Course management | `/api/admin/masterclass/*` |
| Blog management | `/api/admin/blogs/*` |
| Order viewer | `/api/admin/orders` |
| Coupon management | `/api/admin/coupons/*` |
| Bundle management | `/api/admin/bundles` |
| Image library | `/api/admin/images` |
| Dashboard stats | `/api/admin/dashboard-stats` & `/payment-analytics` & `/registration-trends` |

### Authentication between apps
Both apps share the same domain in production, so the NextAuth session cookie is accessible cross-app. In local development, set `ADMIN_PANNEL_URL=http://localhost:5173` in the env and ensure the admin app's `VITE_SERVER_URL` points to `http://localhost:3000`.

---

## 14. CORS & Middleware

`src/middleware.ts` intercepts **all requests** and sets CORS headers for the configured origin whitelist:

```ts
const allowedOrigins = [
  "http://localhost:5173",           // Admin dev
  "https://www.cashflowcrew.in",     // Production frontend
  "https://admin-cashflowcrew.vercel.app",
  process.env.ADMIN_PANNEL_URL,      // Dynamic override
];
```

- `OPTIONS` (preflight) requests are handled with `Access-Control-Max-Age: 86400` (24 h cache).
- Credentials (`withCredentials: true` in admin Axios calls) are supported via `Access-Control-Allow-Credentials: true`.

---

## 15. SEO & Metadata

### `src/config/seo.ts`
Central `siteConfig` object:
```ts
export const siteConfig = {
  name: "CashFlowCrew",
  url: "https://www.cashflowcrew.in",
  ogImage: "https://...",
  description: "...",
};
```

### Dynamic Metadata
Every page that needs dynamic OG tags (course pages, blog pages) exports a `generateMetadata()` async function following Next.js App Router conventions. It fetches the entity and builds `openGraph` and `twitter` metadata objects.

### `robots.ts` and `sitemap.ts`
- `robots.ts` — exported `GET` handler returning a `MetadataRoute.Robots` object.
- `sitemap.ts` — queries all published courses and blogs, returns a `MetadataRoute.Sitemap` array for Google indexing.

---

## 16. Deployment

The primary deployment target is **Vercel**.

### Build command
```bash
prisma generate && next build
```
`prisma generate` is run before every build (also via `postinstall`) to ensure the Prisma client matches the schema.

### Environment variables on Vercel
Set all variables from [§4](#4-environment-variables) in the Vercel project settings. Use separate values for production vs. preview environments (especially `CASHFREE_APP_ID`, `NEXTAUTH_URL`, and `NEXT_PUBLIC_CASHFREE_ENV`).

### `vercel.json` (admin panel)
The admin SPA (`admin-cashflowcrew`) has a `vercel.json` with a catch-all rewrite so client-side routing works:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## 17. Key Conventions & Gotchas

### Prisma singleton
`src/lib/dbPrisma.ts` exports a single `dataBasePrisma` instance using the standard Next.js hot-reload singleton pattern. Always import from here — never `new PrismaClient()` directly.

### Partial updates — admin PATCH routes
The masterclass update route (and similar admin PATCH routes) use an explicit field-inclusion pattern:
```ts
// Field is included → write to DB (even if null, to clear it)
if ("fieldName" in body) updateData.fieldName = body.fieldName ?? null;

// Field absent from body → not included → Prisma leaves DB value untouched
```
This prevents accidental data loss when the admin UI sends only changed fields.

### Guest vs. User checkout
Both `Order.userId` and `Order.leadId` are optional — but exactly one should be set. The `guestEmail` / `guestPhone` fields are snapshot backups in case the `Lead` record is ever cleaned up.

### TrainerCentral course access
After a successful purchase, the webhook triggers `trainer-central.ts` to enrol the student directly on TrainerCentral using `tcCourseId`. Students access course content on the TrainerCentral platform via `tcCourseUrl`.

### `force-dynamic` on data pages
Pages that render personalised or frequently-updated data (course detail, dashboard) set `export const dynamic = 'force-dynamic'` to bypass Next.js static caching and always render fresh.

### Image domains
If you use a new CDN or image host, add it to the `remotePatterns` array in `next.config.ts`. Failing to do so will result in a 400 error from `next/image`.

---

*Last updated: March 2026*
- `/src/app/(checkout)`: Manages the checkout cart UI and integration with the Cashfree JS SDK.
- `/src/app/(marketing)`: The public face of the app. Landing pages, about us, features. Designed for high SEO and performance.
- `/src/app/(shop)`: Course catalogs and individual course detail pages (PDPs).
- `/src/app/(student)`: The protected dashboard where a user can see their purchased courses and access the integrated learning materials (e.g., TrainerCentral links).
- `/src/components`: Reusable UI components. Many are likely based on "shadcn/ui" patterns (radix-ui + tailwind).
- `/src/lib`: Utility functions, Prisma database client setup, and external service configurations (Zwitch, Cashfree sdk wrapper).

---

## 🔌 4. API Layer (`src/app/api`)

The Next.js app acts as the backend for both itself and the React/Vite Admin SPA.

### `/api/auth`
Handles NextAuth.js endpoints for sessions, callbacks, and providers.

### `/api/payment/cashfree`
- `/initiate`: Receives a cart or course ID, calculates total, applies coupons, creates a `PENDING` Order in the DB, and calls the Cashfree S2S API to generate a payment session ID to return to the frontend.
- `/verify`: The critical webhook endpoint. Listens to Cashfree's servers. Verifies the signature, updates `Order` and `PaymentTransaction`, and provisions `Purchase` access.

### `/api/admin/*`
These routes are protected by checking for the `ADMIN` role. They are primarily consumed by the `admin-cashflowcrew` Vite app.
- `/dashboard-stats`: Aggregates complex MongoDB queries for the admin charts.
- `/get-all-users`: Returns paginated lists of `User` and `Lead` records.
- `/masterclass`: Admin CRUD operations for `Course` items.
- `/orders` & `/coupons`: Management APIs for transactions and discounts.

### `/api/zwitch` & `/api/uploadthing`
- **Zwitch**: Endpoints handling integration with external communication or video tools (depends on specific feature logic).
- **UploadThing**: Endpoint for securely passing image/file uploads directly to the cloud.

---

## 🚀 5. Getting Started locally

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd ai-autual-fund-analysis
   ```

2. **Environment Setup**
   Copy `.env.example` to `.env`. Ensure you have:
   - `DATABASE_URL` (MongoDB Atlas or local URI)
   - `AUTH_SECRET` (For NextAuth)
   - `CASHFREE_APP_ID` & `CASHFREE_SECRET_KEY` (Sandbox credentials for dev)
   - `UPLOADTHING_SECRET` & `UPLOADTHING_APP_ID`

3. **Install and Sync Database**
   ```bash
   npm install
   # Generate Prisma client based on the schema
   npm run postinstall 
   # Or explicitly: npx prisma generate
   ```

4. **Run the server**
   ```bash
   npm run dev
   ```
   Access at `http://localhost:3000`.

5. **Viewing Data**
   Use Prisma Studio to directly interact with your local DB:
   ```bash
   npx prisma studio
   ```

## 🤝 Contributing Guidelines
- **Strict Typing**: Always define interfaces or Zod schemas for API responses and component props. Avoid `any`.
- **Components**: Adhere to the atomic design principle. Use `cva` to define component variants.
- **Server vs Client Components**: Default to Server Components in `app/`. Only use `"use client"` when you need hooks (`useState`, `useEffect`) or interact with browser APIs (like the Cashfree SDK).

Welcome to the team!
