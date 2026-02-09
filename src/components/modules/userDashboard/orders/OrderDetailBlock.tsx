"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/actions/order.actions";
import { Order, OrderStatus } from "@/types/order.type";
import { Review } from "@/types/review.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Package,
  User,
  Store,
  Clock,
  CalendarDays,
  Ban,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import { useUser } from "@/contexts/UserContext";
import ReviewFormDialog from "@/components/modules/common/ReviewFormDialog";
import StarRating from "@/components/modules/common/StarRating";

type OrderDetailRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

interface OrderDetailBlockProps {
  order: Order;
  role: OrderDetailRole;
}

const statusVariantMap: Record<
  OrderStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  [OrderStatus.PLACED]: "outline",
  [OrderStatus.PREPARING]: "secondary",
  [OrderStatus.READY]: "default",
  [OrderStatus.OUT_FOR_DELIVERY]: "default",
  [OrderStatus.DELIVERED]: "default",
  [OrderStatus.CANCELLED]: "destructive",
};

const statusColorMap: Record<OrderStatus, string> = {
  [OrderStatus.PLACED]: "border-blue-400 text-blue-600",
  [OrderStatus.PREPARING]: "border-yellow-400 text-yellow-600",
  [OrderStatus.READY]: "bg-emerald-100 border-emerald-400 text-emerald-700",
  [OrderStatus.OUT_FOR_DELIVERY]:
    "bg-orange-100 border-orange-400 text-orange-700",
  [OrderStatus.DELIVERED]: "bg-green-600 text-white",
  [OrderStatus.CANCELLED]: "",
};

const statusSteps: OrderStatus[] = [
  OrderStatus.PLACED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
];

