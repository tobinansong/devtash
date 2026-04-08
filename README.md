# DevStash

A developer knowledge hub — one fast, searchable place for all your snippets, commands, prompts, notes, links, files, and images.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

## The Problem

Developers keep their essentials scattered across too many places — snippets in VS Code, prompts buried in chat histories, commands in `.bash_history`, links across browser bookmarks, docs in random folders. DevStash brings it all into one organized, searchable home.

## Features

- **7 Item Types** — Snippets, Prompts, Commands, Notes, Links, Files, and Images
- **Collections** — Organize items into collections (items can belong to multiple)
- **Search** — Full search across content, titles, tags, and types
- **Favorites & Pins** — Quick access to what matters most
- **Slide-out Drawer** — Fast item creation and viewing
- **Dark Mode** — Developer-friendly dark theme by default
- **Auth** — Email/password and GitHub OAuth
- **AI Features** (Pro) — Auto-tagging, code explanation, prompt optimization

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 / React 19 |
| Language | TypeScript |
| Database | Neon (PostgreSQL) |
| ORM | Prisma 7 |
| Auth | NextAuth v5 |
| File Storage | Cloudflare R2 |
| AI | OpenAI gpt-5-nano |
| Styling | Tailwind CSS v4 + shadcn/ui |

## Getting Started

### Prerequisites

- Node.js 24+
- PostgreSQL database (or [Neon](https://neon.tech) account)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/devtash.git
cd devtash

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your database URL, auth secrets, etc.

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## License

MIT
