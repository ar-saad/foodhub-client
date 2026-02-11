"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Meal } from "@/types";
import { ShoppingCart, Star, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import StarRating from "@/components/modules/common/StarRating";

export default function MealCard({ meal }: { meal: Meal }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!meal.providerId || !meal.providerProfile) return;
    addItem(meal, meal.providerId, meal.providerProfile.name);
  };

  return (
    <Link href={`/browse/${meal.id}`} className="block">
      <Card
        key={meal.id}
        className="overflow-hidden hover:shadow-lg transition-shadow duration-300 gap-2 flex flex-col h-full py-0"
      >
        <div className="relative w-full bg-gray-100 h-52">
          {meal.image ? (
            <Image
              src={meal.image}
              alt={meal.name}
              fill
              className="object-cover"
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

        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="space-y-2 flex-1 flex flex-col">
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

            <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
              {meal.description}
            </p>

            {meal.providerProfile && (
              <p className="text-xs text-muted-foreground">
                by {meal.providerProfile.name}
              </p>
            )}

            {meal.averageRating != null && meal.averageRating > 0 && (
              <div className="flex items-center gap-1.5">
                <StarRating
                  value={Math.round(meal.averageRating)}
                  readonly
                  size="sm"
                />
                <span className="text-xs text-muted-foreground">
                  {meal.averageRating.toFixed(1)}
                  {meal.totalReviews != null && ` (${meal.totalReviews})`}
                </span>
              </div>
            )}
            {/* Spacer to push footer down if needed */}
            <div className="flex-1" />
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
          <div className="text-2xl font-bold text-primary">
            ৳{Number(meal.price).toFixed(2)}
          </div>
          <Button
            size="sm"
            disabled={!meal.isAvailable}
            className="gap-2"
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
