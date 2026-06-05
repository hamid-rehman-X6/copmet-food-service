# Backend Architecture

The backend is built on **Next.js 16 App Router** with versioned REST API route handlers, **PostgreSQL** for persistent storage, and a modular layered architecture that cleanly separates concerns between HTTP handling, business logic, and data access.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Module Flow](#module-flow)
- [Setup](#setup)
- [Server Module Structure](#server-module-structure)
  - [API Framework (`src/server/api/`)](#api-framework)
  - [Authentication Module (`src/server/auth/`)](#authentication-module)
  - [Database Layer (`src/server/db/`)](#database-layer)
  - [Configuration (`src/server/config/`)](#configuration)
- [Shared Schemas (`src/schemas/`)](#shared-schemas)
- [Middleware & Route Protection](#middleware--route-protection)
- [API Client (`src/lib/api-client.ts`)](#api-client)
- [REST API Reference](#rest-api-reference)
  - [Health Check](#health-check)
  - [Customer Signup](#customer-signup)
  - [Customer Login](#customer-login)
  - [Admin Login](#admin-login)
  - [Token Refresh](#token-refresh)
  - [Logout](#logout)
  - [Current User](#current-user)
- [Token Security](#token-security)
- [Database Schema](#database-schema)
  - [Tables](#tables)
  - [Indexes](#indexes)
  - [Migration System](#migration-system)
- [Error Handling](#error-handling)
- [Adding Future Modules](#adding-future-modules)

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                        Client (Browser)                    │
│  AuthProvider ──► apiRequest() ──► fetch() with credentials│
└────────────────────┬───────────────────────────────────────┘
                     │  HTTP (cookies)
┌────────────────────▼───────────────────────────────────────┐
│                    Next.js Middleware                       │
│  proxy.ts: validates JWT for /admin/* routes                │
└────────────────────┬───────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────┐
│                    Route Handlers                           │
│  src/app/api/v1/auth/*/route.ts                            │
│  Wrapped with withApiHandler() for error handling           │
├────────────────────┬───────────────────────────────────────┤
│                    │                                        │
│  ┌─────────────────▼─────────────────────────────────┐     │
│  │            Request Layer (src/server/api/)          │     │
│  │  parseJson() ──► Zod validation                    │     │
│  │  assertTrustedOrigin() ──► origin check            │     │
│  │  getRequestContext() ──► user-agent, IP             │     │
│  └─────────────────┬─────────────────────────────────┘     │
│                    │                                        │
│  ┌─────────────────▼─────────────────────────────────┐     │
│  │           Service Layer (src/server/auth/)          │     │
│  │  auth.service.ts: signup, login, refresh, logout   │     │
│  │  admin-auth.service.ts: loginEnvAdmin              │     │
│  │  tokens.ts: sign/verify JWT, hash tokens           │     │
│  │  password.ts: bcrypt hash/verify                   │     │
│  │  cookies.ts: set/clear HttpOnly cookies            │     │
│  │  authenticate.ts: requireAccessToken, requireRole  │     │
│  └─────────────────┬─────────────────────────────────┘     │
│                    │                                        │
│  ┌─────────────────▼─────────────────────────────────┐     │
│  │         Repository Layer (src/server/auth/)         │     │
│  │  auth.repository.ts: parameterized SQL queries      │     │
│  │  findUserByEmail, findUserById, createUser, ...    │     │
│  └─────────────────┬─────────────────────────────────┘     │
│                    │                                        │
│  ┌─────────────────▼─────────────────────────────────┐     │
│  │           Database Layer (src/server/db/)            │     │
│  │  pool.ts: PostgreSQL connection pool (pg)           │     │
│  │  query(): single query execution                   │     │
│  │  transaction(): BEGIN/COMMIT/ROLLBACK wrapper       │     │
│  └─────────────────┬─────────────────────────────────┘     │
│                    │                                        │
└────────────────────▼───────────────────────────────────────┘
                     │
              ┌──────▼──────┐
              │  PostgreSQL  │
              └─────────────┘
```

---

## Module Flow

Every API request follows the same layered flow:

```
HTTP request
  → withApiHandler()        # Catches errors, formats responses
    → assertTrustedOrigin() # Verifies request origin (state-changing endpoints)
    → parseJson()           # Parses body and validates with Zod schema
    → Service function      # Business logic and orchestration
      → Repository function # Parameterized SQL queries
        → PostgreSQL        # Data persistence
    → success()/failure()   # Standardized JSON response
```

---

## Setup

### Prerequisites

- PostgreSQL 14+ installed and running
- Node.js 18.17+

### Steps

1. Install PostgreSQL locally or connect to an existing PostgreSQL server.
2. Copy `.env.example` to `.env.local`.
3. Create the database named in `DB_NAME`:
   ```bash
   createdb copmet_food_service
   ```
4. Configure all environment variables in `.env.local`:

   | Variable | Description |
   | --- | --- |
   | `DB_HOST` | PostgreSQL host (e.g., `localhost`) |
   | `DB_PORT` | PostgreSQL port (e.g., `5432`) |
   | `DB_NAME` | Database name |
   | `DB_USER` | Database user |
   | `DB_PASSWORD` | Database password |
   | `DB_SSL` | Set to `true` for SSL connections (default: `false`) |
   | `JWT_ACCESS_SECRET` | Minimum 32-character secret for access tokens |
   | `JWT_REFRESH_SECRET` | Minimum 32-character secret for refresh tokens (must differ from access) |
   | `APP_URL` | Public application URL for origin verification |
   | `ADMIN_EMAIL` | Admin account email address |
   | `ADMIN_PASSWORD` | Admin account password |

5. Run migrations:
   ```bash
   npm run db:migrate
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

> **Security**: Generate strong secrets with a cryptographically secure password generator. Each JWT secret must contain at least 32 characters and must be different.

---

## Server Module Structure

### API Framework

**Path**: `src/server/api/`

The API framework provides shared utilities used by all route handlers.

#### `handler.ts` — `withApiHandler()`

A higher-order function that wraps every route handler with centralized error handling:

- **`ZodError`** → 422 `VALIDATION_ERROR` with field-level details from `error.flatten().fieldErrors`
- **`AppError`** → Custom status code, error code, and message
- **PostgreSQL unique violation (`23505`)** → 409 `CONFLICT`
- **Unhandled errors** → 500 `INTERNAL_SERVER_ERROR` (logged to console)

#### `errors.ts` — `AppError` class and factory functions

```typescript
errors.badRequest(message, details?)    // 400 BAD_REQUEST
errors.unauthorized(message?)           // 401 UNAUTHORIZED
errors.forbidden(message?)              // 403 FORBIDDEN
errors.notFound(message?)               // 404 NOT_FOUND
errors.conflict(message)                // 409 CONFLICT
```

#### `response.ts` — Standardized response helpers

```typescript
success<T>(data: T, message?: string, status?: number)   // { success: true, ... }
failure(message, code, status, details?)                  // { success: false, ... }
```

All responses include `Cache-Control: no-store` to prevent caching of authenticated data.

#### `request.ts` — Request parsing and validation

```typescript
parseJson<T>(request, zodSchema)    // Parse JSON body and validate with Zod
assertTrustedOrigin(request)        // Verify request Origin header against APP_URL
getRequestContext(request)          // Extract user-agent and IP address
```

---

### Authentication Module

**Path**: `src/server/auth/`

The authentication module is fully self-contained with clear file responsibilities:

| File | Responsibility |
| --- | --- |
| `auth.service.ts` | Core business logic: `signup`, `login`, `refresh`, `logout`, `getUserById` |
| `admin-auth.service.ts` | Environment-based admin authentication: `loginEnvAdmin`, `getEnvAdminUser` |
| `auth.repository.ts` | All SQL queries: user CRUD, refresh session CRUD, family revocation |
| `authenticate.ts` | Middleware helpers: `requireAccessToken`, `requireRole` |
| `tokens.ts` | JWT operations: `signAccessToken`, `signRefreshToken`, `verifyAccessToken`, `verifyRefreshToken`, `hashToken` |
| `cookies.ts` | Cookie management: `setAuthCookies`, `setAccessCookie`, `clearAuthCookies` |
| `password.ts` | Password hashing: `hashPassword`, `verifyPassword` (bcrypt, 12 rounds) |
| `auth.constants.ts` | Token TTLs, cookie names, JWT metadata (issuer, audience) |

#### Auth Service (`auth.service.ts`)

**`signup(input, context)`**
1. Check for existing user by email
2. Hash the password with bcrypt (12 salt rounds)
3. Open a database transaction:
   - Insert the user row
   - Create a refresh session with a new token family
4. Return the user profile and auth tokens

**`login(input, context)`**
1. Find the user by email
2. Verify the password against the stored hash
3. Check that the account is active
4. Create a new token session
5. Update `last_login_at` timestamp
6. Return the user profile and auth tokens

**`refresh(refreshToken, context)`**
1. Verify the refresh JWT signature and extract claims
2. Hash the presented token for comparison
3. Open a database transaction with row-level locking (`FOR UPDATE`):
   - Load the refresh session row
   - Validate: family ID, user ID, token hash, not revoked, not expired
   - If any check fails → revoke the **entire token family** (replay detection)
   - Load the user and check active status
   - Create a replacement refresh session in the same family
   - Revoke the old session, linking it to the replacement
4. Return the user profile and new auth tokens

**`logout(refreshToken?)`**
- Verify and revoke the refresh session
- Idempotent: silently handles expired or missing tokens

#### Admin Auth Service (`admin-auth.service.ts`)

**`loginEnvAdmin(input)`**
1. Compare email and password against environment variables using timing-safe comparison (`crypto.timingSafeEqual`)
2. Return a synthetic admin user profile and an access token
3. No refresh session is created — admin sessions are access-token-only

#### Authentication Middleware (`authenticate.ts`)

```typescript
// Require a valid access token — returns { userId, email, role }
const session = await requireAccessToken(request);

// Require a specific role — throws FORBIDDEN if not authorized
const session = await requireRole(request, ["ADMIN"]);
```

#### Token Configuration (`auth.constants.ts`)

```typescript
authCookies.access  = "copmet_access_token"
authCookies.refresh = "copmet_refresh_token"

authTokenTtl.accessSeconds             = 900      // 15 minutes
authTokenTtl.refreshSeconds            = 604800   // 7 days
authTokenTtl.rememberedRefreshSeconds  = 2592000  // 30 days

authTokenMetadata.issuer   = "copmet-food-service"
authTokenMetadata.audience = "copmet-web-app"
```

---

### Database Layer

**Path**: `src/server/db/pool.ts`

A lazy-initialized PostgreSQL connection pool using `pg`:

```typescript
const pool = new Pool({
  max: 10,                          // Maximum connections
  idleTimeoutMillis: 30_000,        // Close idle connections after 30s
  connectionTimeoutMillis: 5_000,   // Timeout new connections after 5s
  ssl: database.ssl ? { rejectUnauthorized: false } : undefined,
});
```

**Exports:**
- `query<T>(text, values)` — Execute a single parameterized query
- `transaction<T>(callback)` — Execute multiple queries in a `BEGIN`/`COMMIT`/`ROLLBACK` block

---

### Configuration

**Path**: `src/server/config/env.ts`

All environment variables are accessed through the `env` object with lazy getters that throw immediately if a required variable is missing or a secret is too short:

```typescript
env.database        // { host, port, name, user, password, ssl }
env.accessSecret    // JWT_ACCESS_SECRET (min 32 chars)
env.refreshSecret   // JWT_REFRESH_SECRET (min 32 chars)
env.appUrl          // APP_URL (defaults to http://localhost:3000)
env.adminEmail      // ADMIN_EMAIL (trimmed, lowercased)
env.adminPassword   // ADMIN_PASSWORD
env.isProduction    // NODE_ENV === "production"
```

---

## Shared Schemas

**Path**: `src/schemas/auth.schemas.ts`

Zod schemas are shared between the browser (React Hook Form) and the API (route handlers) to ensure both sides validate the same payload shape.

### `signupSchema`

```typescript
{
  firstName:       string, trimmed, 1–80 chars
  lastName:        string, trimmed, 1–80 chars
  email:           string, valid email, max 254, lowercased
  password:        string, 8–72 chars, at least one letter and one number
  confirmPassword: string, must match password
  termsAccepted:   boolean, must be true
}
```

### `loginSchema`

```typescript
{
  email:      string, valid email, max 254, lowercased
  password:   string, 1–72 chars
  rememberMe: boolean, default false
}
```

---

## Middleware & Route Protection

**Path**: `src/proxy.ts`

The Next.js middleware protects all `/admin/*` routes:

1. Requests to `/admin/login` pass through without authentication
2. For all other `/admin/*` paths, the middleware:
   - Reads the `copmet_access_token` cookie
   - Verifies the JWT signature and checks:
     - `payload.type === "access"`
     - `payload.sub === "env-admin"`
     - `payload.email === ADMIN_EMAIL`
     - `payload.role === "ADMIN"`
3. If validation fails → redirect to `/admin/login?next={originalPath}`

---

## API Client

**Path**: `src/lib/api-client.ts`

The browser-side API client (`apiRequest<T>()`) wraps `fetch()` with:

- Automatic `credentials: "include"` for cookie transport
- JSON `Content-Type` header when a body is present
- **Transparent token refresh**: On a 401 response, the client automatically calls `/api/v1/auth/refresh`. If the refresh succeeds, the original request is retried once. Auth endpoints (`/login`, `/signup`, `/refresh`) are excluded from auto-refresh.
- **Typed errors**: Failed requests throw `ApiClientError` with `status`, `code`, and `details` properties

---

## REST API Reference

### Health Check

```
GET /api/v1/health
```

**Response** `200 OK`:
```json
{
  "success": true,
  "message": "API is healthy.",
  "data": {
    "status": "ok",
    "timestamp": "2026-06-05T15:30:00.000Z"
  }
}
```

---

### Customer Signup

```
POST /api/v1/auth/signup
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "password": "SecurePass1",
  "confirmPassword": "SecurePass1",
  "termsAccepted": true
}
```

**Response** `201 Created`:
```json
{
  "success": true,
  "message": "Your account has been created.",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "role": "CUSTOMER",
      "createdAt": "2026-06-05T15:30:00.000Z"
    }
  }
}
```

**Cookies Set:**
- `copmet_access_token` — HttpOnly, SameSite=Lax, 15 min TTL
- `copmet_refresh_token` — HttpOnly, SameSite=Lax, path `/api/v1/auth`, 7 day TTL

**Errors:**
- `422 VALIDATION_ERROR` — Invalid input fields
- `409 CONFLICT` — Email already registered

---

### Customer Login

```
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "SecurePass1",
  "rememberMe": false
}
```

**Response** `200 OK`:
```json
{
  "success": true,
  "message": "You are now signed in.",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "role": "CUSTOMER",
      "createdAt": "2026-06-05T15:30:00.000Z"
    }
  }
}
```

**Cookies Set:**
- `copmet_access_token` — 15 min TTL
- `copmet_refresh_token` — 7 days (or 30 days with `rememberMe: true`)

**Errors:**
- `401 UNAUTHORIZED` — Incorrect email or password
- `403 FORBIDDEN` — Account disabled
- `422 VALIDATION_ERROR` — Invalid input

---

### Admin Login

```
POST /api/v1/auth/admin-login
```

**Request Body:**
```json
{
  "email": "admin@copmet.com",
  "password": "admin-password"
}
```

**Response** `200 OK`:
```json
{
  "success": true,
  "message": "Admin signed in.",
  "data": {
    "user": {
      "id": "env-admin",
      "firstName": "Dev",
      "lastName": "Admin",
      "email": "admin@copmet.com",
      "role": "ADMIN",
      "createdAt": "1970-01-01T00:00:00.000Z"
    }
  }
}
```

**Cookies Set:**
- `copmet_access_token` — 15 min TTL
- `copmet_refresh_token` — Cleared (maxAge=0)

**Errors:**
- `401 UNAUTHORIZED` — Incorrect admin credentials

> **Note**: Admin authentication uses environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) and timing-safe comparison. No database queries are involved.

---

### Token Refresh

```
POST /api/v1/auth/refresh
```

**Request**: No body required. The refresh token is read from the `copmet_refresh_token` cookie.

**Response** `200 OK`:
```json
{
  "success": true,
  "message": "Your session has been refreshed.",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "role": "CUSTOMER",
      "createdAt": "2026-06-05T15:30:00.000Z"
    }
  }
}
```

**Cookies Set:**
- New `copmet_access_token`
- New `copmet_refresh_token` (rotated)

**Errors:**
- `401 UNAUTHORIZED` — Missing, expired, revoked, or replayed refresh token

**Replay Detection:**
When a previously used refresh token is presented, the server revokes the entire token family. This invalidates all sessions in the rotation chain, protecting against token theft.

---

### Logout

```
POST /api/v1/auth/logout
```

**Request**: No body required. The refresh token is read from the cookie.

**Response** `200 OK`:
```json
{
  "success": true,
  "message": "You have been signed out.",
  "data": null
}
```

**Cookies Cleared:**
- `copmet_access_token` — set to empty, maxAge=0
- `copmet_refresh_token` — set to empty, maxAge=0

> **Note**: Logout is idempotent. It succeeds even if the refresh token is already expired or missing.

---

### Current User

```
GET /api/v1/auth/me
```

**Request**: No body required. The access token is read from the `copmet_access_token` cookie.

**Response** `200 OK`:
```json
{
  "success": true,
  "message": "Authenticated user retrieved.",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "role": "CUSTOMER",
      "createdAt": "2026-06-05T15:30:00.000Z"
    }
  }
}
```

**Errors:**
- `401 UNAUTHORIZED` — Missing or invalid access token

> **Note**: For admin users (`sub === "env-admin"`), the user profile is returned from environment variables rather than the database.

---

## Token Security

| Measure | Implementation |
| --- | --- |
| **Password Hashing** | bcrypt with 12 salt rounds |
| **Access Token TTL** | 15 minutes |
| **Refresh Token TTL** | 7 days (standard) / 30 days (`rememberMe`) |
| **Token Storage** | HttpOnly, SameSite=Lax cookies only — inaccessible to JavaScript |
| **Refresh Cookie Path** | Scoped to `/api/v1/auth` — not sent with other API requests |
| **Secure Flag** | Enabled in production (`NODE_ENV === "production"`) |
| **Token Rotation** | Every refresh issues a new token and revokes the old one |
| **Server-Side Storage** | Only a SHA-256 hash of each refresh token is stored in PostgreSQL |
| **Replay Detection** | Presenting a used token revokes the entire token family |
| **Row Locking** | Refresh session rows are locked with `FOR UPDATE` during rotation |
| **Origin Verification** | State-changing endpoints verify the `Origin` header against `APP_URL` |
| **Admin Comparison** | Environment credentials compared with `crypto.timingSafeEqual` |
| **JWT Algorithm** | HS256 with separate secrets for access and refresh tokens |
| **JWT Metadata** | Issuer: `copmet-food-service`, Audience: `copmet-web-app` |
| **Idempotent Logout** | Logout succeeds even if the session is already expired or revoked |

---

## Database Schema

### Tables

#### `users`

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique user identifier |
| `first_name` | `VARCHAR(80)` | `NOT NULL` | First name |
| `last_name` | `VARCHAR(80)` | `NOT NULL` | Last name |
| `email` | `CITEXT` | `NOT NULL`, `UNIQUE` | Case-insensitive email address |
| `password_hash` | `TEXT` | `NOT NULL` | bcrypt hash |
| `role` | `user_role` | `NOT NULL`, `DEFAULT 'CUSTOMER'` | Enum: `CUSTOMER`, `ADMIN` |
| `is_active` | `BOOLEAN` | `NOT NULL`, `DEFAULT TRUE` | Account active flag |
| `terms_accepted_at` | `TIMESTAMPTZ` | `NOT NULL` | When terms were accepted |
| `email_verified_at` | `TIMESTAMPTZ` | | When email was verified |
| `last_login_at` | `TIMESTAMPTZ` | | Last successful login |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Account creation time |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Last update time |

#### `refresh_sessions`

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `UUID` | `PRIMARY KEY` | Session identifier |
| `family_id` | `UUID` | `NOT NULL` | Token rotation family |
| `user_id` | `UUID` | `NOT NULL`, `FK → users(id) CASCADE` | Owner |
| `token_hash` | `CHAR(64)` | `NOT NULL`, `UNIQUE` | SHA-256 hash of the refresh JWT |
| `remember_me` | `BOOLEAN` | `NOT NULL`, `DEFAULT FALSE` | Extended expiry flag |
| `expires_at` | `TIMESTAMPTZ` | `NOT NULL` | Token expiration |
| `revoked_at` | `TIMESTAMPTZ` | | When the session was revoked |
| `replaced_by` | `UUID` | `FK → refresh_sessions(id) SET NULL` | Successor session |
| `user_agent` | `TEXT` | | Client user-agent string |
| `ip_address` | `TEXT` | | Client IP address |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Session creation time |

#### `schema_migrations`

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `name` | `TEXT` | `PRIMARY KEY` | Migration filename |
| `applied_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | When the migration was applied |

### Indexes

| Index | Table | Column(s) |
| --- | --- | --- |
| `refresh_sessions_user_id_idx` | `refresh_sessions` | `user_id` |
| `refresh_sessions_family_id_idx` | `refresh_sessions` | `family_id` |
| `refresh_sessions_expires_at_idx` | `refresh_sessions` | `expires_at` |

### Migration System

The custom migration runner (`scripts/migrate.mjs`) applies SQL files from `database/migrations/` in alphabetical order:

1. Creates the `schema_migrations` table if it doesn't exist
2. Reads all `.sql` files from the migrations directory, sorted alphabetically
3. For each file:
   - Checks if the migration has already been applied
   - Wraps the SQL in a `BEGIN`/`COMMIT` transaction
   - Records the migration name in `schema_migrations`
4. Failed migrations are rolled back

Run migrations with:
```bash
npm run db:migrate
```

---

## Error Handling

### Error Response Format

All API errors follow a consistent structure:

```json
{
  "success": false,
  "message": "Human-readable error description.",
  "error": {
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

### Error Codes

| Code | HTTP Status | Trigger |
| --- | --- | --- |
| `VALIDATION_ERROR` | 422 | Zod schema validation fails |
| `BAD_REQUEST` | 400 | Malformed request body |
| `UNAUTHORIZED` | 401 | Missing, expired, or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions or untrusted origin |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Duplicate entry (e.g., email already registered) |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled server error |

### Validation Error Details

When a `VALIDATION_ERROR` occurs, the `details` field contains Zod's flattened field errors:

```json
{
  "success": false,
  "message": "Please correct the invalid fields.",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "email": ["Enter a valid email address."],
      "password": ["Password must contain at least 8 characters."]
    }
  }
}
```

---

## Adding Future Modules

Follow the same layered pattern used by the auth module:

### 1. Define Shared Schemas

Create a Zod schema file in `src/schemas/` that can be imported by both the browser (forms) and the server (route handlers):

```typescript
// src/schemas/orders.schemas.ts
export const createOrderSchema = z.object({ ... });
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
```

### 2. Create a Repository

Add parameterized SQL queries in `src/server/{module}/`:

```typescript
// src/server/orders/orders.repository.ts
export async function createOrder(input, executor?) { ... }
export async function findOrderById(id, executor?) { ... }
```

### 3. Create a Service

Add business logic that orchestrates repository calls:

```typescript
// src/server/orders/orders.service.ts
export async function placeOrder(input, userId) { ... }
```

### 4. Create Route Handlers

Add versioned REST endpoints in `src/app/api/v1/{module}/`:

```typescript
// src/app/api/v1/orders/route.ts
export const POST = withApiHandler(async (request) => {
  assertTrustedOrigin(request);
  const session = await requireAccessToken(request);
  const input = await parseJson(request, createOrderSchema);
  const order = await placeOrder(input, session.userId);
  return success({ order }, "Order placed successfully.", 201);
});
```

### 5. Protect Routes

Use the authentication middleware to enforce access control:

```typescript
// Public route — no auth required
export const GET = withApiHandler(async () => { ... });

// Customer route — any authenticated user
const session = await requireAccessToken(request);

// Admin route — ADMIN role only
const session = await requireRole(request, ["ADMIN"]);
```

### 6. Add Database Migrations

Create a new SQL file in `database/migrations/` with the next sequence number:

```sql
-- database/migrations/002_orders.sql
CREATE TABLE IF NOT EXISTS orders ( ... );
```

Run `npm run db:migrate` to apply.
