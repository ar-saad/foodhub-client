import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const categoryService = {
  getAll: async function (params: {
    search?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    try {
      const url = new URL(`${API_URL}/categories`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value);
          }
        });
      }

      const res = await fetch(url, {
        cache: "no-store",
      });

      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch categories." },
        };
      }

      const categories = await res.json();

      return { data: categories, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  create: async function (categoryData: {
    name: string;
    emoji: string;
    image: string;
  }) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(categoryData),
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

  getById: async function (id: string) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/categories/${id}`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch category." },
        };
      }

      const result = await res.json();

      return { data: result.data, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  update: async function (payload: {
    id: string;
    name: string;
    emoji: string;
    image: string;
  }) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/categories/${payload.id}`, {
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
            message: errorData?.message || "Failed to update category.",
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

      const res = await fetch(`${API_URL}/categories/${id}`, {
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
