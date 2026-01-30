"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CuisineOption {
  id: string;
  emoji: string;
  label: string;
}

const cuisineOptions: CuisineOption[] = [
  { id: "pizza", emoji: "🍕", label: "Pizza" },
  { id: "burgers", emoji: "🍔", label: "Burgers" },
  { id: "asian", emoji: "🍜", label: "Asian" },
  { id: "mexican", emoji: "🌮", label: "Mexican" },
  { id: "italian", emoji: "🍝", label: "Italian" },
  { id: "japanese", emoji: "🍱", label: "Japanese" },
  { id: "healthy", emoji: "🥗", label: "Healthy" },
  { id: "desserts", emoji: "🍰", label: "Desserts" },
];

interface HeroProps {
  restaurantCount?: number;
  onAddressSearch?: (address: string) => void;
  onCuisineSelect?: (cuisineId: string) => void;
  onBrowseAll?: () => void;
}

export default function Hero({
  restaurantCount = 2847,
  onAddressSearch,
  onCuisineSelect,
  onBrowseAll,
}: HeroProps) {
  const [address, setAddress] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  const handleSearch = () => {
    if (address.trim() && onAddressSearch) {
      onAddressSearch(address.trim());
    }
  };

  const handleCuisineClick = (cuisineId: string) => {
    setSelectedCuisine(selectedCuisine === cuisineId ? null : cuisineId);
    if (onCuisineSelect) {
      onCuisineSelect(cuisineId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
              <MapPin className="size-5 sm:size-6 text-primary" aria-hidden="true" />
            </div>

            {/* Input Field */}
            <Input
              type="text"
              placeholder="Enter your delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border-0 shadow-none focus-visible:ring-0 text-base sm:text-lg h-auto py-2 sm:py-3 px-0"
              aria-label="Delivery address input"
            />

            {/* Find Food Button */}
            <Button
              onClick={handleSearch}
              className="w-full sm:w-auto bg-[#e21b70] hover:bg-[#c1185f] text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Find food at this address"
            >
              Find Food
            </Button>
          </div>
        </div>

        {/* Cuisine Filter Pills */}
        <div className="mb-6">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 sm:gap-3 min-w-max sm:min-w-0 sm:flex-wrap">
              {cuisineOptions.map((cuisine) => (
                <button
                  key={cuisine.id}
                  onClick={() => handleCuisineClick(cuisine.id)}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                    "bg-pink-50 hover:bg-[#e21b70] hover:text-white border border-pink-100 hover:border-[#e21b70]",
                    selectedCuisine === cuisine.id &&
                      "bg-[#e21b70] text-white border-[#e21b70]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e21b70] focus-visible:ring-offset-2"
                  )}
                  aria-label={`Filter by ${cuisine.label} cuisine`}
                  aria-pressed={selectedCuisine === cuisine.id}
                >
                  <span className="text-base" aria-hidden="true">
                    {cuisine.emoji}
                  </span>
                  <span>{cuisine.label}</span>
                </button>
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
            onClick={onBrowseAll}
            variant="outline"
            className="border-2 border-[#e21b70] text-[#e21b70] bg-transparent hover:bg-[#e21b70] hover:text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-all duration-200"
            aria-label="Browse all restaurants"
          >
            Browse All Restaurants
          </Button>
        </div>
      </div>
    </section>
  );
}
