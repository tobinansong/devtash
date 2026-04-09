import { Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { items, itemTypes } from "@/lib/mock-data";

const pinnedItems = items.filter((i) => i.isPinned);

function getItemType(typeId: string) {
  return itemTypes.find((t) => t.id === typeId);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function PinnedItems() {
  if (pinnedItems.length === 0) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Pin className="size-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Pinned</h2>
      </div>
      <div className="space-y-2">
        {pinnedItems.map((item) => {
          const type = getItemType(item.typeId);
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50 cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{item.title}</h3>
                  <Pin className="size-3 text-muted-foreground shrink-0" />
                  {item.isFavorite && (
                    <span className="text-yellow-500 shrink-0">&#9733;</span>
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
              {type && (
                <span
                  className="shrink-0 rounded px-2 py-0.5 text-xs font-medium"
                  style={{
                    color: type.color,
                    backgroundColor: `${type.color}15`,
                  }}
                >
                  {type.name}
                </span>
              )}
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
