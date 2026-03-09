# Cashflowcrew Complete Project Documentation

Welcome to the **Cashflowcrew** Frontend and API repository! This document is designed to give new developers a deep, comprehensive look into the architecture, design choices, API structure, and database models of the application.

This project is built using Next.js 16 (App Router) and serves as the primary gateway for users (students and leads) as well as providing the backend API for both this platform and the separate Admin Dashboard (`admin-cashflowcrew`).

---

## 🏗️ 1. Architecture & Tech Stack Overview

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict mode)
- **Database Architecture**: MongoDB (NoSQL) accessed via Prisma ORM for type safety.
- **Styling ecosystem**: Tailwind CSS (v4), integrating Radix UI primitives, `class-variance-authority` (cva), and `tailwind-merge` for robust, reusable UI components.
- **Authentication**: NextAuth (v5 beta) handling sessions alongside custom verification flows.
- **Payment Gateway Integration**: Cashfree Payments.
- **Global State**: Zustand for client-side state.
- **Form validation**: React Hook Form combined with Zod schemas.
- **File Storage/Uploads**: UploadThing integration.

---

## 🗄️ 2. Database Models (Prisma `schema.prisma`)
Understanding the database is critical. Here is a breakdown of our core models:

### Users vs. Leads
The system distinguishes between people who have fully registered (`User`) and users we captured email/phone information for during the checkout or newsletter process (`Lead`).

- `User`: Has a full account (`email`, `password`, `NextAuth Session/Account`), can possess a `Cart`, buy multiple `Courses` (tracked in `Purchase`), and write `Blogs` (if Admin).
- `Lead`: A lightweight record (`email`, `phone`, `name`) for tracking guest checkouts and marketing funnels without requiring an account creation.

### The Course Ecosystem
- `Course`: The core entity. It can be of `CourseType` (`RECORDED`, `LIVE`, `HYBRID`). It ties directly into an external platform via `tcCourseId` (TrainerCentral ID).
- `Category`: Groups courses.
- `Cart` & `CartItem`: Handles the pre-checkout state for `User`s.

### The Checkout & Payment Flow
- `Order`: Central to the checkout process. An order can be linked to **EITHER** a `User` or a `Lead`. It tracks `utm` parameters for marketing analytics and holds the final `totalAmount`.
- `OrderItem`: Links an `Order` to a specific `Course`.
- `PaymentTransaction`: Represents the actual interaction with Cashfree. Records the `paymentGateway`, `status` (SUCCESS/FAILED/etc.), and `rawResponse` from the gateway.

*Key Concept:* When a user initiates checkout, an `Order` is created first in a `PENDING` state. Once the Cashfree webhook hits the `/api/payment/cashfree/verify` endpoint, the `PaymentTransaction` is logged, and the `Order` status is moved to `PAID`. Finally, a `Purchase` record is created, giving the user access to the course.

---

## 📁 3. Project File Structure (`src/app`)

The App Router allows us to segregate logical zones using route groups (folders inside parentheses).

- `/src/app/(auth)`: Contains login, registration, and password recovery pages.
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