function formatCurrency(amount: string | number) {
  return `৳${Number(amount).toFixed(2)}`;
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

function getProviderNextStatuses(current: OrderStatus): OrderStatus[] {
  const currentIdx = statusSteps.indexOf(current);
  if (currentIdx === -1) return [];
  return [...statusSteps.slice(currentIdx + 1), OrderStatus.CANCELLED];
}

export default function OrderDetailBlock({
  order,
  role,
}: OrderDetailBlockProps) {
  const router = useRouter();
  const { user } = useUser();
  const [updating, setUpdating] = useState(false);

  // Build a mealId → Review map from order.reviews
  const reviewMap = useMemo(() => {
    const map: Record<string, Review> = {};
    if (order.reviews) {
      for (const review of order.reviews) {
        map[review.mealId] = review;
      }
    }
    return map;
  }, [order.reviews]);

  const isCancelled = order.status === OrderStatus.CANCELLED;
  const currentStepIdx = statusSteps.indexOf(order.status);
  const showCustomerInfo = role === "PROVIDER" || role === "ADMIN";
  const showProviderInfo = role === "CUSTOMER" || role === "ADMIN";
  const canCustomerCancel =
    role === "CUSTOMER" && order.status === OrderStatus.PLACED;
  const providerNextStatuses =
    role === "PROVIDER" ? getProviderNextStatuses(order.status) : [];
  const canReview =
    role === "CUSTOMER" && order.status === OrderStatus.DELIVERED;

  async function handleStatusUpdate(newStatus: OrderStatus) {
    setUpdating(true);
    const toastId = toast.loading("Updating order status...");
    try {
      const result = await updateOrderStatus({
        orderId: order.id,
        status: newStatus,
      });
      if (result.error) {
        toast.error(result.error.message, { id: toastId });
      } else {
        toast.success(`Order status updated to ${formatStatus(newStatus)}`, {
          id: toastId,
        });
        router.refresh();
      }
    } catch {
      toast.error("Failed to update order status.", { id: toastId });
    } finally {
      setUpdating(false);
    }
  }

  function handleReviewSuccess() {
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-sm text-muted-foreground font-mono">
              #{order.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge
            variant={statusVariantMap[order.status]}
            className={`${statusColorMap[order.status]} text-sm px-3 py-1`}
          >
            {formatStatus(order.status)}
          </Badge>

          {canCustomerCancel && (
            <ConfirmationDialog
              title="Cancel Order"
              description="Are you sure you want to cancel this order? This action cannot be undone."
              variant="destructive"
              trigger={
                <>
                  <Ban className="h-4 w-4 mr-1" /> Cancel Order
                </>
              }
              disabled={updating}
              actionFunction={() => handleStatusUpdate(OrderStatus.CANCELLED)}
            />
          )}

          {role === "PROVIDER" && providerNextStatuses.length > 0 && (
            <Select
              key={order.status}
              disabled={updating}
              onValueChange={(val) => handleStatusUpdate(val as OrderStatus)}
            >
              <SelectTrigger className="w-auto border-primary text-primary font-medium ring-1 ring-primary/20">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                {providerNextStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === OrderStatus.CANCELLED
                      ? "Cancel Order"
                      : `Mark as ${formatStatus(s)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Status Tracker */}
      {!isCancelled ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" /> Order Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {statusSteps.map((step, idx) => {
                const isActive = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div
                    key={step}
                    className="flex-1 flex flex-col items-center relative"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-muted-foreground/30"
                      } ${isCurrent ? "ring-2 ring-primary/30 ring-offset-2" : ""}`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`mt-2 text-xs text-center ${
                        isActive
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatStatus(step)}
                    </span>
                    {idx < statusSteps.length - 1 && (
                      <div
                        className={`absolute top-4 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-0.5 ${
                          idx < currentStepIdx
                            ? "bg-primary"
                            : "bg-muted-foreground/20"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <p className="text-destructive font-medium text-center">
              This order has been cancelled.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" /> Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-xs">{order.id}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5" /> Payment
              </span>
              <Badge variant="outline">{order.paymentType}</Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Delivery Address
              </span>
              <span className="text-right max-w-50">{order.address}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" /> Placed On
              </span>
              <span>
                {order.createdAt
                  ? format(new Date(order.createdAt), "MMM d, yyyy hh:mm a")
                  : "—"}
              </span>
            </div>
            {order.updatedAt && order.updatedAt !== order.createdAt && (
              <>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>
                    {format(new Date(order.updatedAt), "MMM d, yyyy hh:mm a")}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Customer / Provider Info */}
        <div className="space-y-6">
          {showProviderInfo && order.providerProfile && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Store className="h-4 w-4" /> Restaurant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {order.providerProfile.logo && (
                    <Image
                      src={order.providerProfile.logo}
                      alt={order.providerProfile.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  )}
                  <div>
                    <Link
                      href={`/restaurants/${order.providerProfile.id}`}
                      className="font-medium hover:underline text-primary"
                    >
                      {order.providerProfile.name}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {showCustomerInfo && order.customer && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" /> Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{order.customer.name}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{order.customer.email}</span>
                </div>
                {order.customer.phone && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone</span>
                      <span>{order.customer.phone}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Order Items</CardTitle>
          <CardDescription>
            {order.orderItems.length}{" "}
            {order.orderItems.length === 1 ? "item" : "items"} in this order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  {canReview && (
                    <TableHead className="text-center">Review</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.orderItems.map((item, index) => (
                  <TableRow key={item.mealId}>
                    <TableCell className="w-10">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.meal?.image && (
                          <Image
                            src={item.meal.image}
                            alt={item.meal?.name ?? "Meal"}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                        )}
                        <span className="font-medium">
                          {item.meal?.name ?? item.mealId.slice(0, 12)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </TableCell>
                    {canReview && user && (
                      <TableCell className="text-center">
                        {reviewMap[item.mealId] ? (
                          <div className="flex flex-col items-center gap-1">
                            <StarRating
                              value={reviewMap[item.mealId].rating}
                              readonly
                              size="sm"
                            />
                            <ReviewFormDialog
                              trigger={
                                <button className="text-xs text-primary hover:underline cursor-pointer">
                                  Edit
                                </button>
                              }
                              mealId={item.mealId}
                              orderId={order.id}
                              customerId={user.id}
                              mealName={item.meal?.name ?? "Meal"}
                              mealImage={item.meal?.image}
                              existingReview={reviewMap[item.mealId]}
                              onSuccess={handleReviewSuccess}
                            />
                          </div>
                        ) : (
                          <ReviewFormDialog
                            trigger={
                              <Button variant="outline" size="sm">
                                Leave Review
                              </Button>
                            }
                            mealId={item.mealId}
                            orderId={order.id}
                            customerId={user.id}
                            mealName={item.meal?.name ?? "Meal"}
                            mealImage={item.meal?.image}
                            onSuccess={handleReviewSuccess}
                          />
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}

                {/* Total row */}
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={canReview ? 5 : 4} className="text-right">
                    Total
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(order.totalAmount)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
