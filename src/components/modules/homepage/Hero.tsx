import Link from "next/link";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/category.type";

interface HeroProps {
  categories?: Category[];
  restaurantCount?: number;
}

export default function Hero({
  categories = [],
  restaurantCount = 0,
}: HeroProps) {
  return (
    <section
      className="w-full py-12 md:py-16 lg:py-20"
      aria-label="Food delivery search"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Address Search Bar */}
        <div className="mb-8">
          <div className="relative flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white rounded-xl shadow-lg border border-gray-100 p-2 sm:p-3 focus-within:shadow-xl focus-within:border-primary/20 transition-all duration-200">
            {/* Location Icon */}
            <div className="flex items-center justify-center sm:justify-start px-3 sm:px-4 text-muted-foreground">
              <MapPin
                className="size-5 sm:size-6 text-primary"
                aria-hidden="true"
              />
            </div>

            {/* Input Field */}
            <Input
              type="text"
              placeholder="Enter your delivery address"
              className="flex-1 border-0 shadow-none focus-visible:ring-0 text-base sm:text-lg h-auto py-2 sm:py-3 px-0"
              aria-label="Delivery address input"
            />

            {/* Find Food Button */}
            <Button
              asChild
              className="w-full sm:w-auto bg-[#e21b70] hover:bg-[#c1185f] text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Link href="/browse">Find Food</Link>
            </Button>
          </div>
        </div>

        {/* Cuisine Filter Pills */}
        <div className="mb-6">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 sm:gap-3 min-w-max sm:min-w-0 sm:flex-wrap">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  asChild
                  variant="outline"
                  className="cursor-pointer gap-2 px-4 py-2 text-sm font-medium bg-pink-50 hover:bg-[#e21b70] hover:text-white border-pink-100 hover:border-[#e21b70] transition-all duration-200"
                >
                  <Link href={`/browse?category=${category.id}`}>
                    <span className="text-base" aria-hidden="true">
                      {category.emoji}
                    </span>
                    <span>{category.name}</span>
                  </Link>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Display */}
        <div className="mb-6 text-center">
          <p className="text-sm sm:text-base text-muted-foreground">
            <span className="font-semibold text-foreground">
              {restaurantCount.toLocaleString()}
            </span>{" "}
            restaurants delivering to you now
          </p>
        </div>

        {/* Secondary CTA Button */}
        <div className="text-center">
          <Button
            asChild
            variant="outline"
            className="border-2 border-[#e21b70] text-[#e21b70] bg-transparent hover:bg-[#e21b70] hover:text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-all duration-200"
          >
            <Link href="/restaurants">Browse All Restaurants</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
