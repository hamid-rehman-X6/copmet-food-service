# Copmet Food Service

Responsive food-service web application with customer ordering, authentication, and an admin management interface.

## Development

```bash
npm install
npm run db:migrate
npm run dev
```

Install and start PostgreSQL locally before running migrations. Copy `.env.example` to `.env.local`, create the database named in `DB_NAME`, and configure PostgreSQL credentials and JWT secrets before running database-backed APIs.

## Commands

- `npm run dev`: start development server
- `npm run build`: create production build
- `npm run lint`: run ESLint
- `npm run db:migrate`: apply pending PostgreSQL migrations

Backend architecture and authentication API documentation are available in [docs/backend.md](docs/backend.md).
