"use client";

import { useRouter } from "next/navigation";
import { Order, OrderStatus } from "@/types/order.type";
import { updateOrderStatus } from "@/actions/order.actions";
import { PaginationControlsProps } from "@/types/pagination.type";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Eye, Ban } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type OrderListRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

interface OrderListBlockProps {
  orders: Order[];
  meta: PaginationControlsProps | null;
  role: OrderListRole;
  detailBaseUrl?: string;
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

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

export default function OrderListBlock({
  orders,
  meta,
  role,
  detailBaseUrl,
}: OrderListBlockProps) {
  const router = useRouter();
  const currentPage = meta?.page ?? 1;
  const pageSize = meta?.limit ?? 10;

  const showCustomerCol = role === "PROVIDER" || role === "ADMIN";
  const showProviderCol = role === "CUSTOMER" || role === "ADMIN";

  const colCount =
    6 + (showCustomerCol ? 1 : 0) + (showProviderCol ? 1 : 0) + 1; // always show action column

  return (
    <div className="border rounded-md p-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Order ID</TableHead>
            {showProviderCol && <TableHead>Restaurant</TableHead>}
            {showCustomerCol && <TableHead>Customer</TableHead>}
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={colCount}
                className="text-center py-8 text-muted-foreground"
              >
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order, index) => (
              <TableRow key={order.id}>
                <TableCell className="w-10">
                  {(currentPage - 1) * pageSize + index + 1}
                </TableCell>

                <TableCell className="font-mono text-xs" title={order.id}>
                  {order.id.slice(0, 8)}…
                </TableCell>

                {showProviderCol && (
                  <TableCell className="font-medium">
                    {order.providerProfile?.name ?? "—"}
                  </TableCell>
                )}

                {showCustomerCol && (
                  <TableCell>{order.customer?.name ?? "—"}</TableCell>
                )}

                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-default">
                          {order.orderItems.length}{" "}
                          {order.orderItems.length === 1 ? "item" : "items"}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs">
                        <ul className="text-xs space-y-1">
                          {order.orderItems.map((item, i) => (
                            <li key={i}>
                              {item.meal?.name ?? item.mealId.slice(0, 8)}
                              {" × "}
                              {item.quantity} — {formatCurrency(item.price)}
                            </li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>

                <TableCell className="text-right font-semibold">
                  {formatCurrency(order.totalAmount)}
                </TableCell>

                <TableCell>
                  <Badge variant="outline">{order.paymentType}</Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={statusVariantMap[order.status]}
                    className={statusColorMap[order.status]}
                  >
                    {formatStatus(order.status)}
                  </Badge>
                </TableCell>

                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(order.createdAt)}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    {detailBaseUrl && (
                      <Link href={`${detailBaseUrl}/${order.id}`}>
                        <Eye className="h-5 w-5 text-primary" />
                      </Link>
                    )}
                    {role === "CUSTOMER" &&
                      order.status === OrderStatus.PLACED && (
                        <ConfirmationDialog
                          title="Cancel Order"
                          description="Are you sure you want to cancel this order? This action cannot be undone."
                          variant="destructive"
                          trigger={<Ban className="h-4 w-4" />}
                          actionFunction={async () => {
                            const toastId = toast.loading(
                              "Cancelling order...",
                            );
                            const result = await updateOrderStatus({
                              orderId: order.id,
                              status: OrderStatus.CANCELLED,
                            });
                            if (result.error) {
                              toast.error(result.error.message, {
                                id: toastId,
                              });
                            } else {
                              toast.success("Order cancelled.", {
                                id: toastId,
                              });
                              router.refresh();
                            }
                          }}
                        />
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
