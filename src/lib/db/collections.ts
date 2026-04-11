import { prisma } from "@/lib/prisma";

export type CollectionTypeSummary = {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
};

export type CollectionWithStats = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  itemCount: number;
  types: CollectionTypeSummary[];
  dominantType: CollectionTypeSummary | null;
};

const DEMO_USER_EMAIL = "demo@devstash.io";

/**
 * Resolve the user id for the current viewer. Auth is not wired up yet,
 * so we fall back to the seeded demo user.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });
  return user?.id ?? null;
}

/**
 * Fetch the user's most recently updated collections with per-type stats
 * used to color the card border and render type icons.
 */
export async function getRecentCollectionsWithStats(
  userId: string,
  limit = 6
): Promise<CollectionWithStats[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      items: {
        include: {
          item: {
            include: {
              type: true,
            },
          },
        },
      },
    },
  });

  return collections.map((col) => {
    const typeMap = new Map<string, CollectionTypeSummary>();

    for (const link of col.items) {
      const t = link.item.type;
      const existing = typeMap.get(t.id);
      if (existing) {
        existing.count += 1;
      } else {
        typeMap.set(t.id, {
          id: t.id,
          name: t.name,
          icon: t.icon,
          color: t.color,
          count: 1,
        });
      }
    }

    const types = Array.from(typeMap.values()).sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name)
    );

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      createdAt: col.createdAt,
      updatedAt: col.updatedAt,
      itemCount: col.items.length,
      types,
      dominantType: types[0] ?? null,
    };
  });
}
