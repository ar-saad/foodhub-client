import { Route } from "@/types";
import { Hamburger, Home, ShoppingCart } from "lucide-react";

export const providerRoutes: Route[] = [
  {
    title: "Meal Management",
    items: [
      {
        title: "Home",
        url: "/provider-dashboard",
        icon: Home,
      },
      {
        title: "Meals",
        url: "/provider-dashboard/meals",
        icon: Hamburger,
      },
    ],
  },
  {
    title: "Order Management",
    items: [
      {
        title: "Orders",
        url: "/provider-dashboard/orders",
        icon: ShoppingCart,
      },
    ],
  },
];
