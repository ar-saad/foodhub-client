import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;
const API_URL = env.API_URL;

export const userService = {
  getSession: async function () {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const session = await res.json();

      if (!session) {
        return { data: null, error: { message: "Session not found." } };
      }

      return { data: session, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  getCurrentUser: async function () {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/users/me`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const user = await res.json();

      if (!user) {
        return { data: null, error: { message: "User not found." } };
      }

      return { data: user, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  getUsers: async function () {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/users`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const user = await res.json();

      if (!user) {
        return { data: null, error: { message: "User not found." } };
      }

      return { data: user, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  getUser: async function (userId: string) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/users/${userId}`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const user = await res.json();

      if (!user) {
        return { data: null, error: { message: "User not found." } };
      }

      return { data: user, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong." } };
    }
  },

  updateUserProfile: async function ({
    userId,
    payload,
  }: {
    userId: string;
    payload: {
      name: string;
      phone: string;
      image: string;
    };
  }) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const user = await res.json();

      if (!user) {
        return { data: null, error: { message: "User not found." } };
      }

      return { data: user, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong." } };
    }
  },
};
