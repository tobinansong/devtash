import { TopBar } from "@/components/dashboard/TopBar";
import { Sidebar, type SidebarData } from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/dashboard/SidebarProvider";
import { MobileDrawer } from "@/components/dashboard/MobileDrawer";
import {
  getCurrentUser,
  getCurrentUserId,
  getSidebarCollections,
} from "@/lib/db/collections";
import { getSystemItemTypes } from "@/lib/db/items";

async function getSidebarData(): Promise<SidebarData> {
  const [user, userId] = await Promise.all([
    getCurrentUser(),
    getCurrentUserId(),
  ]);

  if (!userId) {
    return {
      itemTypes: [],
      collections: { favorites: [], recents: [] },
      user,
    };
  }

  const [itemTypes, collections] = await Promise.all([
    getSystemItemTypes(userId),
    getSidebarCollections(userId),
  ]);

  return { itemTypes, collections, user };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarData = await getSidebarData();

  return (
    <SidebarProvider>
      <div className="flex h-screen flex-col">
        <TopBar />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar data={sidebarData} />
          <MobileDrawer data={sidebarData} />

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
