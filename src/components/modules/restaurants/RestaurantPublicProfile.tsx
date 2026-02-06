import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Provider } from "@/types";
import { MapPin, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MealCard from "../browse/MealCard";
import Image from "next/image";

export default function RestaurantPublicProfile({
  provider,
}: {
  provider: Provider;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="relative overflow-hidden rounded-2xl border-slate-200/60 shadow-xl">
        <div className="z-10 p-8 md:p-12">
          <div className="flex gap-8 items-center">
            {provider.logo && (
              <div className="relative w-64 h-64 rounded">
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                  {provider.name}
                </h1>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-5 h-5" />
                  <p className="text-lg">{provider.address}</p>
                </div>
              </div>

              {provider.description && (
                <p className="text-slate-700 text-lg leading-relaxed max-w-2xl">
                  {provider.description}
                </p>
              )}

              <div className="flex items-center gap-3">
                <Badge
                  variant={provider.isOpen ? "default" : "secondary"}
                  className="text-sm px-4 py-1.5"
                >
                  {provider.isOpen ? "🟢 Open Now" : "🔴 Closed"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meals Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <UtensilsCrossed className="w-8 h-8 text-purple-600" />
              Our Menu
            </h2>
            {provider.meals && provider.meals.length > 0 && (
              <p className="text-slate-600 mt-2">
                {provider.meals.length}{" "}
                {provider.meals.length === 1 ? "item" : "items"} available
              </p>
            )}
          </div>
        </div>

        {provider.meals && provider.meals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {provider.meals.map((meal) => (
              <MealCard meal={meal} key={meal.id} />
            ))}
          </div>
        ) : (
          <Card className="p-12 border-slate-200/60 bg-linear-to-br from-slate-50 to-white">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-slate-100 rounded-full">
                <UtensilsCrossed className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                No Meals Available
              </h3>
              <p className="text-slate-600 max-w-md">
                This restaurant hasn't added any meals to their menu yet. Please
                check back later!
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
