"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getOrders } from "@/actions/order.actions";
import { Order, OrderStatus } from "@/types/order.type";
import { PaginationControlsProps } from "@/types/pagination.type";
import OrderListBlock from "@/components/modules/userDashboard/orders/OrderListBlock";
import { useUser } from "@/contexts/UserContext";
import { SortingState, PaginationState } from "@tanstack/react-table";
import {
  DataTableFilterValues,
  DataTableFilterValue,
} from "@/components/shared/table/DataTableFilters";

const ORDER_STATUS_FILTER_OPTIONS = Object.values(OrderStatus).map((s) => ({
  label: s.replace(/_/g, " "),
  value: s,
}));

export default function UserOrderPage() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<PaginationControlsProps | null>(null);
  const [loading, setLoading] = useState(true);

  // Derive state from URL
  const currentPage = Number(searchParams.get("page") || "1");
  const currentLimit = Number(searchParams.get("limit") || "10");
  const currentSortBy = searchParams.get("sortBy") || "createdAt";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";
  const currentStatus = searchParams.get("status") || "";

  // Stable ref for searchParams
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const updateURL = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router],
  );

  // Sorting
  const sortingState: SortingState = currentSortBy
    ? [{ id: currentSortBy, desc: currentSortOrder === "desc" }]
    : [];

  const onSortingChange = useCallback(
    (state: SortingState) => {
      if (state.length > 0) {
        updateURL({
          sortBy: state[0].id,
          sortOrder: state[0].desc ? "desc" : "asc",
          page: "",
        });
      } else {
        updateURL({ sortBy: "", sortOrder: "", page: "" });
      }
    },
    [updateURL],
  );

  // Pagination
  const paginationState: PaginationState = {
    pageIndex: currentPage - 1,
    pageSize: currentLimit,
  };

  const onPaginationChange = useCallback(
    (state: PaginationState) => {
      updateURL({
        page: String(state.pageIndex + 1),
        limit: String(state.pageSize),
      });
    },
    [updateURL],
  );

  // Filters
  const filterValues: DataTableFilterValues = {
    status: currentStatus || undefined,
  };

  const onFilterChange = useCallback(
    (filterId: string, value: DataTableFilterValue | undefined) => {
      if (filterId === "status") {
        updateURL({ status: (value as string) || "", page: "" });
      }
    },
    [updateURL],
  );

  const onClearAllFilters = useCallback(() => {
    updateURL({ status: "", page: "" });
  }, [updateURL]);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const result = await getOrders({
          customerId: user?.id,
          page: String(currentPage),
          limit: String(currentLimit),
          status: currentStatus,
          sortBy: currentSortBy,
          sortOrder: currentSortOrder,
        });

        if (result.error) {
          setOrders([]);
          setMeta(null);
        } else {
          setOrders(result.data?.data?.data ?? []);
          setMeta(result.data?.data?.meta ?? null);
        }
      } catch {
        setOrders([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [searchParams]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Orders</h1>

      <OrderListBlock
        orders={orders}
        meta={meta}
        role="CUSTOMER"
        detailBaseUrl="/dashboard/orders"
        isLoading={loading}
        sorting={{
          state: sortingState,
          onSortingChange,
        }}
        pagination={{
          state: paginationState,
          onPaginationChange,
        }}
        filters={{
          configs: [
            {
              id: "status",
              label: "Status",
              type: "single-select" as const,
              options: ORDER_STATUS_FILTER_OPTIONS,
            },
          ],
          values: filterValues,
          onFilterChange,
          onClearAll: onClearAllFilters,
        }}
      />
    </div>
  );
}
