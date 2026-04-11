# Current Feature

## Status

Completed

## Goals

- Replace dummy collection data in the dashboard main area with real data from Neon via Prisma
- Create `src/lib/db/collections.ts` with data fetching functions
- Fetch collections directly in the server component (no mock-data.ts)
- Derive collection card border color from the most-used content type in that collection
- Show small icons of all item types present in each collection
- Keep the existing 6-card recent collections layout/design
- Update collection stats display
- Do not render items underneath the cards yet (deferred)

## Notes

- Spec: @context/features/dashboard-collections-spec.md
- Data models: @context/project-overview.md
- Coding standards: @context/coding-standards.md
- Screenshot reference: @context/screenshots/dashboard-ui-main.png
- Current mock source to replace: @src/lib/mock-data.ts

## History

- **2026-04-10** — Dashboard collections wired to Neon: new `src/lib/db/collections.ts` with `getCurrentUserId` (demo user fallback) and `getRecentCollectionsWithStats` (per-collection item count, sorted type summaries, dominant type); `CollectionsGrid` converted to async server component, dominant-type left border accent, per-type lucide icons tinted by type color, empty state, `mock-data` import removed

- **2026-04-10** — Seed data: bcryptjs-hashed demo user (demo@devstash.io), 7 lowercase system item types, 5 spec-compliant collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) with 18 items total, real URLs for links; updated scripts/test-db.ts to verify demo user, password hash, item types, and collections

- **2026-04-10** — Prisma 7 + Neon PostgreSQL setup: prisma-client generator with generated/prisma output, prisma.config.ts with dotenv, PrismaNeon driver adapter, full schema (User, Account, Session, VerificationToken, ItemType, Item, Collection, Tag + join tables), initial migration, seed script (7 system types, demo user, 6 collections, 18 tags, 8 items), db:* npm scripts, test-db.ts script

- **2026-04-08** — Dashboard UI Phase 2: collapsible sidebar with item types (color-coded, linked to /items/TYPE), favorite & recent collections, user avatar area, desktop collapse/expand toggle, mobile sheet drawer

- **2026-04-08** — Dashboard UI Phase 1: shadcn/ui init, dark mode, /dashboard route with layout, top bar (logo, search, buttons), sidebar and main placeholders
- **2026-04-08** — Initial Next.js 16 project setup (create-next-app), project context docs, README, GitHub repo created
