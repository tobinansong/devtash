import { Boxes, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TopBar() {
  return (
    <header className="flex h-14 items-center border-b border-border px-6">
      {/* Logo */}
      <div className="flex w-64 shrink-0 items-center gap-2">
        <Boxes className="size-6 text-primary" />
        <span className="text-lg font-bold">DevStash</span>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
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
        <Button variant="outline">
          <Plus className="size-4" />
          New Collection
        </Button>
        <Button>
          <Plus className="size-4" />
          New Item
        </Button>
      </div>
    </header>
  );
}
