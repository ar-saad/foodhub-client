import { userService } from "@/services/user.service";
import { orderService } from "@/services/order.service";
import { categoryService } from "@/services/category.service";
import { mealService } from "@/services/meal.service";
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
} from "lucide-react";
import { User } from "@/types/user.type";
import { Order } from "@/types";
import OrderListBlock from "@/components/modules/userDashboard/orders/OrderListBlock";
import UserListBlock from "@/components/modules/adminDashboard/users/UserListBlock";
import Link from "next/link";

export default async function AdminDashboardHome() {
  // Fetch summary data
  const [usersResult, ordersResult, categoriesResult, mealsResult] =
    await Promise.all([
      userService.getUsers({
        limit: "5",
      }),
      orderService.getOrders({
        limit: "5",
      }),
      categoryService.getAll({
        limit: "1",
      }),
      mealService.getAll({ limit: "1" }),
    ]);

  const users: User[] = usersResult.data?.data?.data ?? [];
  const totalUsers = usersResult.data?.data?.meta?.count ?? 0;
  const orders: Order[] = ordersResult.data?.data?.data ?? [];
  const totalOrders = ordersResult.data?.data?.meta?.count ?? 0;
  const totalCategories = categoriesResult.data?.data?.meta?.count ?? 0;
  const totalMeals = mealsResult.data?.data?.meta?.count ?? 0;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: UserIcon,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Categories",
      value: totalCategories,
      icon: ChefHat,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Meals",
      value: totalMeals,
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

      {/* Recent Orders */}
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
  );
}
