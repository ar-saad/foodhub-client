import { env } from "@/env";
import { cookies } from "next/headers";
import { CreateOrderPayload } from "@/types/order.type";

const API_URL = env.API_URL;

export const orderService = {
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
};
