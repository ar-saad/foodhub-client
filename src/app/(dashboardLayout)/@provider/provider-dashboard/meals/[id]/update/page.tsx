import MealUpdateForm from "@/components/modules/providerDashboard/meals/MealUpdateForm";
import { categoryService } from "@/services/category.service";
import { mealService } from "@/services/meal.service";
import { userService } from "@/services/user.service";

export default async function UpdateMealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const getMeal = mealService.getById(id);
  const getCategories = categoryService.getAll();
  const getUser = userService.getCurrentUser();

  const [meal, categories, user] = await Promise.all([
    getMeal,
    getCategories,
    getUser,
  ]);

  return (
    <MealUpdateForm
      meal={meal.data.data}
      categories={categories.data ?? []}
      user={user.data.data}
    />
  );
}
