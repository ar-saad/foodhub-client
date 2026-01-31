import { Route } from "@/types";
import { ChefHat, User } from "lucide-react";

export const adminRoutes: Route[] = [
  {
    title: "User Management",
    items: [
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
