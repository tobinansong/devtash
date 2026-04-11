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
