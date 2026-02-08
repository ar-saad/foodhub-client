import { Route } from "@/types";
import { Home, ShoppingCart, UserStar } from "lucide-react";

export const customerRoutes: Route[] = [
  {
    title: "General Management",
    items: [
      {
        title: "Home",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Orders",
        url: "/dashboard/orders",
        icon: ShoppingCart,
      },
      {
        title: "Reviews",
        url: "/dashboard/reviews",
        icon: UserStar,
      },
    ],
  },
];
