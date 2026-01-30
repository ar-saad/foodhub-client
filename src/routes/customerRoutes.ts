import { Route } from "@/types";
import { Home, FilePlus, ScrollText } from "lucide-react";

export const customerRoutes: Route[] = [
  {
    title: "Blog Management",
    items: [
      {
        title: "Home",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Create Blog",
        url: "/dashboard/create-blog",
        icon: FilePlus,
      },
      {
        title: "Blog History",
        url: "/dashboard/blogs",
        icon: ScrollText,
      },
    ],
  },
];
