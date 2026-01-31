import { Route } from "@/types";
import { LayoutDashboard, User, ChefHat } from "lucide-react";

export const adminRoutes: Route[] = [
  {
    title: "User Management",
    items: [
      {
        title: "Home",
        url: "/admin-dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "User List",
        url: "/admin-dashboard/users",
        icon: User,
      },
      {
        title: "Categories",
        url: "/admin-dashboard/categories",
        icon: ChefHat,
      },
    ],
  },
];
