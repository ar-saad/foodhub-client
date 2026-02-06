import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const providerService = {
  getAll: async function (search: string) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(
        `${API_URL}/provider-profiles${search ? `?search=${search}` : ""}`,
        {
          headers: {
            Cookie: cookieStore.toString(),
          },
          cache: "no-store",
        },
      );

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

      const res = await fetch(`${API_URL}/provider-profiles/${id}`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to retrieve provider profile." },
        };
      }

      const categories = await res.json();

      return { data: categories, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  create: async function (profileData: {
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
