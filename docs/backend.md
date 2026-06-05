# Backend Architecture

The backend uses versioned Next.js REST route handlers and PostgreSQL. Authentication is the first completed module.

## Module Flow

```text
HTTP route handler
  -> shared request parser and validation
  -> auth service business logic
  -> auth repository SQL queries
  -> PostgreSQL
```

Shared API errors and responses are handled in `src/server/api`. Authentication code is isolated in
`src/server/auth`. Shared request schemas live in `src/schemas`, allowing the browser and API to validate the same
payload shape.

## Setup

1. Install PostgreSQL locally or connect to an existing PostgreSQL server.
2. Copy `.env.example` to `.env.local`.
3. Create the database named in `DB_NAME`.
4. Set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`.
5. Run `npm run db:migrate`.
6. Run `npm run dev`.

Generate strong secrets with a cryptographically secure password generator. Each JWT secret must contain at least 32
characters and must be different.

## Authentication REST API

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/auth/signup` | Create a customer account and session |
| `POST` | `/api/v1/auth/login` | Authenticate and create a session |
| `POST` | `/api/v1/auth/refresh` | Rotate the refresh token and issue a new access token |
| `POST` | `/api/v1/auth/logout` | Revoke the current refresh session and clear cookies |
| `GET` | `/api/v1/auth/me` | Return the authenticated user |
| `GET` | `/api/v1/health` | Confirm API availability |

### Success Response

```json
{
  "success": true,
  "message": "You are now signed in.",
  "data": {
    "user": {}
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Please correct the invalid fields.",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {}
  }
}
```

## Token Security

- Passwords are hashed with bcrypt using 12 salt rounds.
- Access JWTs expire after 15 minutes.
- Refresh JWTs expire after 7 days, or 30 days when `rememberMe` is enabled.
- Access and refresh tokens are stored only in `HttpOnly`, `SameSite=Lax` cookies.
- Refresh tokens rotate on every refresh.
- Only a SHA-256 hash of each refresh JWT is stored in PostgreSQL.
- Refresh-token replay revokes the entire token family.
- Refresh rows are locked during rotation to prevent concurrent reuse.
- Logout is idempotent and revokes the active refresh session.
- State-changing auth endpoints verify the request origin.

## Database Tables

- `users`: profile, role, password hash, account state, and terms acceptance.
- `refresh_sessions`: rotating refresh sessions, token hashes, expiry, device metadata, and revocation state.
- `schema_migrations`: migrations already applied by the migration runner.

## Adding Future Modules

Follow the same flow used by auth:

1. Add shared Zod request schemas.
2. Add a module repository containing parameterized SQL.
3. Add a service containing business rules.
4. Add versioned REST route handlers wrapped with `withApiHandler`.
5. Return all results through the shared `success` response helper.
6. Protect customer routes with `requireAccessToken` and admin routes with `requireRole(request, ["ADMIN"])`.
