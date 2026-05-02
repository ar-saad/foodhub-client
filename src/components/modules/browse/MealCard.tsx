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
    <Link href={`/browse/${meal.id}`} className="block group">
      <Card
        key={meal.id}
        className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border-border/50 bg-card shadow-sm pt-0 pb-2 space-y-0 gap-1"
      >
        <div className="relative w-full bg-muted h-40">
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

        <CardContent className="p-2.5 flex flex-col">
          <div className="space-y-1 flex flex-col">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                {meal.name}
              </h3>
            </div>

            {meal.category && (
              <Badge variant="outline" className="text-xs">
                {meal.category.emoji} {meal.category.name}
              </Badge>
            )}

            <p className="text-[11px] text-muted-foreground line-clamp-2 min-h-7 leading-tight">
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
          </div>
        </CardContent>

        <CardFooter className="p-2.5 pt-0 flex flex-col gap-2 mt-auto">
          <div className="flex items-center justify-between w-full">
            <div className="text-lg font-bold text-primary">
              ৳{Number(meal.price).toFixed(2)}
            </div>
            <Button
              size="icon"
              variant="outline"
              disabled={!meal.isAvailable}
              className="h-8 w-8 rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              title="Add to Cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
          <Button
            size="sm"
            variant="default"
            className="w-full text-xs"
            onClick={(e) => {
              // Let the parent Link handle the navigation
            }}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
