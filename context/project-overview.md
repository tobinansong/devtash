# DevStash — Project Overview

> One fast, searchable, AI-enhanced hub for all your developer knowledge & resources.

---

## The Problem

Developers keep their essentials scattered across too many places:

- Code snippets in VS Code or Notion
- AI prompts buried in chat histories
- Context files lost in project directories
- Useful links spread across browser bookmarks
- Docs in random folders
- Terminal commands in `.bash_history`
- Project templates in GitHub Gists

This causes **context switching**, **lost knowledge**, and **inconsistent workflows**. DevStash solves this by giving developers a single, organized, searchable home for everything.

---

## Target Users

| Persona | Core Need |
|---|---|
| **Everyday Developer** | Fast access to snippets, commands, links |
| **AI-First Developer** | Save & organize prompts, contexts, system messages |
| **Content Creator / Educator** | Store code blocks, explanations, course notes |
| **Full-Stack Builder** | Collect patterns, boilerplates, API examples |

---

## Features

### A. Items & Item Types

Every piece of content in DevStash is an **Item**. Items have a **type** that determines their behavior and appearance. The system ships with built-in types that cannot be modified:

| Type | Content Model | Color | Icon | Availability |
|---|---|---|---|---|
| Snippet | `text` | `#3b82f6` blue | `Code` | Free |
| Prompt | `text` | `#8b5cf6` purple | `Sparkles` | Free |
| Command | `text` | `#f97316` orange | `Terminal` | Free |
| Note | `text` | `#fde047` yellow | `StickyNote` | Free |
| Link | `url` | `#10b981` emerald | `Link` | Free |
| File | `file` | `#6b7280` gray | `File` | Pro |
| Image | `file` | `#ec4899` pink | `Image` | Pro |

