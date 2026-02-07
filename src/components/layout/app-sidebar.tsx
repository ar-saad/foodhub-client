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
import { providerRoutes } from "@/routes/providerRoutes";
import { customerRoutes } from "@/routes/customerRoutes";
import { Route } from "@/types";
import { UserRoles } from "@/constants/userRoles";
import logo from "../../../public/logo.webp";
import Image from "next/image";
import { IdCard } from "lucide-react";
import { User } from "@/types/user.type";

export function AppSidebar({ user, ...props }: { user: User }) {
  let routes: Route[] = [];

  switch (user.role) {
    case UserRoles.admin:
      routes = adminRoutes;
      break;
    case UserRoles.provider:
      routes = providerRoutes.map((group, index) =>
        index === 0
          ? {
              ...group,
              items: [
                ...group.items,
                {
                  title: "Restaurant Profile",
                  url: `/provider-dashboard/provider-profile/${user.providerProfile?.id}`,
                  icon: IdCard,
                },
              ],
            }
          : group,
      );
      break;
    case UserRoles.customer:
      routes = customerRoutes;
      break;
    default:
      routes = [];
      break;
  }

  return (
    <Sidebar {...props}>
      <SidebarContent>
        {/* Logo */}
        <div className="flex mt-5 px-5">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              className="max-h-10 w-fit dark:invert"
              alt="FoodHub"
            />
          </Link>
        </div>
        {routes.map((item) => (
          <SidebarGroup key={item.title} className="px-2">
            <SidebarGroupLabel className="text-primary">
              {item.title}
            </SidebarGroupLabel>
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
