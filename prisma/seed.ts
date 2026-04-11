import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...\n");

  // ─── Clear existing data ───────────────────────────────

  console.log("Clearing existing data...");
  await prisma.itemTag.deleteMany();
  await prisma.itemCollection.deleteMany();
  await prisma.item.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.itemType.deleteMany();
  await prisma.user.deleteMany();
  console.log("  ✓ Cleared\n");

  // ─── System Item Types ─────────────────────────────────

  const itemTypesData = [
    { name: "snippet", icon: "Code", color: "#3b82f6" },
    { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
    { name: "command", icon: "Terminal", color: "#f97316" },
    { name: "note", icon: "StickyNote", color: "#fde047" },
    { name: "file", icon: "File", color: "#6b7280" },
    { name: "image", icon: "Image", color: "#ec4899" },
    { name: "link", icon: "Link", color: "#10b981" },
  ];

  const types: Record<string, string> = {};

  for (const type of itemTypesData) {
    const created = await prisma.itemType.create({
      data: { ...type, isSystem: true },
    });
    types[type.name] = created.id;
    console.log(`  ✓ Item type: ${type.name}`);
  }

  // ─── Demo User ─────────────────────────────────────────

  const passwordHash = await bcrypt.hash("12345678", 12);

  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@devstash.io",
      password: passwordHash,
      emailVerified: new Date(),
      isPro: false,
    },
  });
  console.log(`\n  ✓ User: ${user.name} (${user.email})`);

  // ─── Helper to create items ────────────────────────────

  async function createItem(data: {
    title: string;
    description: string;
    content?: string | null;
    url?: string | null;
    language?: string | null;
    type: string;
    collectionId: string;
  }) {
    return prisma.item.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content ?? null,
        url: data.url ?? null,
        language: data.language ?? null,
        typeId: types[data.type],
        userId: user.id,
        collections: {
          create: [{ collectionId: data.collectionId }],
        },
      },
    });
  }

  // ─── React Patterns ────────────────────────────────────

  const reactPatterns = await prisma.collection.create({
    data: {
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      isFavorite: true,
      userId: user.id,
    },
  });
  console.log(`\n  ✓ Collection: ${reactPatterns.name}`);

  await createItem({
    title: "useDebounce Hook",
    description: "Debounce a value with a configurable delay",
    language: "typescript",
    type: "snippet",
    collectionId: reactPatterns.id,
    content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}`,
  });

  await createItem({
    title: "Theme Context Provider",
    description: "Compound context provider for dark/light theme switching",
    language: "typescript",
    type: "snippet",
    collectionId: reactPatterns.id,
    content: `import { createContext, useContext, useState, ReactNode } from "react";

type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}`,
  });

  await createItem({
    title: "classNames Utility",
    description: "Tiny utility for conditional className composition",
    language: "typescript",
    type: "snippet",
    collectionId: reactPatterns.id,
    content: `export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}`,
  });

  // ─── AI Workflows ──────────────────────────────────────

  const aiWorkflows = await prisma.collection.create({
    data: {
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      userId: user.id,
    },
  });
  console.log(`  ✓ Collection: ${aiWorkflows.name}`);

  await createItem({
    title: "Thorough Code Review Prompt",
    description: "Prompt for requesting a detailed code review from an LLM",
    type: "prompt",
    collectionId: aiWorkflows.id,
    content: `You are a senior engineer performing a code review. Review the following code for:
1. Bugs and edge cases
2. Performance issues (N+1 queries, unnecessary re-renders, etc.)
3. Security vulnerabilities (injection, XSS, auth bypass)
4. Readability and maintainability
5. Adherence to the project's existing patterns

Provide specific, actionable feedback with line references. Flag critical issues first.`,
  });

  await createItem({
    title: "Documentation Generator",
    description: "Generate JSDoc-style documentation for a function or module",
    type: "prompt",
    collectionId: aiWorkflows.id,
    content: `Generate comprehensive JSDoc documentation for the following code. Include:
- Summary description (1-2 sentences)
- @param tags with types and descriptions
- @returns tag with type and description
- @throws tags for any errors that can be raised
- @example block with a realistic usage

Match the existing doc style in the file if present.`,
  });

  await createItem({
    title: "Refactoring Assistant",
    description: "Guide a safe refactor with tests-first methodology",
    type: "prompt",
    collectionId: aiWorkflows.id,
    content: `Refactor the following code while preserving its public API and behavior. Steps:
