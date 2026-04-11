import { prisma } from "@/lib/prisma";

export type ItemTypeSummary = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type ItemWithType = {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  type: ItemTypeSummary;
  tags: string[];
};

export type DashboardStats = {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
};

export type SystemItemType = {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
};

const SYSTEM_TYPE_ORDER = [
  "snippet",
  "prompt",
  "command",
  "note",
  "file",
  "image",
  "link",
];

function mapItem(item: {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  type: { id: string; name: string; icon: string; color: string };
  tags: { tag: { name: string } }[];
}): ItemWithType {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    content: item.content,
    url: item.url,
    language: item.language,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    type: {
      id: item.type.id,
      name: item.type.name,
      icon: item.type.icon,
      color: item.type.color,
    },
    tags: item.tags.map((t) => t.tag.name),
  };
}

/**
 * Fetch the user's pinned items, most recently updated first.
 */
export async function getPinnedItems(
  userId: string
): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { updatedAt: "desc" },
    include: {
      type: true,
      tags: { include: { tag: true } },
    },
  });
  return items.map(mapItem);
}

/**
 * Fetch the user's most recently updated items.
 */
export async function getRecentItems(
  userId: string,
  limit = 10
): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      type: true,
      tags: { include: { tag: true } },
    },
  });
  return items.map(mapItem);
}

/**
 * Fetch all system item types with the current user's per-type item counts.
 * Used to render the sidebar Types nav.
 */
export async function getSystemItemTypes(
  userId: string
): Promise<SystemItemType[]> {
  const [types, counts] = await Promise.all([
    prisma.itemType.findMany({ where: { isSystem: true } }),
    prisma.item.groupBy({
      by: ["typeId"],
      where: { userId },
      _count: { _all: true },
    }),
  ]);

  const countMap = new Map<string, number>();
  for (const c of counts) {
    countMap.set(c.typeId, c._count._all);
  }

  return types
    .map((t) => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      color: t.color,
      count: countMap.get(t.id) ?? 0,
    }))
    .sort((a, b) => {
      const ai = SYSTEM_TYPE_ORDER.indexOf(a.name);
      const bi = SYSTEM_TYPE_ORDER.indexOf(b.name);
      const aOrd = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
      const bOrd = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
      return aOrd - bOrd || a.name.localeCompare(b.name);
    });
}

/**
 * Aggregate counts for the dashboard stats cards.
 */
export async function getDashboardStats(
  userId: string
): Promise<DashboardStats> {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] =
    await Promise.all([
      prisma.item.count({ where: { userId } }),
      prisma.collection.count({ where: { userId } }),
      prisma.item.count({ where: { userId, isFavorite: true } }),
      prisma.collection.count({ where: { userId, isFavorite: true } }),
    ]);

  return {
    totalItems,
    totalCollections,
    favoriteItems,
    favoriteCollections,
  };
}
