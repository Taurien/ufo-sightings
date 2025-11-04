"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <main className="w-full border-2 border-red-500"> */}
      <SidebarProvider>
        <AppSidebar />
        <div className=" w-full @border-4 border-green-500">{children}</div>
      </SidebarProvider>
      {/* </main> */}
    </>
  );
}
