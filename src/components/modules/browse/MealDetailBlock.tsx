"use client";

import { Meal } from "@/types/meal.type";
import { useCart } from "@/contexts/CartContext";
import StarRating from "@/components/modules/common/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  ShoppingCart,
  Star,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface MealDetailBlockProps {
  meal: Meal;
}

export default function MealDetailBlock({ meal }: MealDetailBlockProps) {
  const router = useRouter();
  const { addItem } = useCart();

  function handleAddToCart() {
    if (!meal.providerId || !meal.providerProfile) return;
    addItem(meal, meal.providerId, meal.providerProfile.name);
  }

  return (
    <>
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
          {meal.image ? (
            <Image
              src={meal.image}
              alt={meal.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UtensilsCrossed className="h-24 w-24 text-gray-300" />
            </div>
          )}
          {meal.isFeatured && (
            <Badge className="absolute top-4 right-4 text-sm px-3 py-1.5">
              <Star className="h-3.5 w-3.5 mr-1" />
              Featured
            </Badge>
          )}
          {!meal.isAvailable && (
            <Badge
              className="absolute top-4 left-4 text-sm px-3 py-1.5"
              variant="destructive"
            >
              Unavailable
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {meal.name}
              </h1>
              {meal.providerProfile && (
                <Link
                  href={`/restaurants/${meal.providerProfile.id}`}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-muted border flex items-center justify-center shrink-0">
                    {meal.providerProfile.logo ? (
                      <Image
                        src={meal.providerProfile.logo}
                        alt={meal.providerProfile.name}
                        width={24}
                        height={24}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Store className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <span className="font-medium text-[15px] group-hover:underline">
                    {meal.providerProfile.name}
                  </span>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {meal.category && (
                <Badge variant="outline" className="text-sm">
                  {meal.category.emoji} {meal.category.name}
                </Badge>
              )}

              {meal.averageRating != null && meal.averageRating > 0 && (
                <div className="flex items-center gap-1.5">
                  <StarRating
                    value={Math.round(meal.averageRating)}
                    readonly
                    size="sm"
                  />
                  <span className="text-sm text-muted-foreground">
                    {meal.averageRating.toFixed(1)}
                    {meal.totalReviews != null && ` (${meal.totalReviews})`}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Description / Overview Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Description & Overview
              </h3>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                {meal.description || "No description provided."}
              </p>
            </div>

            {/* Key Information / Specifications Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Key Information
              </h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-muted-foreground bg-muted/40 p-4 rounded-lg border border-border/50">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">Category</span>
                  <span>{meal.category?.name || "Uncategorized"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    Availability
                  </span>
                  <span
                    className={
                      meal.isAvailable
                        ? "text-green-600 dark:text-green-500 font-medium"
                        : "text-destructive font-medium"
                    }
                  >
                    {meal.isAvailable ? "Available" : "Currently Unavailable"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    Featured Status
                  </span>
                  <span>
                    {meal.isFeatured ? "Featured Dish" : "Standard Listing"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    Base Price
                  </span>
                  <span>৳{Number(meal.price).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-primary">
              ৳{Number(meal.price).toFixed(2)}
            </div>
            <Button
              size="lg"
              disabled={!meal.isAvailable}
              className="gap-2 text-base px-8"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <Separator />
        </div>
      </div>
    </>
  );
}
