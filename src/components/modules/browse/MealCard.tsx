import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Meal } from "@/types";
import { ShoppingCart, Star, UtensilsCrossed } from "lucide-react";
import Image from "next/image";

export default function MealCard({ meal }: { meal: Meal }) {
  return (
    <Card
      key={meal.id}
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 gap-2"
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

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg line-clamp-1">{meal.name}</h3>
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
          ৳{Number(meal.price).toFixed(2)}
        </div>
        <Button size="sm" disabled={!meal.isAvailable} className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
