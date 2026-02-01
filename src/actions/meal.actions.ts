"use server";

import { mealService } from "@/services/meal.service";

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
