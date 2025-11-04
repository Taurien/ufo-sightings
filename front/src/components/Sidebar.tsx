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
  const { open } = useSidebar();

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
      <Sidebar>
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
        <SidebarTrigger className={!open ? "mx-auto" : "ml-auto"} />
        <SidebarFooter>
          <a
            href="https://github.com/Taurien/ufo-sightings"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-xs text-center text-white bg-black rounded-full hover:underline"
          >
            {!open ? (
              ""
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
