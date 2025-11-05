"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import Footer from "./Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <main className="w-full border-2 border-red-500"> */}
      <SidebarProvider>
        <AppSidebar />
        <div className=" w-full max-h-screen grid grid-rows-[1fr_auto]">
          {children}
          <Footer />
        </div>
      </SidebarProvider>
      {/* </main> */}
    </>
  );
}
