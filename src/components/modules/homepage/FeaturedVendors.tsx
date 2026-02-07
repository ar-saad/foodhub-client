import Image from "next/image";
import Link from "next/link";
import { MapPin, UtensilsCrossed } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Provider } from "@/types";

interface FeaturedVendorsProps {
  providers: Provider[];
}

export default function FeaturedVendors({ providers }: FeaturedVendorsProps) {
  if (providers.length === 0) return null;

  return (
    <section
      className="w-full py-12 md:py-16 bg-background"
      aria-label="Featured vendors"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 text-center md:text-left">
            Top Picks Near You
          </h2>
          <p className="text-sm md:text-base text-muted-foreground text-center md:text-left">
            Popular restaurants in your area
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: false,
              slidesToScroll: 1,
              dragFree: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {providers.map((provider) => (
                <CarouselItem
                  key={provider.id}
                  className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <ProviderCard provider={provider} />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Navigation Buttons - Hidden on mobile */}
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </div>

        {/* See All Button */}
        <div className="mt-8 md:mt-12 text-center">
          <Link href="/restaurants">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              aria-label="See all restaurants"
            >
              See All Restaurants
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

interface ProviderCardProps {
  provider: Provider;
}

function ProviderCard({ provider }: ProviderCardProps) {
  const featuredMeal =
    provider.meals?.find((m) => m.isFeatured) ?? provider.meals?.[0];

  return (
    <Link href={`/restaurants/${provider.id}`}>
      <Card
        className={cn(
          "w-full max-w-[320px] h-120 mx-auto",
          "bg-white shadow-sm hover:shadow-xl",
          "rounded-xl overflow-hidden",
          "transition-all duration-200 ease-out",
          "hover:-translate-y-2",
          "cursor-pointer",
          "flex flex-col",
        )}
        role="article"
        aria-label={`Restaurant: ${provider.name}`}
      >
        {/* Cover Image area */}
        <div className="relative h-52 w-full">
          {provider.logo ? (
            <Image
              src={provider.logo}
              alt={`${provider.name} cover`}
              fill
              className="object-cover rounded-t-xl"
              sizes="320px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-pink-100 to-pink-200 rounded-t-xl">
              <UtensilsCrossed className="h-16 w-16 text-pink-400" />
            </div>
          )}
          {/* Open/Closed Badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant={provider.isOpen ? "default" : "secondary"}
              className={provider.isOpen ? "bg-green-600" : "bg-gray-500"}
            >
              {provider.isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex-1 flex flex-col px-4 pt-2 pb-4">
          {/* Restaurant Name */}
          <h3 className="font-semibold text-lg mb-1 text-foreground line-clamp-1">
            {provider.name}
          </h3>

          {/* Address */}
          <div className="flex items-center gap-1 mb-3 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{provider.address}</span>
          </div>

          {/* Description */}
          {provider.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {provider.description}
            </p>
          )}

          {/* Featured Meal */}
          {featuredMeal && (
            <div className="flex items-center gap-3 mb-4 p-2 bg-muted/50 rounded-lg">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={featuredMeal.image}
                  alt={featuredMeal.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {featuredMeal.name}
                </p>
                <p className="text-sm font-semibold text-primary mt-1">
                  ৳{featuredMeal.price}
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-auto">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
              size="sm"
              aria-label={`View menu for ${provider.name}`}
            >
              View Menu
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
