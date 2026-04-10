# Current Feature

## Status

Completed

## Goals

- Replace the existing seed script with a spec-compliant version
- Create a demo user (demo@devstash.io) with bcryptjs-hashed password (12 rounds)
- Seed 7 system item types with lowercase names (snippet, prompt, command, note, file, image, link)
- Seed 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) with items per spec
- Use real URLs for all link items
- Overwrite the existing `prisma/seed.ts` file

## Notes

- Spec: @context/features/seed-spec.md
- Data models: @context/project-overview.md
- Coding standards: @context/coding-standards.md
- Password hashing: bcryptjs with 12 rounds
- Run with `npm run db:seed`

## History

- **2026-04-10** — Seed data: bcryptjs-hashed demo user (demo@devstash.io), 7 lowercase system item types, 5 spec-compliant collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) with 18 items total, real URLs for links; updated scripts/test-db.ts to verify demo user, password hash, item types, and collections

- **2026-04-10** — Prisma 7 + Neon PostgreSQL setup: prisma-client generator with generated/prisma output, prisma.config.ts with dotenv, PrismaNeon driver adapter, full schema (User, Account, Session, VerificationToken, ItemType, Item, Collection, Tag + join tables), initial migration, seed script (7 system types, demo user, 6 collections, 18 tags, 8 items), db:* npm scripts, test-db.ts script

- **2026-04-08** — Dashboard UI Phase 2: collapsible sidebar with item types (color-coded, linked to /items/TYPE), favorite & recent collections, user avatar area, desktop collapse/expand toggle, mobile sheet drawer

- **2026-04-08** — Dashboard UI Phase 1: shadcn/ui init, dark mode, /dashboard route with layout, top bar (logo, search, buttons), sidebar and main placeholders
- **2026-04-08** — Initial Next.js 16 project setup (create-next-app), project context docs, README, GitHub repo created
