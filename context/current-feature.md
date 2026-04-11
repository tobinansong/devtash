# Current Feature

## Status

Completed

## Goals

- Replace mock stats in the dashboard main area with real data from the database (preserve current design/layout)
- Show system item types in the sidebar with their icons, each linking to `/items/[typename]`
- Show actual collection data from the database in the sidebar
- Add a "View all collections" link under the sidebar collections list, navigating to `/collections`
- Keep star icons for favorite collections in the sidebar
- For recent collections in the sidebar, show a colored circle based on the most-used item type in that collection
- Create `src/lib/db/items.ts` and add the required database functions (use `src/lib/db/collections.ts` as reference)

## Notes

- Spec: @context/features/stats-sidebar-spec.md
- Reference: @src/lib/db/collections.ts
- Data models: @context/project-overview.md
- Coding standards: @context/coding-standards.md

## History

- **2026-04-08** — Initial Next.js 16 project setup (create-next-app), project context docs, README, GitHub repo created

- **2026-04-08** — Dashboard UI Phase 1: shadcn/ui init, dark mode, /dashboard route with layout, top bar (logo, search, buttons), sidebar and main placeholders

- **2026-04-08** — Dashboard UI Phase 2: collapsible sidebar with item types (color-coded, linked to /items/TYPE), favorite & recent collections, user avatar area, desktop collapse/expand toggle, mobile sheet drawer

- **2026-04-10** — Prisma 7 + Neon PostgreSQL setup: prisma-client generator with generated/prisma output, prisma.config.ts with dotenv, PrismaNeon driver adapter, full schema (User, Account, Session, VerificationToken, ItemType, Item, Collection, Tag + join tables), initial migration, seed script (7 system types, demo user, 6 collections, 18 tags, 8 items), db:* npm scripts, test-db.ts script

- **2026-04-10** — Seed data: bcryptjs-hashed demo user (demo@devstash.io), 7 lowercase system item types, 5 spec-compliant collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) with 18 items total, real URLs for links; updated scripts/test-db.ts to verify demo user, password hash, item types, and collections

- **2026-04-10** — Dashboard collections wired to Neon: new `src/lib/db/collections.ts` with `getCurrentUserId` (demo user fallback) and `getRecentCollectionsWithStats` (per-collection item count, sorted type summaries, dominant type); `CollectionsGrid` converted to async server component, dominant-type left border accent, per-type lucide icons tinted by type color, empty state, `mock-data` import removed

- **2026-04-11** — Dashboard items wired to Neon: new `src/lib/db/items.ts` with `getPinnedItems`, `getRecentItems`, and `getDashboardStats` (parallel counts for items/collections/favorites); `PinnedItems`, `RecentItems`, and `StatsCards` converted to async server components, type-colored left border accents, type + tags joined in queries; `PinnedItems` returns `null` when no items pinned; dashboard main area no longer references `mock-data`

- **2026-04-11** — Sidebar wired to Neon: new `getSystemItemTypes(userId)` in `src/lib/db/items.ts` (parallel `findMany` + `groupBy`, fixed display order: snippet/prompt/command/note/file/image/link); new `getCurrentUser` and `getSidebarCollections(userId)` in `src/lib/db/collections.ts` (favorites + capped recents, dominant-type computed per collection); dashboard layout converted to async server component that fetches sidebar data once and passes to `Sidebar` and `MobileDrawer`; `Sidebar`/`MobileDrawer` accept `data: SidebarData` prop, mock-data import removed; type rows link to `/items/[name]s` with live counts; recent collections render colored dot from `dominantType.color`; "View all collections →" link added; seed marks React Patterns and Terminal Commands as favorites; `src/lib/mock-data.ts` deleted
