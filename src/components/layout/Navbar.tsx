"use client";

import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import navLogo from "../../../public/logo.webp";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { UserRoles } from "@/constants/userRoles";
import ProfileDropdownMenu from "./ProfileDropdownMenu";
import { User } from "@/types/user.type";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
  user: User;
}

const Navbar = ({
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "FoodHub",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Browse",
      url: "/browse",
    },
    {
      title: "Restaurants",
      url: "/restaurants",
    },
    {
      title: "Contact",
      url: "/contact",
    },
    {
      title: "Dashboard",
      url: "/dashboard",
    },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Register", url: "/register" },
  },
  user,
  className,
}: NavbarProps) => {
  const dashboardUrl = (() => {
    const role = (user as { role?: string } | null)?.role;
    switch (role) {
      case UserRoles.admin:
        return "/admin-dashboard";
      case UserRoles.provider:
        return "/provider-dashboard";
      case UserRoles.customer:
        return "/dashboard";
      default:
        return "/dashboard";
    }
  })();

  const menuWithDashboard = menu.map((item) =>
    item.title === "Dashboard" ? { ...item, url: dashboardUrl } : item,
  );

  const handleLogout = async () => {
    const toastId = toast.loading("User logout processing");
    try {
      const { data, error } = await authClient.signOut();

      if (error) {
        toast.error(error.message, { id: toastId });
        return;
      }

      window.location.href = "/";
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong, please try again", { id: toastId });
    }
  };

  return (
    <section
      className={cn("py-4 w-full sticky top-0 z-10 bg-white", className)}
    >
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              <Image
                src={navLogo}
                className="max-h-8 w-fit dark:invert"
                alt={logo.alt}
              />
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menuWithDashboard.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            {user ? (
              <>
                {user?.role === UserRoles.customer && (
                  <Link href="/become-partner">
                    <Button className="bg-orange-400 hover:bg-orange-500">
                      Become a Partner
                    </Button>
                  </Link>
                )}
                <ProfileDropdownMenu user={user} />
              </>
            ) : (
              <>
                <Link href="/become-partner">
                  <Button className="bg-orange-400 hover:bg-orange-500">
                    Become a Partner
                  </Button>
                </Link>

                <Button asChild variant="outline" size="sm">
                  <Link href={auth.login.url}>{auth.login.title}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={auth.signup.url}>{auth.signup.title}</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <Image
                src={navLogo}
                className="max-h-8 w-fit dark:invert"
                alt={logo.alt}
              />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <Image
                        src={navLogo}
                        className="max-h-8 w-fit dark:invert"
                        alt={logo.alt}
                      />
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menuWithDashboard.map((item) =>
                      renderMobileMenuItem(item),
                    )}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    {user ? (
                      <>
                        {user?.role === UserRoles.customer && (
                          <Link href="/become-partner">
                            <Button className="bg-orange-400 hover:bg-orange-500">
                              Become a Partner
                            </Button>
                          </Link>
                        )}
                        <ProfileDropdownMenu user={user} />
                      </>
                    ) : (
                      <>
                        <Link href="/become-partner">
                          <Button className="bg-orange-400 hover:bg-orange-500">
                            Become a Partner
                          </Button>
                        </Link>

                        <Button asChild variant="outline" size="sm">
                          <Link href={auth.login.url}>{auth.login.title}</Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link href={auth.signup.url}>
                            {auth.signup.title}
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        asChild
        className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        <Link href={item.url}>{item.title}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

export { Navbar };
