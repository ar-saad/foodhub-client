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
