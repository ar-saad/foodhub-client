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

export default function MealListBlock({
  meals,
  meta,
}: {
  meals: Meal[];
  meta: PaginationControlsProps;
}) {
  const router = useRouter();
  const { limit: pageSize, page: currentPage, count, totalPages } = meta;

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

  return (
    <div className="border rounded-md p-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Meal name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meals.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No meals found
              </TableCell>
            </TableRow>
          ) : (
            meals.map((meal, index) => (
              <TableRow key={meal.id}>
                <TableCell className="w-10">
                  {(currentPage - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell>{meal.name}</TableCell>
                <TableCell>{meal.category?.name}</TableCell>
                <TableCell>{meal.price}</TableCell>
                <TableCell>
                  <Badge variant={meal.isAvailable ? "default" : "secondary"}>
                    {meal.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={meal.isFeatured ? "default" : "secondary"}>
                    {meal.isFeatured ? "Featured" : "Not featured"}
                  </Badge>
                </TableCell>
                <TableCell className="flex items-center gap-1">
                  <Link href={`/provider-dashboard/meals/${meal.id}/update`}>
                    <Button variant="ghost">
                      <SquarePen />
                    </Button>
                  </Link>
                  <ConfirmationDialog
                    title="Confirm"
                    description="Are you sure you want to delete this meal?"
                    actionFunction={() => handleDelete(meal.id)}
                    trigger={<Trash2 className="text-red-500" />}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
