import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const mealService = {
  getAll: async function ({
    search,
    sortBy,
    sortOrder,
    categoryId,
    isFeatured,
  }: {
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    categoryId?: string;
    isFeatured?: string;
  }) {
    try {
      const cookieStore = await cookies();

      // Construct query parameters dynamically
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (sortBy && sortOrder) {
        params.append("sortBy", sortBy);
        params.append("sortOrder", sortOrder);
      }
      if (categoryId) params.append("categoryId", categoryId);
      if (isFeatured) params.append("isFeatured", isFeatured);

      // Build the final URL
      const queryString = params.toString();
      const url = `${API_URL}/meals${queryString ? `?${queryString}` : ""}`;

      const res = await fetch(url, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch meals." },
        };
      }

      const categories = await res.json();

      return { data: categories, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  getById: async function (id: string) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/meals/${id}`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch meal." },
        };
      }

      const categories = await res.json();

      return { data: categories, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  create: async function (payload: {
    providerId: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isAvailable: boolean;
    isFeatured: boolean;
  }) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/meals`, {
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
            message: errorData?.message || "Failed to create category.",
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

  update: async function (payload: {
    mealId: string;
    providerId: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isAvailable: boolean;
    isFeatured: boolean;
  }) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/meals/${payload.mealId}`, {
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
            message: errorData?.message || "Failed to create category.",
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

  delete: async function (id: string) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/meals/${id}`, {
        method: "DELETE",
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return {
          data: null,
          error: {
            message: errorData?.message || "Failed to delete category.",
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
