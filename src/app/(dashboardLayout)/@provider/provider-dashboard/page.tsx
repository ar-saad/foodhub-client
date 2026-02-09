import { providerService } from "@/services/provider.service";
import { orderService } from "@/services/order.service";
import { mealService } from "@/services/meal.service";
import { userService } from "@/services/user.service";
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
} from "lucide-react";
import Link from "next/link";
import MealListBlock from "@/components/modules/providerDashboard/meals/MealListBlock";
import { Meal, Order } from "@/types";

export default async function ProviderDashboardHome() {
  const { data: userData } = await userService.getCurrentUser();
  const provider = userData?.data?.providerProfile ?? null;
  const providerId = provider?.id;

  const [mealsResult, ordersResult] = await Promise.all([
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

  const meals: Meal[] = mealsResult.data?.data?.data ?? [];
  const mealsMeta = mealsResult.data?.data?.meta ?? null;
  const orders: Order[] = ordersResult.data?.data?.data ?? [];
  const ordersMeta = ordersResult.data?.data?.meta ?? null;

  const totalMeals = mealsMeta?.count ?? meals.length;
  const totalOrders = ordersMeta?.count ?? orders.length;
  const activeOrders = orders.filter(
    (o) =>
      o.status === "PLACED" || o.status === "PREPARING" || o.status === "READY",
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;

  const stats = [
    {
      label: "Total Meals",
      value: totalMeals,
      icon: Utensils,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Total Orders",
      value: totalOrders,
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
    {
      label: "Delivered",
      value: deliveredOrders,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
          {/* You can create a ProviderOrderListBlock similar to OrderListBlock for providers if needed */}
          {/* For now, just list basic order info */}
          <ul className="space-y-2">
            {orders.slice(0, 5).map((order) => (
              <li key={order.id} className="border rounded p-3 flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Order #{order.id}</span>
                  <Badge>{order.status}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {order?.customer?.name ?? "Customer"}
                </span>
              </li>
            ))}
            {orders.length === 0 && (
              <li className="text-muted-foreground">No recent orders.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
