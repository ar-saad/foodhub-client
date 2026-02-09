"use server";

import { mealService } from "@/services/meal.service";

export async function getMeals(params: {
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  categoryId?: string;
  providerId?: string;
  isFeatured?: string;
}) {
  return await mealService.getAll(params);
}

export async function getMeal(id: string) {
  return await mealService.getById(id);
}

export async function createMeal(payload: {
  providerId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
  isFeatured: boolean;
}) {
  return await mealService.create(payload);
}

export async function updateMeal(payload: {
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
  return await mealService.update(payload);
}

export async function deleteMeal(id: string) {
  return await mealService.delete(id);
}
