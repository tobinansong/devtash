"use client";

import { Boxes, PanelLeftClose, PanelLeftOpen, Menu, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "./SidebarProvider";

export function TopBar() {
  const { collapsed, toggleCollapsed, toggleMobile } = useSidebar();

  return (
    <header className="flex h-14 items-center border-b border-border px-4 md:px-6">
      {/* Mobile drawer toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden mr-2"
        onClick={toggleMobile}
      >
        <Menu className="size-5" />
      </Button>

      {/* Logo */}
      <div className="flex shrink-0 items-center gap-2">
        <Boxes className="size-6 text-primary" />
        <span className="text-lg font-bold">DevStash</span>
      </div>

      {/* Desktop sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:inline-flex ml-2"
        onClick={toggleCollapsed}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-4" />
        ) : (
          <PanelLeftClose className="size-4" />
        )}
      </Button>

      {/* Search */}
      <div className="relative ml-4 w-full max-w-sm hidden sm:block">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search items..."
          className="pl-9"
          readOnly
        />
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" className="hidden sm:inline-flex">
          <Plus className="size-4" />
          New Collection
        </Button>
        <Button>
          <Plus className="size-4" />
          <span className="hidden sm:inline">New Item</span>
        </Button>
      </div>
    </header>
  );
}
