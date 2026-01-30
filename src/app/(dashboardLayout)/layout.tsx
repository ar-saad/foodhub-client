import { AppSidebar } from "@/components/layout/app-sidebar";
import DynamicBreadcrumb from "@/components/layout/DynamicBreadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserRoles } from "@/constants/userRoles";
import { userService } from "@/services/user.service";

export default async function DashboardLayout({
  admin,
  user,
}: {
  admin: React.ReactNode;
  user: React.ReactNode;
}) {
  const { data } = await userService.getSession();
  const userInfo = data.user;

  return (
    <SidebarProvider>
      <AppSidebar user={userInfo} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DynamicBreadcrumb />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {userInfo.role === UserRoles.admin ? admin : user}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
