"use client";

import { Meal } from "@/types/meal.type";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ShoppingCart, Star, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface BrowseMealListProps {
  meals: Meal[];
  loading: boolean;
  error: string | null;
}

export default function BrowseMealListBlock({
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
          Found {meals.length} {meals.length === 1 ? "meal" : "meals"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {meals.map((meal) => (
          <Card
            key={meal.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 gap-2"
          >
            <div className="relative h-48 w-full bg-gray-100">
              {meal.image ? (
                <Image
                  src={meal.image}
                  alt={meal.name}
                  height={300}
                  width={500}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UtensilsCrossed className="h-12 w-12 text-gray-300" />
                </div>
              )}
              {meal.isFeatured && (
                <Badge className="absolute top-2 right-2" variant="default">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {!meal.isAvailable && (
                <Badge className="absolute top-2 left-2" variant="destructive">
                  Unavailable
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {meal.name}
                  </h3>
                </div>

                {meal.category && (
                  <Badge variant="outline" className="text-xs">
                    {meal.category.emoji} {meal.category.name}
                  </Badge>
                )}

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {meal.description}
                </p>

                {meal.providerProfile && (
                  <p className="text-xs text-muted-foreground">
                    by {meal.providerProfile.name}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <div className="text-2xl font-bold text-primary">
                ${Number(meal.price).toFixed(2)}
              </div>
              <Button size="sm" disabled={!meal.isAvailable} className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
