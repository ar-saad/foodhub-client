import { env } from "@/env";
import { cookies } from "next/headers";
import { CreateReviewPayload, UpdateReviewPayload } from "@/types/review.type";

const API_URL = env.API_URL;

export const reviewService = {
  getReviews: async function (params: {
    mealId?: string;
    customerId?: string;
    orderId?: string;
    page?: string;
    limit?: string;
  }) {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/reviews`);

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
            message: errorData?.message || "Failed to fetch reviews.",
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

  create: async function (payload: CreateReviewPayload) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/reviews`, {
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
            message: errorData?.message || "Failed to submit review.",
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

  update: async function (reviewId: string, payload: UpdateReviewPayload) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: "PATCH",
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
            message: errorData?.message || "Failed to update review.",
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

  delete: async function (reviewId: string) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: "DELETE",
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
            message: errorData?.message || "Failed to delete review.",
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
