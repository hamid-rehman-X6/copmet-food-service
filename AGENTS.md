# agent.md — Compet Food Service

## Project Identity

- **Brand:** Compet Food Service
- **Type:** Food & Frozen Items Showcase + WhatsApp Ordering Platform
- **Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Zod, Zustand, Prisma/Supabase
- **Architecture:** Monorepo — public storefront + separate admin panel

---

## Core Rules

- TypeScript strict mode always — no `any`, no implicit types
- Every form input and API payload validated with Zod schemas
- No business logic inside UI components — separate concerns cleanly
- No hardcoded strings for config values — use environment variables
- Never commit `.env` — always use `.env.example` with documented keys
- All components must be responsive — mobile first, then tablet, then desktop
- Reuse before recreating — check `/components/ui` before writing new UI

---

## Project Structure

```
/
├── app/                        # Next.js App Router
│   ├── (public)/               # Public route group
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx        # Product listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Product detail
│   │   └── categories/
│   ├── (admin)/                # Admin route group (protected)
│   │   ├── layout.tsx          # Admin shell layout
│   │   ├── dashboard/
│   │   ├── products/
│   │   │   ├── page.tsx        # Product list + table
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── categories/
│   │   └── orders/             # WhatsApp order logs
│   └── api/                    # Route handlers
│       ├── products/
│       ├── categories/
│       └── admin/
│
├── components/
│   ├── ui/                     # Primitive reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── layout/                 # Layout wrappers
│   │   ├── PublicHeader.tsx
│   │   ├── PublicFooter.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── AdminTopbar.tsx
│   ├── products/               # Product-specific components
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductDetail.tsx
│   │   └── WhatsAppOrderButton.tsx
│   └── admin/                  # Admin-specific components
│       ├── ProductForm.tsx
│       ├── DataTable.tsx
│       └── StatsCard.tsx
│
├── hooks/                      # Custom React hooks
│   ├── useProducts.ts
│   ├── useCategories.ts
│   ├── useAuth.ts
│   └── useWhatsAppOrder.ts
│
├── lib/                        # Utilities and config
│   ├── db.ts                   # DB client (Prisma/Supabase)
│   ├── auth.ts                 # Auth helpers
│   ├── whatsapp.ts             # WhatsApp URL builder
│   └── utils.ts                # General helpers
│
├── schemas/                    # Zod schemas
│   ├── product.schema.ts
│   ├── category.schema.ts
│   └── auth.schema.ts
│
├── types/                      # Global TypeScript types
│   ├── product.ts
│   ├── category.ts
│   └── api.ts
│
├── store/                      # Zustand global state
│   └── cartStore.ts
│
├── middleware.ts               # Route protection logic
└── constants/
    ├── routes.ts
    └── config.ts
```

---

## TypeScript Rules

- Define all types in `/types` — never define inline types in components
- Use `interface` for object shapes, `type` for unions/intersections
- All API responses must have a typed return — use generic `ApiResponse<T>`
- Props interfaces named as `ComponentNameProps`
- No `as` casting unless absolutely unavoidable — document why if used

---

## Zod Validation Rules

- Every form has a matching Zod schema in `/schemas`
- Every API route handler validates `request.body` against a schema before processing
- Schema types exported as `z.infer<typeof Schema>` and reused in TypeScript types
- Validation errors returned as structured `{ field, message }` objects
- Admin forms and public forms both validated — no exceptions

---

## Component Rules

- One component per file — filename matches component name
- Props destructured at the top with a typed interface above the component
- No component longer than 150 lines — extract sub-components if needed
- Shared primitives go in `/components/ui` — no duplicating buttons, inputs, etc.
- Fetch data in page-level server components — pass down via props to client components
- Client components marked `"use client"` only when interactivity or hooks are needed

---

## Hooks Rules

- One concern per hook — no mega-hooks doing multiple things
- Hooks handle data fetching, caching, and loading/error states
- Hooks never contain JSX
- Named as `useNoun` or `useNounVerb`

---

## Routing & Auth

- Public routes grouped under `app/(public)/` — no auth required
- Admin routes grouped under `app/(admin)/` — always protected
- `middleware.ts` handles route protection using session/token check
- Unauthenticated admin access redirects to `/admin/login`
- Route constants defined in `constants/routes.ts` — no raw strings in `<Link>` or `router.push`

---

## Admin Panel Rules

- Admin layout uses a persistent sidebar + topbar shell in `app/(admin)/layout.tsx`
- Sidebar navigation items driven by a config array — easy to extend
- Dashboard shows key stats (total products, categories, recent orders)
- Product CRUD: list with search/filter, create form, edit form, delete with confirmation modal
- All admin data tables use the shared `DataTable` component
- Admin forms use controlled inputs validated with Zod + React Hook Form

---

## WhatsApp Ordering

- WhatsApp order button lives in `components/products/WhatsAppOrderButton.tsx`
- Message built using a utility in `lib/whatsapp.ts` — takes product name, variant, quantity
- Message format: product name, variant/size, quantity, product URL — clean and readable
- Phone number stored in environment variable `NEXT_PUBLIC_WHATSAPP_NUMBER`
- Opens `https://wa.me/{number}?text={encoded_message}` in a new tab
- No payment, no cart persistence required for MVP

---

## API Route Rules

- All routes in `app/api/` follow REST conventions
- Request body validated with Zod before any DB call
- Responses always return `{ data, error, message }` shape
- HTTP status codes used correctly — 200, 201, 400, 401, 403, 404, 500
- Admin API routes check for valid session before execution
- No raw SQL — use ORM query builder only

---

## Styling Rules

- For styling and design UI workflow, follow the DESIGN.MD file

---

## Code Quality Rules

- Every file has a one-line comment at the top describing its purpose
- Complex logic has inline comments explaining the "why" not the "what"
- No commented-out dead code in production — delete it
- Functions named as verbs: `getProduct`, `buildWhatsAppMessage`, `validateProductForm`
- Boolean variables prefixed: `isLoading`, `hasError`, `canEdit`
- No magic strings — move repeated strings to `constants/`

---

## Environment Variables

```
# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=

# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Storage (product images)
STORAGE_BUCKET=
STORAGE_URL=
```

---

## Security Rules

- Admin routes always server-side protected — middleware + API level
- No sensitive data in client-side state or localStorage
- Image uploads validated for type and size before storage
- Environment variables never exposed unless prefixed `NEXT_PUBLIC_` intentionally
- Rate limiting on API routes — especially admin login

---

## What NOT to Do

- Do not add payment integration in this phase
- Do not put page logic inside layout files
- Do not fetch data inside client components directly — use server components or hooks
- Do not create new UI primitives without checking `/components/ui` first
- Do not skip Zod validation on any form or API input
- Do not use `any` type — if unknown, type it as `unknown` and narrow it