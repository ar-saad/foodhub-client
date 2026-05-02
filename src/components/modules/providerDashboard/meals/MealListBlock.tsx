"use client";

import { Meal } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationControlsProps } from "@/types";
import { SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { deleteMeal } from "@/actions/meal.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/shared/table/DataTable";

export default function MealListBlock({
  meals,
  meta,
  isLoading,
  search,
  pagination,
  sorting,
  filters,
  toolbarAction,
}: {
  meals: Meal[];
  meta?: PaginationControlsProps;
  isLoading?: boolean;
  search?: any;
  pagination?: any;
  sorting?: any;
  filters?: any;
  toolbarAction?: React.ReactNode;
}) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting meal.");
    const res = await deleteMeal(id);
    if (res.error) {
      toast.error(res.error.message || "Something went wrong", { id: toastId });
      return;
    }

    toast.success("Meal deleted successfully", { id: toastId });
    router.refresh();
  };

  const columns: ColumnDef<Meal>[] = [
    {
      accessorKey: "name",
      header: "Meal name",
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }: any) => row.original.category?.name,
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "isAvailable",
      header: "Available",
      cell: ({ row }) => (
        <Badge variant={row.original.isAvailable ? "default" : "secondary"}>
          {row.original.isAvailable ? "Available" : "Unavailable"}
        </Badge>
      ),
    },
    {
      accessorKey: "isFeatured",
      header: "Featured",
      cell: ({ row }) => (
        <Badge variant={row.original.isFeatured ? "default" : "secondary"}>
          {row.original.isFeatured ? "Featured" : "Not featured"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Action",
      enableSorting: false,
      cell: ({ row }) => {
        const meal = row.original;
        return (
          <div className="flex items-center gap-1">
            <Link href={`/provider-dashboard/meals/${meal.id}/update`}>
              <Button variant="ghost">
                <SquarePen className="h-4 w-4" />
              </Button>
            </Link>
            <ConfirmationDialog
              title="Confirm"
              description="Are you sure you want to delete this meal?"
              actionFunction={() => handleDelete(meal.id)}
              trigger={<Trash2 className="text-red-500 h-4 w-4 cursor-pointer" />}
            />
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      data={meals}
      columns={columns}
      meta={meta}
      isLoading={isLoading}
      search={search}
      pagination={pagination}
      sorting={sorting}
      filters={filters}
      toolbarAction={toolbarAction}
      emptyMessage="No meals found"
    />
  );
}

