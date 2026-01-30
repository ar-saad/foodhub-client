import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { adminRoutes } from "@/routes/adminRoutes";
import { customerRoutes } from "@/routes/customerRoutes";
import { Route } from "@/types";
import { UserRoles } from "@/constants/userRoles";

export function AppSidebar({
  user,
  ...props
}: {
  user: { role: string } & React.ComponentProps<typeof Sidebar>;
}) {
  let routes: Route[] = [];

  switch (user.role) {
    case UserRoles.admin:
      routes = adminRoutes;
      break;
    case UserRoles.customer:
      routes = customerRoutes;
      break;
    default:
      routes = [];
      break;
  }

  const logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "FoodHub",
  };

  return (
    <Sidebar {...props}>
      <SidebarContent>
        {/* Logo */}
        <div className="flex mt-5 px-5">
          <Link href={logo.url} className="flex items-center gap-2">
            <img
              src={logo.src}
              className="max-h-10 dark:invert"
              alt={logo.alt}
            />
            <span className="text-2xl font-semibold tracking-tighter">
              {logo.title}
            </span>
          </Link>
        </div>
        {routes.map((item) => (
          <SidebarGroup key={item.title} className="px-2">
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" /> {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
