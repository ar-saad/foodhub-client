import { Route } from "@/types";
import { Hamburger, Home, IdCard, ShoppingCart } from "lucide-react";

export const providerRoutes: Route[] = [
  {
    title: "Profile Management",
    items: [
      {
        title: "Home",
        url: "/provider-dashboard",
        icon: Home,
      },
    ],
  },
  {
    title: "Meal Management",
    items: [
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
