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

import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/shared/table/DataTable";

type OrderListRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

interface OrderListBlockProps {
  orders: Order[];
  meta: PaginationControlsProps | null;
  role: OrderListRole;
  detailBaseUrl?: string;
  isLoading?: boolean;
  search?: any;
  pagination?: any;
  sorting?: any;
  filters?: any;
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
  isLoading,
  search,
  pagination,
  sorting,
  filters,
}: OrderListBlockProps) {
  const router = useRouter();

  const showCustomerCol = role === "PROVIDER" || role === "ADMIN";
  const showProviderCol = role === "CUSTOMER" || role === "ADMIN";

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs" title={row.original.id}>
          {row.original.id.slice(0, 8)}…
        </span>
      ),
    },
    ...(showProviderCol
      ? [
          {
            accessorKey: "providerProfile.name",
            header: "Restaurant",
            cell: ({ row }: any) => (
              <span className="font-medium">
                {row.original.providerProfile?.name ?? "—"}
              </span>
            ),
          },
        ]
      : []),
    ...(showCustomerCol
      ? [
          {
            accessorKey: "customer.name",
            header: "Customer",
            cell: ({ row }: any) => row.original.customer?.name ?? "—",
          },
        ]
      : []),
    {
      accessorKey: "items",
      header: "Items",
      enableSorting: false,
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default">
                {row.original.orderItems.length}{" "}
                {row.original.orderItems.length === 1 ? "item" : "items"}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <ul className="text-xs space-y-1">
                {row.original.orderItems.map((item, i) => (
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
      ),
    },
    {
      accessorKey: "totalAmount",
      header: () => <div className="text-right">Total</div>,
      cell: ({ row }) => (
        <div className="text-right font-semibold">
          {formatCurrency(row.original.totalAmount)}
        </div>
      ),
    },
    {
      accessorKey: "paymentType",
      header: "Payment",
      cell: ({ row }) => <Badge variant="outline">{row.original.paymentType}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={statusVariantMap[row.original.status]}
          className={statusColorMap[row.original.status]}
        >
          {formatStatus(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      enableSorting: false,
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center gap-2">
            {detailBaseUrl && (
              <Link href={`${detailBaseUrl}/${order.id}`}>
                <Eye className="h-5 w-5 text-primary" />
              </Link>
            )}
            {role === "CUSTOMER" && order.status === OrderStatus.PLACED && (
              <ConfirmationDialog
                title="Cancel Order"
                description="Are you sure you want to cancel this order? This action cannot be undone."
                variant="destructive"
                trigger={<Ban className="h-4 w-4" />}
                actionFunction={async () => {
                  const toastId = toast.loading("Cancelling order...");
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
        );
      },
    },
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      meta={meta ?? undefined}
      isLoading={isLoading}
      search={search}
      pagination={pagination}
      sorting={sorting}
      filters={filters}
      emptyMessage="No orders found"
    />
  );
}

