"use client";

import { Category } from "@/types/category.type";
import { PaginationControlsProps } from "@/types/pagination.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteCategory } from "@/actions/category.actions";
import { useRouter } from "next/navigation";

export default function CategoryListBlock({
  categories,
  meta,
}: {
  categories: Category[];
  meta: PaginationControlsProps | null;
}) {
  const currentPage = meta?.page ?? 1;
  const pageSize = meta?.limit ?? 10;
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

  return (
    <div className="border rounded-md p-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Emoji</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="flex justify-center items-center">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell className="w-10">
                  {(currentPage - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.emoji}</TableCell>
                <TableCell>
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={100}
                      height={100}
                      className="rounded"
                    />
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {category.createdAt
                    ? new Date(category.createdAt).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center items-center gap-2">
                    <Link
                      href={`/admin-dashboard/categories/${category.id}/update`}
                    >
                      <Button variant="secondary" size="icon">
                        <SquarePen />
                      </Button>
                    </Link>
                    <ConfirmationDialog
                      title="Delete Category"
                      description={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
                      actionFunction={() => handleDelete(category.id)}
                      trigger={<Trash2 className="text-red-500" />}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
