import { userService } from "@/services/user.service";
import { orderService } from "@/services/order.service";
import { statsService } from "@/services/stats.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  ChefHat,
  ShoppingBag,
  UserIcon,
  UtensilsCrossed,
  DollarSign,
} from "lucide-react";
import { User } from "@/types/user.type";
import { Order } from "@/types";
import OrderListBlock from "@/components/modules/userDashboard/orders/OrderListBlock";
import UserListBlock from "@/components/modules/adminDashboard/users/UserListBlock";
import Link from "next/link";
import RevenueChart from "@/components/modules/dashboard/charts/RevenueChart";
import OrderStatusChart from "@/components/modules/dashboard/charts/OrderStatusChart";

export default async function AdminDashboardHome() {
  // Fetch summary data and lists
  const [statsResult, usersResult, ordersResult] = await Promise.all([
    statsService.getAdminStats(),
    userService.getUsers({
      limit: "5",
    }),
    orderService.getOrders({
      limit: "5",
    }),
  ]);

  const stats = statsResult.data;
  const users: User[] = usersResult.data?.data?.data ?? [];
  const orders: Order[] = ordersResult.data?.data?.data ?? [];

  const statsCards = [
    {
      label: "Total Revenue",
      value: `৳${stats?.totalRevenue ?? 0}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Users",
      value: stats?.counts.totalUsers ?? 0,
      icon: UserIcon,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Orders",
      value: stats?.counts.orders ?? 0,
      icon: ShoppingBag,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Meals",
      value: stats?.counts.meals ?? 0,
      icon: UtensilsCrossed,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome, Admin!</h1>
        <p className="text-muted-foreground">
          Here’s an overview of FoodHub platform activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-3">
        <RevenueChart data={stats?.revenueOverTime ?? []} />
        <OrderStatusChart data={stats?.orderStatusDistribution ?? []} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Recent Users</CardTitle>
              <CardDescription>Your latest users at a glance</CardDescription>
            </div>
            <Link
              href="/admin-dashboard/users"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            <UserListBlock users={users} meta={usersResult.data?.data?.meta} />
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Recent Orders</CardTitle>
              <CardDescription>Your latest orders at a glance</CardDescription>
            </div>
            <Link
              href="/admin-dashboard/orders"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            <OrderListBlock
              orders={orders}
              meta={null}
              role="CUSTOMER"
              detailBaseUrl="/admin-dashboard/orders"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
