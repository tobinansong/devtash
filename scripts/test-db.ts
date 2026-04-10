import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  // ─── Record counts ─────────────────────────────────────

  const [userCount, itemTypeCount, itemCount, collectionCount] = await Promise.all([
    prisma.user.count(),
    prisma.itemType.count(),
    prisma.item.count(),
    prisma.collection.count(),
  ]);

  console.log("── Record Counts ──────────────────");
  console.log(`  Users:       ${userCount}`);
  console.log(`  Item Types:  ${itemTypeCount}`);
  console.log(`  Collections: ${collectionCount}`);
  console.log(`  Items:       ${itemCount}`);

  // ─── Demo user ─────────────────────────────────────────

  const demoUser = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
  });

  if (!demoUser) {
    throw new Error("Demo user not found — run `npm run db:seed` first.");
  }

  console.log("\n── Demo User ──────────────────────");
  console.log(`  Name:          ${demoUser.name}`);
  console.log(`  Email:         ${demoUser.email}`);
  console.log(`  isPro:         ${demoUser.isPro}`);
  console.log(`  emailVerified: ${demoUser.emailVerified?.toISOString() ?? "null"}`);

  // Verify the seeded password hash works
  const passwordOk = demoUser.password
    ? await bcrypt.compare("12345678", demoUser.password)
    : false;
  console.log(`  Password:      ${passwordOk ? "✓ verified (12345678)" : "✗ hash mismatch"}`);

  // ─── Item types ────────────────────────────────────────

  const itemTypes = await prisma.itemType.findMany({
    orderBy: { name: "asc" },
  });

  console.log("\n── Item Types ─────────────────────");
  for (const type of itemTypes) {
    console.log(`  ${type.name.padEnd(10)} ${type.color}  ${type.icon}`);
  }

  // ─── Collections with items ────────────────────────────

  const collections = await prisma.collection.findMany({
    where: { userId: demoUser.id },
    include: {
      items: {
        include: {
          item: { include: { type: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  console.log("\n── Collections ────────────────────");
  for (const col of collections) {
    console.log(`\n  ▸ ${col.name} (${col.items.length} items)`);
    console.log(`    ${col.description}`);
    for (const link of col.items) {
      const { item } = link;
      const meta = item.url ? ` → ${item.url}` : "";
      console.log(`      [${item.type.name}] ${item.title}${meta}`);
    }
  }

  console.log("\n✓ Database connection successful!");
}

main()
  .catch((e) => {
    console.error("✗ Database test failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
