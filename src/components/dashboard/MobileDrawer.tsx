"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MobileSidebar } from "./Sidebar";
import { useSidebar } from "./SidebarProvider";

export function MobileDrawer() {
  const { mobileOpen, closeMobile } = useSidebar();

  return (
    <Sheet open={mobileOpen} onOpenChange={(open) => !open && closeMobile()}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-64 p-0 bg-sidebar"
      >
        <MobileSidebar />
      </SheetContent>
    </Sheet>
  );
}
