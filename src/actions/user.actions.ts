"use server";

import { userService } from "@/services/user.service";

export async function getCurrentUser() {
  return await userService.getCurrentUser();
}

export async function getUser(userId: string) {
  return await userService.getUser(userId);
}

export async function getUsers() {
  return await userService.getUsers();
}

export async function updateUserProfile({
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
  return await userService.updateUserProfile({ userId, payload });
}
