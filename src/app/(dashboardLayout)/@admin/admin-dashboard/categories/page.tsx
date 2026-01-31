import CategoryCardsBlock from "@/components/modules/adminDashboard/category/CategoryCardsBlock";
import { Button } from "@/components/ui/button";
import { categoryService } from "@/services/category.service";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function CategoryListPage() {
  const { data, error } = await categoryService.getAll();

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your food categories
          </p>
        </div>
        <Link href="/admin-dashboard/categories/create">
          <Button size="lg" className="gap-2">
            <Plus className="size-4" />
            Add New Category
          </Button>
        </Link>
      </div>
      {/* Category Cards Block */}
      <CategoryCardsBlock categories={data ?? []} />
    </div>
  );
}
