import { NextRequest, NextResponse } from "next/server";
import { userService } from "./services/user.service";
import { UserRoles } from "./constants/userRoles";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let isAuthenticated: boolean = false;
  let userRole: string | null = null;

  const { data } = await userService.getSession();

  if (data) {
    isAuthenticated = true;
    userRole = data.user.role;
  }

  //* User is not authenticated
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //* Define dashboard routes for each role
  const roleDashboardMap: Record<string, string> = {
    [UserRoles.admin]: "/admin-dashboard",
    [UserRoles.provider]: "/provider-dashboard",
    [UserRoles.customer]: "/dashboard",
  };

  //* Get the correct dashboard for the user's role
  const userDashboard = roleDashboardMap[userRole as string];

  //* If user tries to access a dashboard that's not theirs, redirect to their dashboard
  if (pathname.startsWith("/dashboard") && userRole !== UserRoles.customer) {
    return NextResponse.redirect(new URL(userDashboard, request.url));
  }

  if (
    pathname.startsWith("/provider-dashboard") &&
    userRole !== UserRoles.provider
  ) {
    return NextResponse.redirect(new URL(userDashboard, request.url));
  }

  if (pathname.startsWith("/admin-dashboard") && userRole !== UserRoles.admin) {
    return NextResponse.redirect(new URL(userDashboard, request.url));
  }

  // Default: allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/provider-dashboard",
    "/provider-dashboard/:path*",
    "/admin-dashboard",
    "/admin-dashboard/:path*",
  ],
};
