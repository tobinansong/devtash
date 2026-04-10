import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ─── System Item Types ─────────────────────────────────

  const itemTypes = [
    { name: "Snippet", icon: "Code", color: "#3b82f6", isSystem: true },
    { name: "Prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
    { name: "Command", icon: "Terminal", color: "#f97316", isSystem: true },
    { name: "Note", icon: "StickyNote", color: "#fde047", isSystem: true },
    { name: "Link", icon: "Link", color: "#10b981", isSystem: true },
    { name: "File", icon: "File", color: "#6b7280", isSystem: true },
    { name: "Image", icon: "Image", color: "#ec4899", isSystem: true },
  ];

  const createdTypes: Record<string, string> = {};

  for (const type of itemTypes) {
    const created = await prisma.itemType.upsert({
      where: { name_userId: { name: type.name, userId: "" } },
      update: {},
      create: type,
    });
    createdTypes[type.name] = created.id;
    console.log(`  ✓ Item type: ${type.name}`);
  }

  // ─── Demo User ─────────────────────────────────────────

  const user = await prisma.user.upsert({
    where: { email: "john@devstash.io" },
    update: {},
    create: {
      name: "John Doe",
      email: "john@devstash.io",
      isPro: false,
    },
  });
  console.log(`  ✓ User: ${user.name}`);

  // ─── Collections ───────────────────────────────────────

  const collectionsData = [
    { name: "React Patterns", description: "Common React patterns and hooks", isFavorite: true },
    { name: "Python Snippets", description: "Useful Python code snippets", isFavorite: false },
    { name: "Context Files", description: "AI context files for projects", isFavorite: true },
    { name: "Interview Prep", description: "Technical interview preparation", isFavorite: false },
    { name: "Git Commands", description: "Frequently used git commands", isFavorite: true },
    { name: "AI Prompts", description: "Curated AI prompts for coding", isFavorite: false },
  ];

  const createdCollections: Record<string, string> = {};

  for (const col of collectionsData) {
    const created = await prisma.collection.create({
      data: { ...col, userId: user.id },
    });
    createdCollections[col.name] = created.id;
    console.log(`  ✓ Collection: ${col.name}`);
  }

  // ─── Tags ──────────────────────────────────────────────

  const tagNames = [
    "react", "auth", "hooks", "api", "error-handling", "fetch",
    "git", "rebase", "ai", "code-review", "docker", "devops",
    "migration", "tailwind", "css", "docs", "python", "basics",
  ];

  const createdTags: Record<string, string> = {};

  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    createdTags[name] = tag.id;
  }
  console.log(`  ✓ Tags: ${tagNames.length} created`);

  // ─── Items ─────────────────────────────────────────────

  const itemsData = [
    {
      title: "useAuth Hook",
      description: "Custom authentication hook for React applications",
      content: "export function useAuth() {\n  const [user, setUser] = useState(null);\n  // ...\n}",
      language: "typescript",
      isFavorite: true,
      isPinned: true,
      type: "Snippet",
      tags: ["react", "auth", "hooks"],
      collections: ["React Patterns"],
    },
    {
      title: "API Error Handling Pattern",
      description: "Fetch wrapper with exponential backoff retry logic",
      content: "async function fetchWithRetry(url: string, retries = 3) {\n  // ...\n}",
      language: "typescript",
      isFavorite: false,
      isPinned: true,
      type: "Snippet",
      tags: ["api", "error-handling", "fetch"],
      collections: ["React Patterns"],
    },
    {
      title: "Git Rebase Workflow",
      description: "Step-by-step interactive rebase commands",
      content: "git fetch origin\ngit rebase -i origin/main",
      language: "bash",
      isFavorite: false,
      isPinned: false,
      type: "Command",
      tags: ["git", "rebase"],
      collections: ["Git Commands"],
    },
    {
      title: "Code Review Prompt",
      description: "AI prompt for thorough code reviews",
      content: "Review this code for bugs, performance issues, and security vulnerabilities...",
      language: null,
      isFavorite: true,
      isPinned: false,
      type: "Prompt",
      tags: ["ai", "code-review"],
      collections: ["AI Prompts"],
    },
    {
      title: "Docker Compose Cheatsheet",
      description: "Common Docker Compose commands for development",
      content: "docker compose up -d\ndocker compose logs -f\ndocker compose down -v",
      language: "bash",
      isFavorite: false,
      isPinned: false,
      type: "Command",
      tags: ["docker", "devops"],
      collections: [],
    },
    {
      title: "React 19 Migration Notes",
      description: "Key changes and breaking updates in React 19",
      content: "# React 19 Migration\n\n- New `use` hook\n- Server Components by default\n- ...",
      language: null,
      isFavorite: false,
      isPinned: false,
      type: "Note",
      tags: ["react", "migration"],
      collections: ["React Patterns"],
    },
    {
      title: "Tailwind CSS v4 Docs",
      description: "Official Tailwind CSS v4 documentation",
      content: null,
      url: "https://tailwindcss.com/docs",
      language: null,
      isFavorite: false,
      isPinned: false,
      type: "Link",
      tags: ["tailwind", "css", "docs"],
      collections: [],
    },
    {
      title: "Python List Comprehension",
      description: "Common list comprehension patterns",
      content: "squares = [x**2 for x in range(10)]\nfiltered = [x for x in items if x > 0]",
      language: "python",
      isFavorite: false,
      isPinned: false,
      type: "Snippet",
      tags: ["python", "basics"],
      collections: ["Python Snippets"],
    },
  ];

  for (const item of itemsData) {
    const created = await prisma.item.create({
      data: {
        title: item.title,
        description: item.description,
        content: item.content ?? null,
        url: item.url ?? null,
        language: item.language,
        isFavorite: item.isFavorite,
        isPinned: item.isPinned,
        typeId: createdTypes[item.type],
        userId: user.id,
        tags: {
          create: item.tags.map((tag) => ({
            tagId: createdTags[tag],
          })),
        },
        collections: {
          create: item.collections.map((col) => ({
            collectionId: createdCollections[col],
          })),
        },
      },
    });
    console.log(`  ✓ Item: ${created.title}`);
  }

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
