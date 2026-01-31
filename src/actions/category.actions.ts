"use server";

import { categoryService } from "@/services/category.service";

export async function createCategory(data: {
  name: string;
  emoji: string;
  image: string;
}) {
  return await categoryService.create(data);
}
