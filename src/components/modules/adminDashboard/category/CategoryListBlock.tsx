"use client";

import { Category } from "@/types/category.type";
import { PaginationControlsProps } from "@/types/pagination.type";
import Image from "next/image";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteCategory } from "@/actions/category.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SquarePen, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/shared/table/DataTable";

interface CategoryListBlockProps {
  categories: Category[];
  meta: PaginationControlsProps | null;
  isLoading?: boolean;
  search?: any;
  pagination?: any;
  sorting?: any;
  filters?: any;
  toolbarAction?: React.ReactNode;
}

export default function CategoryListBlock({
  categories,
  meta,
  isLoading,
  search,
  pagination,
  sorting,
  filters,
  toolbarAction,
}: CategoryListBlockProps) {
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

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "emoji",
      header: "Emoji",
      enableSorting: false,
    },
    {
      accessorKey: "image",
      header: "Image",
      enableSorting: false,
      cell: ({ row }) =>
        row.original.image ? (
          <Image
            src={row.original.image}
            alt={row.original.name}
            width={100}
            height={100}
            className="rounded"
          />
        ) : (
          "—"
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "—",
    },
    {
      id: "actions",
      header: "Action",
      enableSorting: false,
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin-dashboard/categories/${category.id}/update`}
            >
              <Button variant="secondary" size="icon">
                <SquarePen className="h-4 w-4" />
              </Button>
            </Link>
            <ConfirmationDialog
              title="Delete Category"
              description={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
              actionFunction={() => handleDelete(category.id)}
              trigger={<Trash2 className="text-red-500 h-4 w-4 cursor-pointer" />}
            />
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      data={categories}
      columns={columns}
      meta={meta ?? undefined}
      isLoading={isLoading}
      search={search}
      pagination={pagination}
      sorting={sorting}
      filters={filters}
      toolbarAction={toolbarAction}
      emptyMessage="No categories found"
    />
  );
}
