import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const partnerService = {
  createPartnerProfile: async function (profileData: {
    name: string;
    address: string;
    description: string;
    logo: string;
  }) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/provider-profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(profileData),
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {
          data: null,
          error: {
            message: errorData.message || "Failed to create partner profile",
          },
        };
      }

      const result = await res.json();

      return { data: result, error: null };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        error: { message: "Something went wrong" },
      };
    }
  },
};
