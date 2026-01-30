"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface Category {
  id: string;
  title: string;
  imageUrl: string;
  restaurantCount: number;
  alt: string;
}

const categories: Category[] = [
  {
    id: "pizza",
    title: "Craving Pizza?",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    restaurantCount: 127,
    alt: "Delicious pizza with cheese and toppings",
  },
  {
    id: "sushi",
    title: "Need Sushi?",
    imageUrl:
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    restaurantCount: 89,
    alt: "Fresh sushi rolls and sashimi",
  },
  {
    id: "burgers",
    title: "Want Burgers?",
    imageUrl:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    restaurantCount: 156,
    alt: "Juicy burger with fries",
  },
  {
    id: "desserts",
    title: "Sweet Desserts?",
    imageUrl:
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1078&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    restaurantCount: 94,
    alt: "Delicious desserts and sweets",
  },
  {
    id: "salads",
    title: "Fresh Salads?",
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    restaurantCount: 72,
    alt: "Fresh and healthy salads",
  },
  {
    id: "pasta",
    title: "Love Pasta?",
    imageUrl:
      "https://images.unsplash.com/photo-1598866594230-a7c12756260f?q=80&w=2016&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    restaurantCount: 103,
    alt: "Italian pasta dishes",
  },
  {
    id: "tacos",
    title: "Taco Time?",
    imageUrl:
      "https://images.unsplash.com/photo-1700625916627-16ad4fb0553c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    restaurantCount: 118,
    alt: "Mexican tacos with toppings",
  },
  {
    id: "asian",
    title: "Asian Cuisine?",
    imageUrl:
      "https://images.unsplash.com/photo-1631100732613-6b65da9a343d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    restaurantCount: 145,
    alt: "Asian cuisine dishes",
  },
];

interface BrowseByCravingProps {
  onCategoryClick?: (categoryId: string) => void;
}

export default function BrowseByCraving({
  onCategoryClick,
}: BrowseByCravingProps) {
  const handleCategoryClick = (categoryId: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId);
    }
  };

  return (
    <section
      className="w-full py-12 md:py-16 bg-background"
      aria-label="Browse by craving"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2">
            What are you craving?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Browse by your mood
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "group relative overflow-hidden rounded-xl",
                "h-50 md:h-70",
                "bg-foreground/5",
                "shadow-sm hover:shadow-xl",
                "transition-all duration-300 ease-out",
                "transform hover:scale-[1.05]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                "cursor-pointer",
              )}
              aria-label={`Browse ${category.title} - ${category.restaurantCount} restaurants`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={category.imageUrl}
                  alt={category.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Dark Overlay - becomes darker on hover */}
                <div
                  className={cn(
                    "absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/30",
                    "transition-opacity duration-300",
                    "group-hover:from-black/80 group-hover:via-black/50 group-hover:to-black/40",
                  )}
                />
              </div>

              {/* Content Overlay */}
              <div className="relative h-full flex flex-col justify-end p-4 md:p-6">
                {/* Category Title */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg">
                  {category.title}
                </h3>

                {/* Restaurant Count */}
                <p className="text-sm md:text-base text-white/90 mb-3 md:mb-4 drop-shadow-md">
                  {category.restaurantCount} restaurants
                </p>

                {/* Browse Now Button - appears on hover */}
                <div
                  className={cn(
                    "transform transition-all duration-300 ease-out",
                    "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                  )}
                >
                  <div
                    className={cn(
                      "w-full bg-[#e21b70] hover:bg-[#c1185f] text-white",
                      "font-semibold shadow-lg rounded-md",
                      "px-4 py-2.5 flex items-center justify-center",
                      "transition-all duration-200",
                    )}
                  >
                    Browse Now
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
