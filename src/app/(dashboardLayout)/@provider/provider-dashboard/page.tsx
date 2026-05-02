import { providerService } from "@/services/provider.service";
import { orderService } from "@/services/order.service";
import { mealService } from "@/services/meal.service";
import { userService } from "@/services/user.service";
import { statsService } from "@/services/stats.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Utensils,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import MealListBlock from "@/components/modules/providerDashboard/meals/MealListBlock";
import { Meal, Order } from "@/types";
import RevenueChart from "@/components/modules/dashboard/charts/RevenueChart";
import TopMealsChart from "@/components/modules/dashboard/charts/TopMealsChart";

export default async function ProviderDashboardHome() {
  const { data: userData } = await userService.getCurrentUser();
  const provider = userData?.data?.providerProfile ?? null;
  const providerId = provider?.id;

  const [statsResult, mealsResult, ordersResult] = await Promise.all([
    statsService.getProviderStats(),
    providerId
      ? mealService.getAll({
          providerId,
          limit: "5",
          sortBy: "createdAt",
          sortOrder: "desc",
        })
      : { data: null, error: null },
    providerId
      ? orderService.getOrders({
          providerId,
          limit: "5",
          sortBy: "createdAt",
          sortOrder: "desc",
        })
      : { data: null, error: null },
  ]);

  const stats = statsResult.data;
  const meals: Meal[] = mealsResult.data?.data?.data ?? [];
  const mealsMeta = mealsResult.data?.data?.meta ?? null;
  const orders: Order[] = ordersResult.data?.data?.data ?? [];

  const activeOrders = orders.filter(
    (o) =>
      o.status === "PLACED" || o.status === "PREPARING" || o.status === "READY",
  ).length;

  const statsCards = [
    {
      label: "Total Revenue",
      value: `৳${stats?.totalRevenue ?? 0}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Meals",
      value: stats?.counts.meals ?? 0,
      icon: Utensils,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Total Orders",
      value: stats?.counts.orders ?? 0,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Orders",
      value: activeOrders,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {provider?.name?.split(" ")[0] ?? "Provider"}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your activity on FoodHub.
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
        <RevenueChart
          data={stats?.revenueOverTime ?? []}
          description="Your restaurant's daily revenue"
        />
        <TopMealsChart data={stats?.topSellingMeals ?? []} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Meals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Recent Meals</CardTitle>
              <CardDescription>Your latest meals at a glance</CardDescription>
            </div>
            <Link
              href="/dashboard/provider-dashboard/meals"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            <MealListBlock
              meals={meals}
              meta={
                mealsMeta ?? {
                  limit: 5,
                  page: 1,
                  count: meals.length,
                  totalPages: 1,
                }
              }
            />
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
              href="/dashboard/provider-dashboard/orders"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {orders.slice(0, 5).map((order) => (
                <li key={order.id} className="border rounded p-3 flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">Order #{order.id.slice(-8)}</span>
                    <Badge variant="secondary">{order.status}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {order?.customer?.name ?? "Customer"} • ৳{Number(order.totalAmount)}
                  </span>
                </li>
              ))}
              {orders.length === 0 && (
                <li className="text-muted-foreground py-8 text-center text-sm italic">
                  No recent orders.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
