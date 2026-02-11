"use client";

import { Meal } from "@/types/meal.type";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ShoppingCart, Star, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import MealCard from "./MealCard";

interface BrowseMealListProps {
  totalMeals: number;
  meals: Meal[];
  loading: boolean;
  error: string | null;
}

export default function BrowseMealListBlock({
  totalMeals,
  meals,
  loading,
  error,
}: BrowseMealListProps) {
  if (loading) {
    return (
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1">
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-destructive" />
            <h3 className="text-xl font-semibold">Failed to Load Meals</h3>
            <p className="text-muted-foreground max-w-md">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="flex-1">
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <UtensilsCrossed className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">No Meals Found</h3>
            <p className="text-muted-foreground max-w-md">
              We couldn't find any meals matching your criteria. Try adjusting
              your filters or search query.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Found {totalMeals} {totalMeals === 1 ? "meal" : "meals"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {meals.map((meal) => (
          <MealCard meal={meal} key={meal.id} />
        ))}
      </div>
    </div>
  );
}
