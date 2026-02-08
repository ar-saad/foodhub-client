import { env } from "@/env";
import { cookies } from "next/headers";
import { CreateOrderPayload } from "@/types/order.type";

const API_URL = env.API_URL;

export const orderService = {
  getOrders: async function (params: {
    customerId?: string;
    providerId?: string;
    page?: string;
    limit?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/orders`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value);
          }
        });
      }

      const res = await fetch(url.toString(), {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return {
          data: null,
          error: {
            message: errorData?.message || "Failed to fetch orders.",
          },
        };
      }

      const result = await res.json();
      return { data: result, error: null };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        error: { message: "Something went wrong." },
      };
    }
  },

  getOrder: async function (orderId: string) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return {
          data: null,
          error: {
            message: errorData?.message || "Failed to fetch order.",
          },
        };
      }

      const result = await res.json();
      return { data: result, error: null };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        error: { message: "Something went wrong." },
      };
    }
  },

  create: async function (payload: CreateOrderPayload) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return {
          data: null,
          error: {
            message: errorData?.message || "Failed to place order.",
          },
        };
      }

      const result = await res.json();

      return { data: result.data, error: null };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        error: { message: "Something went wrong." },
      };
    }
  },

  updateOrderStatus: async function ({
    orderId,
    status,
  }: {
    orderId: string;
    status: string;
  }) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ status }),
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return {
          data: null,
          error: {
            message: errorData?.message || "Failed to update order status.",
          },
        };
      }

      const result = await res.json();
      return { data: result.data, error: null };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        error: { message: "Something went wrong." },
      };
    }
  },
};
