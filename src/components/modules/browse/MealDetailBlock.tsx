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
import { toast } from "sonner";

interface MealDetailBlockProps {
  meal: Meal;
}

export default function MealDetailBlock({ meal }: MealDetailBlockProps) {
  const router = useRouter();
  const { addItem } = useCart();

  function handleAddToCart() {
    if (!meal.providerId || !meal.providerProfile) return;
    addItem(meal, meal.providerId, meal.providerProfile.name);
    toast.success(`${meal.name} added to cart!`);
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
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
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
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {meal.name}
            </h1>

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

          <p className="text-muted-foreground leading-relaxed text-lg">
            {meal.description}
          </p>

          <Separator />

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

          {/* Restaurant info */}
          {meal.providerProfile && (
            <Card>
              <CardContent className="p-4">
                <Link
                  href={`/restaurants/${meal.providerProfile.id}`}
                  className="flex items-center gap-4 group"
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {meal.providerProfile.logo ? (
                      <Image
                        src={meal.providerProfile.logo}
                        alt={meal.providerProfile.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Store className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      {meal.providerProfile.name}
                    </p>
                    {meal.providerProfile.address && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {meal.providerProfile.address}
                        </span>
                      </p>
                    )}
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
