"use client";
import * as React from "react";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { data } from "@/constants";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { usePathname } from "next/navigation";
import Logo from "./logo";
import { useClerk } from "@clerk/nextjs";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const url = usePathname();
  const { signOut } = useClerk();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="ml-2 h-16 w-full">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="gap-2 mt-10">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger className="items-center text-lg">
                  {item.title}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.url === url}>
                          <a href={item.url}>
                            <item.icon />
                            {item.title}
                          </a>
                        </SidebarMenuButton>
                        {item.title === "Pending to Approve" && (
                          <SidebarMenuBadge>
                            <Badge className="rounded-full">24</Badge>
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="flex items-center justify-center h-20">
        <Button
          className="w-full"
          onClick={() => signOut({ redirectUrl: "/" })}
        >
          Logout
        </Button>

        <p className="text-xs">
          Designed & Developed by{" "}
          <Link href="https://www.claviq.com">
            <span className="text-orange-600 font-semibold">Claviq</span>
          </Link>
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
