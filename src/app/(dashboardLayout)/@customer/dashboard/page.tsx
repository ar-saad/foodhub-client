import { userService } from "@/services/user.service";
import { orderService } from "@/services/order.service";
import { reviewService } from "@/services/review.service";
import { Order, OrderStatus } from "@/types/order.type";
import { Review } from "@/types/review.type";
import { User } from "@/types/user.type";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderListBlock from "@/components/modules/userDashboard/orders/OrderListBlock";
import MyReviewsBlock from "@/components/modules/userDashboard/reviews/MyReviewsBlock";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default async function CustomerDashboardHome() {
  const { data: userData } = await userService.getCurrentUser();
  const user: User | null = userData?.data ?? null;
  const userId = user?.id;

  const [ordersResult, reviewsResult] = await Promise.all([
    userId
      ? orderService.getOrders({
          customerId: userId,
          limit: "5",
          sortBy: "createdAt",
          sortOrder: "desc",
        })
      : { data: null, error: null },
    userId
      ? reviewService.getReviews({ customerId: userId, limit: "5" })
      : { data: null, error: null },
  ]);

  const orders: Order[] = ordersResult.data?.data?.data ?? [];
  const ordersMeta = ordersResult.data?.data?.meta ?? null;
  const reviews: Review[] = reviewsResult.data?.data?.data ?? [];
  const reviewsMeta = reviewsResult.data?.data?.meta ?? null;

  const totalOrders = ordersMeta?.count ?? orders.length;
  const activeStatuses = new Set([
    OrderStatus.PLACED,
    OrderStatus.PREPARING,
    OrderStatus.READY,
    OrderStatus.OUT_FOR_DELIVERY,
  ]);
  const activeOrders = orders.filter((o) =>
    activeStatuses.has(o.status),
  ).length;
  const deliveredOrders = orders.filter(
    (o) => o.status === OrderStatus.DELIVERED,
  ).length;
  const totalReviews = reviewsMeta?.count ?? reviews.length;

  const stats = [
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
    {
      label: "My Reviews",
      value: totalReviews,
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0] ?? "there"}!
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

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <CardDescription>Your latest orders at a glance</CardDescription>
          </div>
          <Link
            href="/dashboard/orders"
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
            detailBaseUrl="/dashboard/orders"
          />
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <MyReviewsBlock reviews={reviews} user={user} />
    </div>
  );
}
