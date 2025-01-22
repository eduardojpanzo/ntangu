import { AppHeader } from "@/components/section/app-header";
import { AppSidebar } from "@/components/section/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="w-full lg:max-w-[calc(100dvw-256px)] mx-auto p-4 bg-background min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
