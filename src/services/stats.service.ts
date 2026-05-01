import { env } from "@/env";

const API_URL = env.API_URL;

export interface PlatformStats {
  restaurantCount: number;
  customerCount: number;
  orderCount: number;
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
        return { data: null, error: { message: "Failed to fetch platform stats." } };
      }

      const json = await res.json();
      return { data: json.data as PlatformStats, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong." } };
    }
  },
};
