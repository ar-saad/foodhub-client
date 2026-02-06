"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { deleteCategory } from "@/actions/category.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CategoryCardsBlock({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting category...");
    const res = await deleteCategory(id);
    if (res.error) {
      toast.error(res.error.message || "Something went wrong", {
        id: toastId,
      });
      return;
    }
    toast.success("Category deleted successfully", { id: toastId });
    router.refresh();
  };

  if (!categories || categories.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">No categories found.</p>
          <Link href="/admin-dashboard/categories/create">
            <Button variant="outline">Create your first category</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category: Category) => (
          <Card
            key={category.id}
            className={cn(
              "group overflow-hidden",
              "hover:shadow-lg transition-all duration-200",
              "cursor-pointer",
              "border border-primary",
              "py-0 gap-1",
            )}
          >
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-linear-to-br from-muted to-muted/50">
                  <span className="text-6xl">{category.emoji || "📦"}</span>
                </div>
              )}
              {/* Emoji Badge */}
              {category.emoji && category.image && (
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-md">
                  <span className="text-2xl">{category.emoji}</span>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg truncate">
                {category.name}
              </h3>
              {!category.image && category.emoji && (
                <div className="mt-2 text-center">
                  <span className="text-4xl">{category.emoji}</span>
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3">
                <Link
                  href={`/admin-dashboard/categories/${category.id}/update`}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                </Link>
                <ConfirmationDialog
                  title="Delete Category"
                  description={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
                  actionFunction={() => handleDelete(category.id)}
                  trigger={
                    <span className="flex items-center gap-1.5">
                      <Trash2 className="size-3.5" />
                      Delete
                    </span>
                  }
                  variant="destructive"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
