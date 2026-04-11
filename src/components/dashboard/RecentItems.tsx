import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCurrentUserId } from "@/lib/db/collections";
import { getRecentItems } from "@/lib/db/items";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export async function RecentItems() {
  const userId = await getCurrentUserId();
  const recentItems = userId ? await getRecentItems(userId, 10) : [];

  if (recentItems.length === 0) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Clock className="size-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Recent Items</h2>
      </div>
      <div className="space-y-2">
        {recentItems.map((item) => {
          const type = item.type;
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50 cursor-pointer"
              style={{ borderLeft: `3px solid ${type.color}` }}
            >
              <div
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: type.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{item.title}</h3>
                  {item.isFavorite && (
                    <span className="text-yellow-500 shrink-0 text-sm">&#9733;</span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground truncate">
                    {item.description}
                  </p>
                )}
                {item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <span
                className="shrink-0 rounded px-2 py-0.5 text-xs font-medium capitalize"
                style={{
                  color: type.color,
                  backgroundColor: `${type.color}15`,
                }}
              >
                {type.name}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(item.updatedAt)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