1. Identify the current responsibilities of the code
2. Propose a cleaner structure (extracted functions, clearer naming, reduced nesting)
3. List any edge cases the original handled that must be preserved
4. Provide the refactored code
5. List test cases that should pass unchanged to verify behavior

Do not introduce new dependencies without explicit justification.`,
  });

  // ─── DevOps ────────────────────────────────────────────

  const devops = await prisma.collection.create({
    data: {
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      userId: user.id,
    },
  });
  console.log(`  ✓ Collection: ${devops.name}`);

  await createItem({
    title: "Multi-stage Node Dockerfile",
    description: "Production-ready multi-stage Dockerfile for Node.js apps",
    language: "dockerfile",
    type: "snippet",
    collectionId: devops.id,
    content: `FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/index.js"]`,
  });

  await createItem({
    title: "Zero-downtime Deploy Script",
    description: "Rolling deployment with health check verification",
    language: "bash",
    type: "command",
    collectionId: devops.id,
    content: `#!/usr/bin/env bash
set -euo pipefail

IMAGE_TAG="\${1:-latest}"
docker pull myapp:"$IMAGE_TAG"
docker run -d --name myapp-new --health-cmd="curl -f http://localhost/health" myapp:"$IMAGE_TAG"

until [ "$(docker inspect -f '{{.State.Health.Status}}' myapp-new)" = "healthy" ]; do
  sleep 2
done

docker stop myapp-old || true
docker rename myapp-old myapp-retired-$(date +%s) || true
docker rename myapp-new myapp-old`,
  });

  await createItem({
    title: "GitHub Actions Documentation",
    description: "Official GitHub Actions workflow syntax reference",
    url: "https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions",
    type: "link",
    collectionId: devops.id,
  });

  await createItem({
    title: "Docker Compose Reference",
    description: "Official Docker Compose file reference",
    url: "https://docs.docker.com/compose/compose-file/",
    type: "link",
    collectionId: devops.id,
  });

  // ─── Terminal Commands ─────────────────────────────────

  const terminal = await prisma.collection.create({
    data: {
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      isFavorite: true,
      userId: user.id,
    },
  });
  console.log(`  ✓ Collection: ${terminal.name}`);

  await createItem({
    title: "Interactive Git Rebase",
    description: "Rewrite the last N commits interactively",
    language: "bash",
    type: "command",
    collectionId: terminal.id,
    content: `git fetch origin
git rebase -i HEAD~5`,
  });

  await createItem({
    title: "Docker Cleanup",
    description: "Remove stopped containers, unused images, networks, and volumes",
    language: "bash",
    type: "command",
    collectionId: terminal.id,
    content: `docker system prune -af --volumes`,
  });

  await createItem({
    title: "Find Process by Port",
    description: "Identify and kill the process listening on a specific port",
    language: "bash",
    type: "command",
    collectionId: terminal.id,
    content: `lsof -i :3000
kill -9 $(lsof -t -i :3000)`,
  });

  await createItem({
    title: "npm Outdated & Update",
    description: "Check for outdated packages and update to latest compatible versions",
    language: "bash",
    type: "command",
    collectionId: terminal.id,
    content: `npm outdated
npm update
npx npm-check-updates -u && npm install`,
  });

  // ─── Design Resources ──────────────────────────────────

  const design = await prisma.collection.create({
    data: {
      name: "Design Resources",
      description: "UI/UX resources and references",
      userId: user.id,
    },
  });
  console.log(`  ✓ Collection: ${design.name}`);

  await createItem({
    title: "Tailwind CSS Docs",
    description: "Official Tailwind CSS documentation and utility reference",
    url: "https://tailwindcss.com/docs",
    type: "link",
    collectionId: design.id,
  });

  await createItem({
    title: "shadcn/ui",
    description: "Beautifully designed, copy-paste React component library",
    url: "https://ui.shadcn.com",
    type: "link",
    collectionId: design.id,
  });

  await createItem({
    title: "Radix UI Primitives",
    description: "Unstyled, accessible components for building high-quality design systems",
    url: "https://www.radix-ui.com/primitives",
    type: "link",
    collectionId: design.id,
  });

  await createItem({
    title: "Lucide Icons",
    description: "Beautiful & consistent open-source icon library",
    url: "https://lucide.dev/icons",
    type: "link",
    collectionId: design.id,
  });

  console.log("\n✓ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
