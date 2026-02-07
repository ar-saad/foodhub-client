"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRoles } from "@/constants/userRoles";
import { authClient } from "@/lib/auth-client";
import { useUser } from "@/contexts/UserContext";
import { User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function ProfileDropdownMenu() {
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    const toastId = toast.loading("User logout processing");
    try {
      const { data, error } = await authClient.signOut();

      if (error) {
        toast.error(error.message, { id: toastId });
        return;
      }

      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong, please try again", { id: toastId });
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {user?.image ? (
          <Image
            src={user.image}
            alt="profile picture"
            width={40}
            height={40}
            className="rounded-full cursor-pointer border border-primary p-0.5"
          />
        ) : (
          <Button variant="outline" className="rounded-full">
            <UserIcon />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 mr-2" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={
                user.role === UserRoles.admin
                  ? "/admin-dashboard/profile"
                  : user.role === UserRoles.provider
                    ? "/provider-dashboard/profile"
                    : "/dashboard/profile"
              }
            >
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={
                user.role === UserRoles.admin
                  ? "/admin-dashboard"
                  : user.role === UserRoles.provider
                    ? "/provider-dashboard"
                    : "/dashboard"
              }
            >
              Dashboard
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleLogout()}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
