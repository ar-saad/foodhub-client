import MealCreateForm from "@/components/modules/providerDashboard/meals/MealCreateForm";
import { categoryService } from "@/services/category.service";

export default async function MealCreatePage() {
  const categories = await categoryService.getAll({
    limit: "9999",
  });

  return (
    <div>
      <MealCreateForm categories={categories.data?.data?.data ?? []} />
    </div>
  );
}
