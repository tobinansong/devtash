import Link from "next/link";
import {
  Star,
  MoreHorizontal,
  Folder,
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link as LinkIcon,
  File,
  Image,
  type LucideIcon,
} from "lucide-react";
import {
  getCurrentUserId,
  getRecentCollectionsWithStats,
} from "@/lib/db/collections";

const iconMap: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link: LinkIcon,
  File,
  Image,
};

export async function CollectionsGrid() {
  const userId = await getCurrentUserId();
  const collections = userId
    ? await getRecentCollectionsWithStats(userId, 6)
    : [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Collections</h2>
        <Link
          href="/collections"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No collections yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => {
            const borderColor = col.dominantType?.color;
            return (
              <Link
                key={col.id}
                href={`/collections/${col.id}`}
                className="group rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
                style={
                  borderColor
                    ? { borderLeft: `3px solid ${borderColor}` }
                    : undefined
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="size-4 text-muted-foreground" />
                    <h3 className="font-medium">{col.name}</h3>
                    {col.isFavorite && (
                      <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
                    )}
                  </div>
                  <MoreHorizontal className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    {col.itemCount} {col.itemCount === 1 ? "item" : "items"}
                  </span>
                  {col.types.length > 0 && (
                    <>
                      <span aria-hidden>·</span>
                      <div className="flex items-center gap-1">
                        {col.types.map((t) => {
                          const Icon = iconMap[t.icon];
                          if (!Icon) return null;
                          return (
                            <span
                              key={t.id}
                              title={`${t.name} (${t.count})`}
                              style={{ color: t.color }}
                              className="inline-flex"
                            >
                              <Icon className="size-3.5" />
                            </span>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {col.description && (
                  <p className="mt-2 text-sm text-muted-foreground/70 line-clamp-1">
                    {col.description}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
