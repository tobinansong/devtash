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
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./SidebarProvider";
import type { SystemItemType } from "@/lib/db/items";
import type {
  CurrentUser,
  SidebarCollections,
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

export type SidebarData = {
  itemTypes: SystemItemType[];
  collections: SidebarCollections;
  user: CurrentUser | null;
};

const PRO_TYPES = new Set(["file", "image"]);

function capitalize(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function SidebarContent({ data }: { data: SidebarData }) {
  const { collapsed } = useSidebar();
  const { itemTypes, collections, user } = data;
  const userName = user?.name ?? "Guest";
  const userEmail = user?.email ?? "";

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
            const label = `${capitalize(type.name)}s`;
            const href = `/items/${type.name}s`;

            if (collapsed) {
              return (
                <Tooltip key={type.id}>
                  <TooltipTrigger
                    render={<Link href={href} />}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground mx-auto"
                  >
                    {Icon && (
                      <span style={{ color: type.color }}>
                        <Icon className="size-4" />
                      </span>
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {label} ({type.count})
                    {PRO_TYPES.has(type.name) && " · PRO"}
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
                <span className="flex-1 truncate">{label}</span>
                {PRO_TYPES.has(type.name) && (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px] font-semibold">
                    PRO
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground/70">
                  {type.count}
                </span>
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
            {collections.favorites.length > 0 && (
              <div className="mb-3">
                <h4 className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                  Favorites
                </h4>
                <nav className="space-y-0.5">
                  {collections.favorites.map((col) => (
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

            {/* Recent collections */}
            {collections.recents.length > 0 && (
              <div>
                <h4 className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                  Recent
                </h4>
                <nav className="space-y-0.5">
                  {collections.recents.map((col) => {
                    const dotColor = col.dominantType?.color ?? "#6b7280";
                    return (
                      <Link
                        key={col.id}
                        href={`/collections/${col.id}`}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <span
                          aria-hidden
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: dotColor }}
                        />
                        <span className="truncate">{col.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* View all collections */}
            <div className="mt-3 px-2">
              <Link
                href="/collections"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all collections →
              </Link>
            </div>
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
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right">{userName}</TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {userEmail}
              </p>
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

export function Sidebar({ data }: { data: SidebarData }) {
  const { collapsed } = useSidebar();

  return (
    <TooltipProvider delay={0}>
      <aside
        className={`hidden md:flex flex-col border-r border-border bg-sidebar transition-all duration-300 ${
          collapsed ? "w-[60px]" : "w-64"
        }`}
      >
        <SidebarContent data={data} />
      </aside>
    </TooltipProvider>
  );
}

export function MobileSidebar({ data }: { data: SidebarData }) {
  return (
    <TooltipProvider delay={0}>
      <SidebarContent data={data} />
    </TooltipProvider>
  );
}
