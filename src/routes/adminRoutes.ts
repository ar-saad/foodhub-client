import { Route } from "@/types";
import { ChartNoAxesCombined, User } from "lucide-react";

export const adminRoutes: Route[] = [
  {
    title: "User Management",
    items: [
      {
        title: "User List",
        url: "/users",
        icon: User,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: ChartNoAxesCombined,
      },
    ],
  },
];
