import { TopBar } from "@/components/dashboard/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar placeholder */}
        <aside className="flex w-64 flex-col border-r border-border bg-sidebar p-6">
          <h2 className="text-lg font-semibold text-sidebar-foreground">
            Sidebar
          </h2>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
