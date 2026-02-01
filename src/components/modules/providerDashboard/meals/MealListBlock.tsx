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

export default function MealListBlock({
  meals,
  meta,
}: {
  meals: Meal[];
  meta: PaginationControlsProps;
}) {
  console.log(meta);
  const { limit: pageSize, page: currentPage, count, totalPages } = meta;

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
                colSpan={5}
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
                  <Button variant="ghost">
                    <SquarePen />
                  </Button>
                  <Button variant="ghost">
                    <Trash2 className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
