import { UpdateCategoryForm } from "@/components/modules/adminDashboard/category/UpdateCategoryForm";
import { categoryService } from "@/services/category.service";
import { notFound } from "next/navigation";

export default async function UpdateCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: category, error } = await categoryService.getById(id);

  if (error || !category) {
    notFound();
  }

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <UpdateCategoryForm category={category} />
    </div>
  );
}
