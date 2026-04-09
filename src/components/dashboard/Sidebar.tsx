"use client";

import Link from "next/link";
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link as LinkIcon,
  File,
  Image,
  Star,
  Folder,
  Plus,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./SidebarProvider";
import { itemTypes, collections, typeCounts, currentUser } from "@/lib/mock-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link: LinkIcon,
  File,
  Image,
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function SidebarContent() {
  const { collapsed } = useSidebar();

  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const otherCollections = collections.filter((c) => !c.isFavorite);

  // Sort by updatedAt descending for "most recent"
  const recentCollections = [...otherCollections].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="flex h-full flex-col">
      {/* Types */}
      <div className="flex-shrink-0 px-3 pt-4 pb-2">
        {!collapsed && (
          <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Types
          </h3>
        )}
        <nav className="space-y-0.5">
          {itemTypes.map((type) => {
            const Icon = iconMap[type.icon];
            const count = typeCounts[type.name as keyof typeof typeCounts] ?? 0;
            const href = `/items/${type.name.toLowerCase()}s`;

            if (collapsed) {
              return (
                <Tooltip key={type.id}>
                  <TooltipTrigger
                    render={<Link href={href} />}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground mx-auto"
                  >
                    {Icon && <Icon className="size-4" />}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {type.name} ({count})
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Link
                key={type.id}
                href={href}
                className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {Icon && (
                  <span className="shrink-0" style={{ color: type.color }}>
                    <Icon className="size-4" />
                  </span>
                )}
                <span className="flex-1 truncate">{type.name}s</span>
                <span className="text-xs text-muted-foreground/70">{count}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <Separator className="mx-3" />

      {/* Collections */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {!collapsed && (
          <div className="mb-2 flex items-center justify-between px-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Collections
            </h3>
            <Button variant="ghost" size="icon" className="size-6">
              <Plus className="size-3.5" />
            </Button>
          </div>
        )}

        {collapsed ? (
          <Tooltip>
            <TooltipTrigger
              render={<Link href="/collections" />}
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground mx-auto"
            >
              <Folder className="size-4" />
            </TooltipTrigger>
            <TooltipContent side="right">Collections</TooltipContent>
          </Tooltip>
        ) : (
          <>
            {/* Favorites */}
            {favoriteCollections.length > 0 && (
              <div className="mb-3">
                <h4 className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                  Favorites
                </h4>
                <nav className="space-y-0.5">
                  {favoriteCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Star className="size-3.5 fill-yellow-500 text-yellow-500 shrink-0" />
                      <span className="truncate">{col.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            {/* All collections (most recent) */}
            {recentCollections.length > 0 && (
              <div>
                <h4 className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                  All Collections
                </h4>
                <nav className="space-y-0.5">
                  {recentCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Folder className="size-3.5 shrink-0" />
                      <span className="truncate">{col.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground/70">
                        {col.itemCount}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      <Separator className="mx-3" />

      {/* User area */}
      <div className="flex-shrink-0 p-3">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger className="flex h-9 w-9 items-center justify-center mx-auto cursor-pointer">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right">
              {currentUser.name}
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{currentUser.name}</p>
              <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
            </div>
            <Button variant="ghost" size="icon" className="size-7 shrink-0">
              <Settings className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  const { collapsed } = useSidebar();

  return (
    <TooltipProvider delay={0}>
      <aside
        className={`hidden md:flex flex-col border-r border-border bg-sidebar transition-all duration-300 ${
          collapsed ? "w-[60px]" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>
    </TooltipProvider>
  );
}

export function MobileSidebar() {
  return (
    <TooltipProvider delay={0}>
      <SidebarContent />
    </TooltipProvider>
  );
}