> Icons reference [Lucide Icons](https://lucide.dev/icons).

- Items open in a **slide-out drawer** for quick access and creation.
- Users will eventually be able to create **custom types** (Pro, future feature).

### B. Collections

Users can organize items into **collections**. An item can belong to multiple collections (e.g., a React snippet could be in both *"React Patterns"* and *"Interview Prep"*).

### C. Search

Full search across content, titles, tags, and types.

### D. Authentication

- Email/password
- GitHub OAuth

### E. Additional Features

- Favorite collections and items
- Pin items to top
- Recently used items
- Import code from a file
- Markdown editor for text-based types
- File upload for file/image types
- Export data (JSON/ZIP) — Pro
- Dark mode by default, light mode optional
- Add/remove items to/from multiple collections
- View which collections an item belongs to

### F. AI Features (Pro Only)

- Auto-tag suggestions
- Content summaries
- "Explain This Code"
- Prompt optimizer

---

## Data Models

### Entity Relationship Diagram

```
┌──────────┐       ┌───────────┐       ┌────────────┐
│   User   │──1:N──│   Item    │──N:1──│  ItemType  │
└──────────┘       └───────────┘       └────────────┘
                     │       │
                     │ N:M   │ N:M
                     │       │
               ┌─────┘       └─────┐
               ▼                   ▼
         ┌───────────┐       ┌──────────┐
         │ Collection│──N:1──│   User   │
         └───────────┘       └──────────┘
               
         ┌───────────┐
         │    Tag    │──N:M──Item
         └───────────┘
```

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── User (extends NextAuth) ───────────────────────────

model User {
  id                   String       @id @default(cuid())
  name                 String?
  email                String?      @unique
  emailVerified        DateTime?
  image                String?
  password             String?
  isPro                Boolean      @default(false)
  stripeCustomerId     String?      @unique
  stripeSubscriptionId String?      @unique

  accounts    Account[]
  sessions    Session[]
  items       Item[]
  collections Collection[]
  itemTypes   ItemType[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── Item Types ────────────────────────────────────────

model ItemType {
  id       String  @id @default(cuid())
  name     String
  icon     String
  color    String
  isSystem Boolean @default(false)

  userId String?
  user   User?   @relation(fields: [userId], references: [id], onDelete: Cascade)
  items  Item[]

  @@unique([name, userId])
}

// ─── Items ─────────────────────────────────────────────

model Item {
  id          String  @id @default(cuid())
  title       String
  content     String? // text content; null for file types
  url         String? // for link types
  description String?
  language    String? // programming language for snippets
  isFavorite  Boolean @default(false)
  isPinned    Boolean @default(false)

  // File fields (Pro — file/image types)
  fileUrl  String? // Cloudflare R2 URL
  fileName String?
  fileSize Int?    // bytes

  typeId String
  type   ItemType @relation(fields: [typeId], references: [id])

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  collections ItemCollection[]
  tags        ItemTag[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId, typeId])
  @@index([userId, isFavorite])
}

// ─── Collections ───────────────────────────────────────

model Collection {
  id          String  @id @default(cuid())
  name        String
  description String?
  isFavorite  Boolean @default(false)

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items ItemCollection[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

// ─── Join Tables ───────────────────────────────────────

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
}

model Tag {
  id    String    @id @default(cuid())
  name  String    @unique
  items ItemTag[]
}

model ItemTag {
  itemId String
  tagId  String

  item Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
}
```

> **Important:** Never use `db push` to modify the database. Always create migrations with `npx prisma migrate dev` locally and apply them in production with `npx prisma migrate deploy`.

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16 / React 19 | SSR pages, API routes, single repo |
| Language | TypeScript | |
| Database | Neon (PostgreSQL) | Cloud-hosted Postgres |
| ORM | Prisma 7 | [Docs](https://www.prisma.io/docs) — fetch latest |
| Auth | NextAuth v5 | Email/password + GitHub OAuth |
| File Storage | Cloudflare R2 | For file/image uploads (Pro) |
| AI | OpenAI `gpt-5-nano` | Auto-tag, summarize, explain, optimize |
| Styling | Tailwind CSS v4 + shadcn/ui | [shadcn/ui docs](https://ui.shadcn.com) |
| Caching | Redis | Under consideration |

---

## Monetization

### Free Tier

- 50 items total
- 3 collections
- All system types except File & Image
- Basic search
- No file/image uploads
- No AI features

### Pro — $8/month or $72/year

- Unlimited items & collections
- File & Image uploads
- Custom types (future)
- AI auto-tagging, code explanation, prompt optimizer
- Data export (JSON/ZIP)
- Priority support

> During development, all users have full access. Pro gating will be wired up before launch.

---

## UI / UX

### Design Principles

- Modern, minimal, developer-focused
- Dark mode by default
- Clean typography, generous whitespace
- Subtle borders and shadows
- Syntax highlighting for code blocks
- Design references: Notion, Linear, Raycast

### Screenshots
Refer to the screenshots below as a base for the dashboard UI.
It does not have to be exact.  Use it as a reference.

@context\screenshots\dashboard-ui-drawer.png
@context\screenshots\dashboard-ui-main.png

### Layout

- **Sidebar** (collapsible): item type nav links (`/items/snippets`, `/items/commands`, etc.) and recent collections
- **Main area**: grid of color-coded collection cards (background tinted by dominant item type) and item cards (border color matches type)
- **Item drawer**: slide-out panel for viewing/creating/editing items
- **Mobile**: sidebar collapses into a hamburger drawer

### Routes

| Route | Purpose |
|---|---|
| `/` | Dashboard — recent items, pinned, favorites |
| `/items/snippets` | All snippets |
| `/items/prompts` | All prompts |
| `/items/commands` | All commands |
| `/items/notes` | All notes |
| `/items/links` | All links |
| `/items/files` | All files (Pro) |
| `/items/images` | All images (Pro) |
| `/collections` | All collections |
| `/collections/[id]` | Single collection |
| `/search` | Global search |
| `/settings` | Account, billing, preferences |

### Micro-Interactions

- Smooth transitions on navigation and drawer open/close
- Hover states on cards
- Toast notifications for CRUD actions
- Loading skeletons while data fetches
