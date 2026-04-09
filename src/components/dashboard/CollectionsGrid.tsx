import Link from "next/link";
import { Star, MoreHorizontal, Folder } from "lucide-react";
import { collections } from "@/lib/mock-data";

// Sort by updatedAt descending to show most recent first
const recentCollections = [...collections].sort(
  (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
);

export function CollectionsGrid() {
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentCollections.map((col) => (
          <Link
            key={col.id}
            href={`/collections/${col.id}`}
            className="group rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
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
            <p className="mt-1 text-sm text-muted-foreground">
              {col.itemCount} items
            </p>
            {col.description && (
              <p className="mt-2 text-sm text-muted-foreground/70 line-clamp-1">
                {col.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
