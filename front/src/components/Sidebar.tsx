import { MapPinned, ChartScatter } from "lucide-react";

import {
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { open, openMobile, isMobile } = useSidebar();

  const items = [
    {
      title: "Home",
      url: "#",
      icon: MapPinned,
    },
    {
      title: "Data",
      url: "#",
      icon: ChartScatter,
    },
  ];

  return (
    <>
      {isMobile && !openMobile && (
        <SidebarTrigger className="absolute z-1000 bottom-12 left-2 bg-white rounded-full" />
      )}
      <Sidebar>
        <SidebarTrigger className="absolute top-1/2 -translate-y-1/2 -right-3 bg-white rounded-full" />
        <SidebarHeader>{!open ? "US" : "UFOS"}</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <a
            href="https://github.com/Taurien/ufo-sightings"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-xs text-center text-white bg-black rounded-full hover:underline"
          >
            {!open ? (
              "X"
            ) : (
              <>
                Built by <span className="font-medium">Taurien</span>
              </>
            )}
          </a>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
