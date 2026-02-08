"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getOrders } from "@/actions/order.actions";
import { Order } from "@/types/order.type";
import { PaginationControlsProps } from "@/types/pagination.type";
import PaginationControls from "@/components/ui/pagination-controls";
import OrderListBlock from "@/components/modules/userDashboard/orders/OrderListBlock";
import { Loader2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export default function ProviderOrderPage() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<PaginationControlsProps | null>(null);
  const [loading, setLoading] = useState(true);

  const updateURL = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const result = await getOrders({
          providerId: user?.providerProfile?.id,
          page: searchParams.get("page") || "1",
          limit: searchParams.get("limit") || "10",
          status: searchParams.get("status") || "",
          sortBy: searchParams.get("sortBy") || "createdAt",
          sortOrder: searchParams.get("sortOrder") || "desc",
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
      <h1 className="text-2xl font-bold">Orders</h1>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <OrderListBlock
          orders={orders}
          meta={meta}
          role="PROVIDER"
          detailBaseUrl="/provider-dashboard/orders"
        />
      )}

      {meta && meta.totalPages > 1 && <PaginationControls meta={meta} />}
    </div>
  );
}
