import MealCreateForm from "@/components/modules/providerDashboard/meals/MealCreateForm";
import { categoryService } from "@/services/category.service";
import { userService } from "@/services/user.service";

export default async function MealCreatePage() {
  const getCategories = categoryService.getAll();
  const getUser = userService.getCurrentUser();

  const [categories, user] = await Promise.all([getCategories, getUser]);

  return (
    <div>
      <MealCreateForm
        categories={categories.data ?? []}
        user={user.data.data}
      />
    </div>
  );
}
