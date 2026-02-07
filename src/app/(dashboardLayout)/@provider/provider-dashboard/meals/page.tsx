import MealListBlock from "@/components/modules/providerDashboard/meals/MealListBlock";
import { Button } from "@/components/ui/button";
import { mealService } from "@/services/meal.service";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function MealsPage() {
  const { data, error } = await mealService.getAll({});

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-primary">Meals</h1>
          <p className="text-muted-foreground mt-1">Manage your meals</p>
        </div>
        <Link href="/provider-dashboard/meals/create">
          <Button size="lg" className="gap-2">
            <Plus className="size-4" />
            Add New meal
          </Button>
        </Link>
      </div>
      <MealListBlock meals={data.data.data ?? []} meta={data.data.meta} />
    </div>
  );
}
