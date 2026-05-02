import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export interface PlatformStats {
  restaurantCount: number;
  customerCount: number;
  orderCount: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface AdminStats {
  counts: {
    users: Record<string, number>;
    totalUsers: number;
    orders: number;
    categories: number;
    meals: number;
  };
  totalRevenue: number;
  revenueOverTime: RevenueData[];
  orderStatusDistribution: { status: string; count: number }[];
}

export interface ProviderStats {
  counts: {
    meals: number;
    orders: number;
  };
  totalRevenue: number;
  revenueOverTime: RevenueData[];
  topSellingMeals: { name: string; sales: number }[];
}

export const statsService = {
  getPlatformStats: async function (): Promise<{
    data: PlatformStats | null;
    error: { message: string } | null;
  }> {
    try {
      const res = await fetch(`${API_URL}/stats`, {
        next: { revalidate: 60 }, // Cache for 60 seconds — stats don't need to be real-time per request
      });

      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch platform stats." },
        };
      }

      const json = await res.json();
      return { data: json.data as PlatformStats, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  getAdminStats: async function (): Promise<{
    data: AdminStats | null;
    error: { message: string } | null;
  }> {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/stats/admin`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return {
          data: null,
          error: { message: errorData?.message || "Failed to fetch admin stats." },
        };
      }

      const json = await res.json();
      return { data: json.data as AdminStats, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  getProviderStats: async function (): Promise<{
    data: ProviderStats | null;
    error: { message: string } | null;
  }> {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/stats/provider`, {
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
            message: errorData?.message || "Failed to fetch provider stats.",
          },
        };
      }

      const json = await res.json();
      return { data: json.data as ProviderStats, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong." } };
    }
  },
};
