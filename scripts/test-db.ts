import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  const userCount = await prisma.user.count();
  const itemCount = await prisma.item.count();
  const collectionCount = await prisma.collection.count();
  const tagCount = await prisma.tag.count();
  const itemTypeCount = await prisma.itemType.count();

  console.log("── Record Counts ──────────────────");
  console.log(`  Users:       ${userCount}`);
  console.log(`  Item Types:  ${itemTypeCount}`);
  console.log(`  Items:       ${itemCount}`);
  console.log(`  Collections: ${collectionCount}`);
  console.log(`  Tags:        ${tagCount}`);

  const items = await prisma.item.findMany({
    include: {
      type: true,
      tags: { include: { tag: true } },
      collections: { include: { collection: true } },
    },
  });

  console.log("\n── Items ──────────────────────────");
  for (const item of items) {
    const tags = item.tags.map((t) => t.tag.name).join(", ");
    const cols = item.collections.map((c) => c.collection.name).join(", ");
    console.log(`  [${item.type.name}] ${item.title}`);
    if (tags) console.log(`    Tags: ${tags}`);
    if (cols) console.log(`    Collections: ${cols}`);
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
