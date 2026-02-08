"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrder, updateOrderStatus } from "@/actions/order.actions";
import { Order, OrderStatus } from "@/types/order.type";
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
  Loader2,
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

type OrderDetailRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

interface OrderDetailBlockProps {
  orderId: string;
  role: OrderDetailRole;
}

const statusVariantMap: Record<
  OrderStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  [OrderStatus.PLACED]: "outline",
  [OrderStatus.PREPARING]: "secondary",
  [OrderStatus.READY]: "default",
  [OrderStatus.DELIVERED]: "default",
  [OrderStatus.CANCELLED]: "destructive",
};

const statusColorMap: Record<OrderStatus, string> = {
  [OrderStatus.PLACED]: "border-blue-400 text-blue-600",
  [OrderStatus.PREPARING]: "border-yellow-400 text-yellow-600",
  [OrderStatus.READY]: "bg-emerald-100 border-emerald-400 text-emerald-700",
  [OrderStatus.DELIVERED]: "bg-green-600 text-white",
  [OrderStatus.CANCELLED]: "",
};

const statusSteps: OrderStatus[] = [
  OrderStatus.PLACED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.DELIVERED,
];

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount: string | number) {
  return `৳${Number(amount).toFixed(2)}`;
}

function getStepIndex(status: OrderStatus) {
  const idx = statusSteps.indexOf(status);
  return idx === -1 ? -1 : idx;
}

/** Returns the statuses a provider can move the order forward to (no rollback). */
function getProviderNextStatuses(current: OrderStatus): OrderStatus[] {
  const currentIdx = statusSteps.indexOf(current);
  if (currentIdx === -1) return []; // CANCELLED — no transitions
  return [...statusSteps.slice(currentIdx + 1), OrderStatus.CANCELLED];
}

export default function OrderDetailBlock({
  orderId,
  role,
}: OrderDetailBlockProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      setError(null);
      try {
        const result = await getOrder(orderId);
        if (result.error) {
          setError(result.error.message);
          setOrder(null);
        } else {
          setOrder(result.data?.data ?? null);
        }
      } catch {
        setError("Failed to load order.");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  async function handleStatusUpdate(newStatus: OrderStatus) {
    if (!order) return;
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
        toast.success(`Order status updated to ${newStatus}`, { id: toastId });
        setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
      }
    } catch {
      toast.error("Failed to update order status.", { id: toastId });
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="text-center py-12 text-muted-foreground">
          {error || "Order not found."}
        </div>
      </div>
    );
  }

  const isCancelled = order.status === OrderStatus.CANCELLED;
  const currentStepIdx = getStepIndex(order.status);
  const showCustomerInfo = role === "PROVIDER" || role === "ADMIN";
  const showProviderInfo = role === "CUSTOMER" || role === "ADMIN";

  const canCustomerCancel =
    role === "CUSTOMER" && order.status === OrderStatus.PLACED;
  const providerNextStatuses =
    role === "PROVIDER" ? getProviderNextStatuses(order.status) : [];

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
            {order.status}
          </Badge>

          {/* Customer cancel button */}
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

          {/* Provider status update dropdown */}
          {role === "PROVIDER" && providerNextStatuses.length > 0 && (
            <Select
              disabled={updating}
              onValueChange={(val) => handleStatusUpdate(val as OrderStatus)}
            >
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                {providerNextStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === OrderStatus.CANCELLED
                      ? "Cancel Order"
                      : `Mark as ${s}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Status Tracker */}
      {!isCancelled && (
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
                      {step}
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
      )}

      {isCancelled && (
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
              <span>{formatDate(order.createdAt)}</span>
            </div>
            {order.updatedAt && order.updatedAt !== order.createdAt && (
              <>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{formatDate(order.updatedAt)}</span>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.orderItems.map((item, index) => (
                  <TableRow key={index}>
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
                  </TableRow>
                ))}

                {/* Total row */}
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={4} className="text-right">
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
