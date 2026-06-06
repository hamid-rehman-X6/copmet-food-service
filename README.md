# Copmet Food Service

A full-stack frozen food service web application built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, and **PostgreSQL**. The platform enables customers to browse homemade frozen meals, build a freezer cart, place cold-packed delivery orders, and track deliveries in real time, while an admin panel provides operators with dashboards, order management, frozen catalog editing, and customer oversight.

> **Status**: Active development - authentication module is production-ready; frozen menu, checkout, and order-tracking modules are currently using static data and will be wired to the database in upcoming iterations.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Modules](#modules)
  - [Authentication](#authentication)
  - [Home Page](#home-page)
  - [Menu](#menu)
  - [Checkout & Cart](#checkout--cart)
  - [Order Tracking](#order-tracking)
  - [About Page](#about-page)
  - [Admin Panel](#admin-panel)
- [API Reference](#api-reference)
- [Design System](#design-system)
- [License](#license)

---

## Features

- **Customer Authentication** — Signup, login, logout, token refresh, and session management with secure HttpOnly cookie-based JWTs.
- **Admin Authentication** — Environment-variable-based admin credentials with timing-safe comparison and dedicated admin login flow.
- **Frozen Menu Browsing** — Category filtering, dietary filters (Vegan, GF, Organic, Nut-Free), and multiple sort modes (popular, newest, price, rating).
- **Freezer Cart** — Client-side cart powered by Zustand with localStorage persistence, quantity controls, and automatic total calculations.
- **Checkout** — Frozen order summary with delivery fee logic, reward points calculation, and a customer information form.
- **Order Tracking** — Cold-packed delivery status timeline, courier information, order summary breakdown, and an interactive map placeholder.
- **Admin Dashboard** — Metric cards for revenue, orders, and customers; recent frozen orders table; popular freezer items panel.
- **Admin Management** — Dedicated pages for managing orders, frozen catalog items, and customer records with searchable tables.
- **Responsive Design** — Mobile-first layouts with a warm, organic "Modern Organic" design system using Quicksand and Be Vietnam Pro fonts.
- **Middleware Protection** — Admin routes are guarded by a Next.js middleware proxy that validates JWT tokens before allowing access.

---

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Framework** | Next.js 16.2 (App Router, Turbopack) | Full-stack React framework with file-based routing |
| **Language** | TypeScript 5 | Type-safe development across client and server |
| **Styling** | Tailwind CSS 4 | Utility-first styling via PostCSS |
| **Database** | PostgreSQL | Relational data storage for users and sessions |
| **ORM / Queries** | `pg` (node-postgres) | Raw parameterized SQL queries |
| **Authentication** | `jose` + `bcryptjs` | JWT signing/verification and password hashing |
| **Validation** | Zod 4 | Shared request/form schemas (server + client) |
| **Forms** | React Hook Form + `@hookform/resolvers` | Form state management with Zod integration |
| **State Management** | Zustand | Lightweight client-side store for cart state |
| **Utilities** | `clsx` | Conditional CSS class merging |
| **Images** | Unsplash (remote) | Food photography served from `images.unsplash.com` |

---

## Project Structure

```
copmet-food-service/
├── database/
│   └── migrations/              # Sequentially numbered SQL migration files
│       └── 001_auth.sql         # Users, refresh_sessions, and schema_migrations tables
├── docs/
│   └── backend.md               # Backend architecture and API documentation
├── public/
│   └── images/                  # Static image assets (logos, food photography)
├── scripts/
│   └── migrate.mjs              # Custom PostgreSQL migration runner
├── src/
│   ├── app/                     # Next.js App Router pages and API routes
│   │   ├── (admin-auth)/        # Admin authentication layout group
│   │   │   └── admin/login/     # Admin login page
│   │   ├── (auth)/              # Customer authentication layout group
│   │   │   ├── login/           # Customer login page
│   │   │   └── signup/          # Customer signup page
│   │   ├── about/               # About page
│   │   ├── admin/               # Admin panel (middleware-protected)
│   │   │   ├── customers/       # Customer management page
│   │   │   ├── menu/            # Menu management page
│   │   │   ├── orders/          # Order management page
│   │   │   └── page.tsx         # Admin dashboard
│   │   ├── api/v1/              # Versioned REST API
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   │   ├── admin-login/ # POST — Admin login
│   │   │   │   ├── login/       # POST — Customer login
│   │   │   │   ├── logout/      # POST — Session logout
│   │   │   │   ├── me/          # GET  — Current user
│   │   │   │   ├── refresh/     # POST — Token rotation
│   │   │   │   └── signup/      # POST — Customer registration
│   │   │   └── health/          # GET  — Health check
│   │   ├── checkout/            # Checkout page
│   │   ├── menu/                # Menu browsing page
│   │   └── track-order/         # Order tracking page
│   ├── components/              # React UI components
│   │   ├── admin/               # Admin panel components
│   │   ├── auth/                # Authentication components
│   │   ├── checkout/            # Checkout components
│   │   ├── common/              # Shared/reusable components
│   │   ├── home/                # Home page sections
│   │   ├── layout/              # Header and footer
│   │   ├── menu/                # Menu browsing components
│   │   └── tracking/            # Order tracking components
│   ├── constants/               # Static data and configuration constants
│   ├── lib/                     # Client-side utilities
│   │   ├── api-client.ts        # Fetch wrapper with auto-refresh on 401
│   │   ├── cart.ts              # Cart calculation helpers
│   │   ├── formatters.ts        # Currency formatting
│   │   └── utils.ts             # Class name utility (cn)
│   ├── proxy.ts                 # Next.js middleware for admin route protection
│   ├── schemas/                 # Zod validation schemas (shared client/server)
│   ├── server/                  # Server-only code
│   │   ├── api/                 # API framework (handler, errors, request, response)
│   │   ├── auth/                # Authentication module
│   │   ├── config/              # Environment variable config
│   │   └── db/                  # PostgreSQL connection pool
│   ├── stores/                  # Zustand state stores
│   └── types/                   # TypeScript type definitions
├── .env.example                 # Environment variable template
├── DESIGN.md                    # Full design system specification
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies and scripts
└── tsconfig.json                # TypeScript configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **PostgreSQL** 14 or later (local or remote)
- **npm** (included with Node.js)

### Environment Variables

Copy the example environment file and fill in all values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `JWT_ACCESS_SECRET` | ✅ | Secret for signing access JWTs (minimum 32 characters) |
| `JWT_REFRESH_SECRET` | ✅ | Secret for signing refresh JWTs (minimum 32 characters, must differ from access secret) |
| `APP_URL` | ✅ | Public URL of the application (e.g., `http://localhost:3000`) |
| `ADMIN_EMAIL` | ✅ | Email address for the environment-based admin account |
| `ADMIN_PASSWORD` | ✅ | Password for the environment-based admin account |
| `DB_HOST` | ✅ | PostgreSQL host (e.g., `localhost`) |
| `DB_PORT` | ✅ | PostgreSQL port (e.g., `5432`) |
| `DB_NAME` | ✅ | Database name |
| `DB_USER` | ✅ | Database user |
| `DB_PASSWORD` | ✅ | Database password |
| `DB_SSL` | ❌ | Set to `true` to enable SSL connections (default: `false`) |

> **Security note**: Generate JWT secrets with a cryptographically secure password generator. Each secret must be unique and at least 32 characters long.

### Installation

```bash
# Install dependencies
npm install

# Create the database (PostgreSQL CLI)
createdb copmet_food_service

# Run database migrations
npm run db:migrate

# Start the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| **Dev** | `npm run dev` | Start the Next.js development server with Turbopack |
| **Build** | `npm run build` | Create a production-optimized build |
| **Start** | `npm start` | Serve the production build |
| **Lint** | `npm run lint` | Run ESLint across the codebase |
| **Migrate** | `npm run db:migrate` | Apply pending PostgreSQL migrations from `database/migrations/` |

---

## Modules

### Authentication

> **Status**: ✅ Production-ready — Fully wired to PostgreSQL

The authentication system implements a complete JWT-based session flow with refresh-token rotation, stored in HttpOnly cookies.

**Customer Flow:**
- **Signup** — Validates input with Zod, hashes the password with bcrypt (12 salt rounds), creates the user and refresh session in a single transaction, sets auth cookies.
- **Login** — Verifies credentials, checks account active status, creates a new token session, and records the login timestamp.
- **Token Refresh** — Rotates the refresh token, issues a new access token, detects replay attacks and revokes the entire token family if compromised.
- **Logout** — Revokes the active refresh session and clears all auth cookies. Idempotent.
- **Session Check (`/me`)** — Returns the currently authenticated user from a valid access token.

**Admin Flow:**
- **Admin Login** — Authenticates against environment variables using timing-safe comparison. Issues only an access token (no refresh session).
- **Middleware Guard** — The `proxy.ts` middleware intercepts all `/admin/*` routes and validates the JWT before allowing access. Unauthenticated requests are redirected to `/admin/login`.

**Key Components:**
| Component | Path | Description |
| --- | --- | --- |
| `AuthProvider` | `src/components/auth/AuthProvider.tsx` | React context providing `user`, `loading`, `setUser`, and `logout` |
| `LoginForm` | `src/components/auth/LoginForm.tsx` | Customer login form with React Hook Form + Zod |
| `SignupForm` | `src/components/auth/SignupForm.tsx` | Customer signup form with password confirmation |
| `AdminLoginForm` | `src/components/auth/AdminLoginForm.tsx` | Admin login form |
| `AuthSidebar` | `src/components/auth/AuthSidebar.tsx` | Decorative sidebar for auth pages |
| `AuthField` | `src/components/auth/AuthField.tsx` | Reusable form field component |
| `AuthFormAlert` | `src/components/auth/AuthFormAlert.tsx` | Error/success alert for auth forms |

---

### Home Page

> **Path**: `/`

The landing page showcases the food service brand with five modular sections:

| Section | Component | Description |
| --- | --- | --- |
| **Hero** | `HomeHero` | Full-width hero banner with headline, CTA, and food imagery |
| **Featured Meals** | `FeaturedMeals` | Grid of highlighted dishes with images, prices, and ratings |
| **How It Works** | `HowItWorks` | Three-step process explaining the ordering flow |
| **Community** | `CommunitySection` | Social proof section with customer testimonials |
| **Newsletter CTA** | `NewsletterCta` | Email subscription call-to-action |

Also includes the `SiteHeader` (with search bar) and `SiteFooter` layout components, plus a floating chat button.

---

### Frozen Menu

> **Path**: `/menu`

A filterable, sortable frozen meal browsing experience with sidebar controls.

| Component | Description |
| --- | --- |
| `MenuBrowser` | Main container with search, category selection, dietary filters, and sort options |
| `MenuCard` | Individual frozen meal card displaying image, name, description, price, rating, and dietary tags |
| `MenuSidebar` | Sidebar panel with freezer categories, filter chips, and sort dropdown |

**Features:**
- Filter by category: All Dishes, Family Packs, Mains, Sides, Breakfast, Desserts
- Filter by dietary tags: Vegan, GF, Organic, Nut-Free
- Sort by: Popular, Newest, Price (Low–High, High–Low), Rating
- Add to freezer cart directly from menu cards

---

### Checkout & Cart

> **Path**: `/checkout`

The checkout page combines a frozen order summary with a customer information form.

| Component | Description |
| --- | --- |
| `OrderSummary` | Displays freezer cart items with quantity controls, subtotal, delivery fee, total, and reward points |
| `CheckoutForm` | Customer information form with name, email, phone, and address fields |

**Cart Logic:**
- **Store** (`cart.store.ts`): Zustand store with `persist` middleware, saving to `localStorage` under the key `copmet-cart`
- **Operations**: `addItem`, `increaseQuantity`, `decreaseQuantity`, `removeItem`, `clearCart`
- **Calculations** (`cart.ts`): Free delivery threshold, configurable delivery fee, and reward points per dollar

---

### Order Tracking

> **Path**: `/track-order`

A real-time order tracking interface with four components:

| Component | Description |
| --- | --- |
| `ArrivalStatus` | Estimated arrival time and delivery progress steps (Packed Frozen -> Out for Delivery -> In Your Freezer) |
| `CourierCard` | Courier profile with name, rating, total deliveries, and contact action |
| `TrackingMap` | Map placeholder for live delivery visualization |
| `TrackingSummary` | Order ID, item breakdown, and total |

---

### About Page

> **Path**: `/about`

A brand story page that shares the company mission, freezer-ready values, and team information. Content is driven by constants in `about.constants.ts`.

---

### Admin Panel

> **Path**: `/admin` (middleware-protected)

A full-featured administration interface for managing frozen food service operations.

**Dashboard** (`/admin`):
- Metric cards showing total revenue, active orders, customer count, and average order value
- Recent orders table with status badges
- Popular freezer items panel with images and pricing

**Orders Management** (`/admin/orders`):
- Searchable orders table with order ID, customer, items, total, date, and status
- Status badges: Packing Frozen, Cold Delivery, Delivered, Cancelled

**Frozen Catalog** (`/admin/menu`):
- Full frozen item table with images, names, categories, prices, and status
- Status indicators: Active, Inactive, Out of Stock, Draft

**Customer Management** (`/admin/customers`):
- Customer records table with name, email, order count, total spent, join date, and status

**Admin Components:**
| Component | Description |
| --- | --- |
| `AdminShell` | Layout wrapper with sidebar and header |
| `AdminSidebar` | Navigation sidebar with links to Dashboard, Orders, Menu, Customers |
| `AdminHeader` | Top bar with search, user info, and logout action |
| `AdminPageHeader` | Page title with eyebrow text and description |
| `AdminMetricCard` | Individual KPI card with icon, value, change indicator |
| `AdminMetricGrid` | Responsive grid layout for metric cards |
| `AdminTableShell` | Scrollable table container with summary footer |
| `AdminStatusBadge` | Color-coded status indicator with tonal styling |

---

## API Reference

All endpoints are versioned under `/api/v1`. Detailed request/response schemas and security documentation are available in [docs/backend.md](docs/backend.md).

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/signup` | Public | Create a customer account and session |
| `POST` | `/api/v1/auth/login` | Public | Authenticate a customer and create a session |
| `POST` | `/api/v1/auth/admin-login` | Public | Authenticate an admin with env credentials |
| `POST` | `/api/v1/auth/refresh` | Cookie | Rotate refresh token, issue new access token |
| `POST` | `/api/v1/auth/logout` | Cookie | Revoke refresh session, clear auth cookies |
| `GET` | `/api/v1/auth/me` | Cookie | Return the currently authenticated user |

### Utility Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/v1/health` | Public | Confirm API availability with timestamp |

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Request completed successfully.",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Please correct the invalid fields.",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": { ... }
  }
}
```

**Error Codes:** `VALIDATION_ERROR` (422), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `BAD_REQUEST` (400), `INTERNAL_SERVER_ERROR` (500).

---

## Design System

The application follows a **Modern Organic** design system documented in [DESIGN.md](DESIGN.md). Key characteristics:

- **Color Palette**: Terracotta primary, Soft Amber secondary, Sage Green tertiary, Cream neutrals
- **Typography**: Quicksand for headlines, Be Vietnam Pro for body text
- **Shape Language**: Rounded, organic forms with soft shadows
- **Spacing**: 8px linear scale with generous margins
- **Elevation**: Ambient shadows with warm tinting, interactive lift on hover

---

## License

This project is licensed under the [Apache License 2.0](LICENSE).
