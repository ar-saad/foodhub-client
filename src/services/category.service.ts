import { env } from "@/env";
import { cookies } from "next/headers";
import { Category } from "@/types/category.type";

const API_URL = env.API_URL;

export const categoryService = {
  getAll: async function (): Promise<{
    data: Category[] | null;
    error: { message: string } | null;
  }> {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/categories`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch categories." },
        };
      }

      const categories = await res.json();

      return { data: categories.data, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong." } };
    }
  },
};
