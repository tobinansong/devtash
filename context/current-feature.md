# Current Feature

## Status

Completed

## Goals

- Set up Prisma ORM with Neon PostgreSQL (serverless)
- Create initial schema based on data models in project-overview.md
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Use Prisma 7 (with breaking changes from v6)
- Create migrations (never use db push)

## Notes

- Spec: @context/features/database-spec.md
- Data models: @context/project-overview.md
- Coding standards: @context/coding-standards.md
- Use development branch in DATABASE_URL, production branch separate
- Prisma 7 upgrade guide: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Prisma setup guide: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres

## History

- **2026-04-10** — Prisma 7 + Neon PostgreSQL setup: prisma-client generator with generated/prisma output, prisma.config.ts with dotenv, PrismaNeon driver adapter, full schema (User, Account, Session, VerificationToken, ItemType, Item, Collection, Tag + join tables), initial migration, seed script (7 system types, demo user, 6 collections, 18 tags, 8 items), db:* npm scripts, test-db.ts script

- **2026-04-08** — Dashboard UI Phase 2: collapsible sidebar with item types (color-coded, linked to /items/TYPE), favorite & recent collections, user avatar area, desktop collapse/expand toggle, mobile sheet drawer

- **2026-04-08** — Dashboard UI Phase 1: shadcn/ui init, dark mode, /dashboard route with layout, top bar (logo, search, buttons), sidebar and main placeholders
- **2026-04-08** — Initial Next.js 16 project setup (create-next-app), project context docs, README, GitHub repo created
