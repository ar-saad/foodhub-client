"use server";

import { categoryService } from "@/services/category.service";

export async function getCategories() {
  return await categoryService.getAll();
}

export async function getCategoryById(id: string) {
  return await categoryService.getById(id);
}

export async function createCategory(data: {
  name: string;
  emoji: string;
  image: string;
}) {
  return await categoryService.create(data);
}

export async function updateCategory(data: {
  id: string;
  name: string;
  emoji: string;
  image: string;
}) {
  return await categoryService.update(data);
}

export async function deleteCategory(id: string) {
  return await categoryService.delete(id);
}
