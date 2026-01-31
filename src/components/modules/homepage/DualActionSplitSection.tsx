"use client";

import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DualActionSplitSectionProps {
  onCuisineClick?: () => void;
  onRestaurantClick?: () => void;
}

const cuisineFlags = [
  "🇮🇹", // Italian
  "🇨🇳", // Chinese
  "🇮🇳", // Indian
  "🇯🇵", // Japanese
  "🇲🇽", // Mexican
  "🇹🇭", // Thai
  "🇫🇷", // French
  "🇰🇷", // Korean
];

export default function DualActionSplitSection({
  onCuisineClick,
  onRestaurantClick,
}: DualActionSplitSectionProps) {
  const handleCuisineClick = () => {
    if (onCuisineClick) {
      onCuisineClick();
    }
  };

  const handleRestaurantClick = () => {
    if (onRestaurantClick) {
      onRestaurantClick();
    }
  };

  return (
    <section
      className="w-full py-16 md:py-20 bg-background"
      aria-label="Explore options"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Optional Section Heading */}
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2">
            How Do You Want to Explore?
          </h2>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN - Browse by Cuisine */}
          <Link
            href="/cuisines"
            onClick={handleCuisineClick}
            className={cn(
              "group relative overflow-hidden rounded-2xl",
              "h-70 md:h-100",
              "p-8 md:p-12",
              "shadow-md hover:shadow-2xl",
              "transition-all duration-300 ease-out",
              "transform hover:scale-[1.02]",
              "flex flex-col items-center justify-center",
              "cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4",
              "focus-visible:ring-offset-background",
            )}
            style={{
              background:
                "linear-gradient(135deg, oklch(0.97 0.02 353), oklch(0.95 0.03 353))",
            }}
            aria-label="Browse restaurants by cuisine type"
          >
            {/* Flag Grid */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {cuisineFlags.map((flag, index) => (
                <div
                  key={index}
                  className="text-4xl md:text-5xl flex items-center justify-center"
                  aria-hidden="true"
                >
                  {flag}
                </div>
              ))}
            </div>

            {/* Heading */}
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-center">
              Browse by Cuisine
            </h3>

            {/* Subtext */}
            <p className="text-base md:text-lg text-muted-foreground mb-6 text-center">
              Explore flavors from around the world
            </p>

            {/* CTA Button */}
            <Button
              className={cn(
                "bg-[#e21b70] hover:bg-[#c1185f] text-white",
                "font-semibold shadow-lg",
                "px-6 py-3 rounded-lg",
                "transition-all duration-200",
                "group-hover:shadow-xl",
              )}
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                handleCuisineClick();
              }}
              aria-label="Explore cuisines"
            >
              Explore Cuisines
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Button>
          </Link>

          {/* RIGHT COLUMN - Browse by Restaurant */}
          <Link
            href="/restaurants"
            onClick={handleRestaurantClick}
            className={cn(
              "group relative overflow-hidden rounded-2xl",
              "h-70 md:h-100",
              "border-2 border-pink-100",
              "p-8 md:p-12",
              "shadow-md hover:shadow-2xl",
              "transition-all duration-300 ease-out",
              "transform hover:scale-[1.02]",
              "flex flex-col items-center justify-center",
              "cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4",
              "focus-visible:ring-offset-background",
              "hover:border-pink-200",
            )}
            style={{
              backgroundColor: "oklch(0.98 0.01 353)",
            }}
            aria-label="Browse all restaurants"
          >
            {/* Restaurant Logos Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-14 h-14 md:w-16 md:h-16",
                    "rounded-full",
                    "bg-linear-to-br from-pink-100 to-pink-200",
                    "shadow-md",
                    "flex items-center justify-center",
                    "border-2 border-white",
                    "relative overflow-hidden",
                  )}
                  aria-hidden="true"
                >
                  {/* Restaurant icon placeholder */}
                  <UtensilsCrossed className="w-6 h-6 md:w-8 md:h-8 text-pink-600" />
                </div>
              ))}
            </div>

            {/* Heading */}
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-center">
              Browse by Restaurant
            </h3>

            {/* Subtext */}
            <p className="text-base md:text-lg text-muted-foreground mb-6 text-center">
              Find your favorite places to eat
            </p>

            {/* CTA Button */}
            <Button
              className={cn(
                "bg-[#e21b70] hover:bg-[#c1185f] text-white",
                "font-semibold shadow-lg",
                "px-6 py-3 rounded-lg",
                "transition-all duration-200",
                "group-hover:shadow-xl",
              )}
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                handleRestaurantClick();
              }}
              aria-label="View all restaurants"
            >
              All Restaurants
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
