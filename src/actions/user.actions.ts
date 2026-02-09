"use server";

import { userService } from "@/services/user.service";

export async function getCurrentUser() {
  return await userService.getCurrentUser();
}

export async function getUser(userId: string) {
  return await userService.getUser(userId);
}

export async function getUsers(params: {
  search?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  return await userService.getUsers(params);
}

export async function updateUserProfile({
  userId,
  payload,
}: {
  userId: string;
  payload: {
    name: string;
    phone: string;
    address: string;
    image: string;
  };
}) {
  return await userService.updateUserProfile({ userId, payload });
}

export async function updateUserStatus({
  userId,
  status,
}: {
  userId: string;
  status: string;
}) {
  return await userService.updateUserStatus({ userId, status });
}
