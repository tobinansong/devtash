import { Boxes, FolderOpen, Star, Heart } from "lucide-react";
import { getCurrentUserId } from "@/lib/db/collections";
import { getDashboardStats } from "@/lib/db/items";

export async function StatsCards() {
  const userId = await getCurrentUserId();
  const stats = userId
    ? await getDashboardStats(userId)
    : {
        totalItems: 0,
        totalCollections: 0,
        favoriteItems: 0,
        favoriteCollections: 0,
      };

  const cards = [
    {
      label: "Total Items",
      value: stats.totalItems,
      icon: Boxes,
      color: "text-blue-500",
    },
    {
      label: "Collections",
      value: stats.totalCollections,
      icon: FolderOpen,
      color: "text-emerald-500",
    },
    {
      label: "Favorite Items",
      value: stats.favoriteItems,
      icon: Star,
      color: "text-yellow-500",
    },
    {
      label: "Favorite Collections",
      value: stats.favoriteCollections,
      icon: Heart,
      color: "text-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <stat.icon className={`size-4 ${stat.color}`} />
          </div>
          <p className="mt-2 text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
