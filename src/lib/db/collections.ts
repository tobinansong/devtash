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

export type SidebarCollection = {
  id: string;
  name: string;
  isFavorite: boolean;
  dominantType: CollectionTypeSummary | null;
};

export type SidebarCollections = {
  favorites: SidebarCollection[];
  recents: SidebarCollection[];
};

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
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
 * Resolve the current viewer's full profile. Auth is not wired up yet,
 * so we fall back to the seeded demo user.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true, name: true, email: true, image: true },
  });
  return user;
}

/**
 * Fetch the user's collections grouped for the sidebar:
 * - favorites: all favorited collections (most-recently-updated first)
 * - recents:   non-favorited collections, capped to `recentLimit`
 *
 * Each entry includes a `dominantType` (the most-used item type) so the
 * sidebar can render a colored circle for recent collections.
 */
export async function getSidebarCollections(
  userId: string,
  recentLimit = 6
): Promise<SidebarCollections> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      items: {
        include: {
          item: { include: { type: true } },
        },
      },
    },
  });

  const mapped: SidebarCollection[] = collections.map((col) => {
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
      isFavorite: col.isFavorite,
      dominantType: types[0] ?? null,
    };
  });

  return {
    favorites: mapped.filter((c) => c.isFavorite),
    recents: mapped.filter((c) => !c.isFavorite).slice(0, recentLimit),
  };
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
