"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MobileSidebar, type SidebarData } from "./Sidebar";
import { useSidebar } from "./SidebarProvider";

export function MobileDrawer({ data }: { data: SidebarData }) {
  const { mobileOpen, closeMobile } = useSidebar();

  return (
    <Sheet open={mobileOpen} onOpenChange={(open) => !open && closeMobile()}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-64 p-0 bg-sidebar"
      >
        <MobileSidebar data={data} />
      </SheetContent>
    </Sheet>
  );
}
