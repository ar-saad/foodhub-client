import MealUpdateForm from "@/components/modules/providerDashboard/meals/MealUpdateForm";
import { categoryService } from "@/services/category.service";
import { mealService } from "@/services/meal.service";

export default async function UpdateMealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const getMeal = mealService.getById(id);
  const getCategories = categoryService.getAll();

  const [meal, categories] = await Promise.all([getMeal, getCategories]);

  return (
    <MealUpdateForm meal={meal.data.data} categories={categories.data ?? []} />
  );
}
