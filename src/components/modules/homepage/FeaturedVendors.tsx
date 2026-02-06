"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Clock, DollarSign } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Provider } from "@/types";

const mockProviders: Provider[] = [
  {
    id: "1",
    name: "Bella Italia",
    rating: 4.5,
    deliveryTime: "25-30 min",
    priceRange: "$$",
    coverImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0",
    signatureDish: {
      name: "Signature Margherita Pizza",
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0",
      price: "$12.99",
    },
  },
  {
    id: "2",
    name: "Sakura Sushi",
    rating: 4.8,
    deliveryTime: "20-25 min",
    priceRange: "$$$",
    coverImage:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1527&auto=format&fit=crop&ixlib=rb-4.1.0",
    logo: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1527&auto=format&fit=crop&ixlib=rb-4.1.0",
    signatureDish: {
      name: "Dragon Roll Special",
      image:
        "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0",
      price: "$18.99",
    },
  },
  {
    id: "3",
    name: "Burger House",
    rating: 4.3,
    deliveryTime: "15-20 min",
    priceRange: "$$",
    coverImage:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.1.0",
    logo: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0",
    signatureDish: {
      name: "Classic Cheeseburger",
      image:
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0",
      price: "$9.99",
    },
  },
  {
    id: "4",
    name: "Taco Fiesta",
    rating: 4.6,
    deliveryTime: "20-25 min",
    priceRange: "$",
    coverImage:
      "https://images.unsplash.com/photo-1565299585323-38174c3c6a0e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    logo: "https://images.unsplash.com/photo-1700625916627-16ad4fb0553c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    signatureDish: {
      name: "Carnitas Tacos",
      image:
        "https://images.unsplash.com/photo-1700625916627-16ad4fb0553c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
      price: "$8.99",
    },
  },
  {
    id: "5",
    name: "Pasta Paradise",
    rating: 4.7,
    deliveryTime: "30-35 min",
    priceRange: "$$",
    coverImage:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0",
    logo: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?q=80&w=2016&auto=format&fit=crop&ixlib=rb-4.1.0",
    signatureDish: {
      name: "Creamy Carbonara",
      image:
        "https://images.unsplash.com/photo-1598866594230-a7c12756260f?q=80&w=2016&auto=format&fit=crop&ixlib=rb-4.1.0",
      price: "$14.99",
    },
  },
  {
    id: "6",
    name: "Sweet Dreams",
    rating: 4.9,
    deliveryTime: "15-20 min",
    priceRange: "$$",
    coverImage:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0",
    logo: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1078&auto=format&fit=crop&ixlib=rb-4.1.0",
    signatureDish: {
      name: "Chocolate Lava Cake",
      image:
        "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1078&auto=format&fit=crop&ixlib=rb-4.1.0",
      price: "$7.99",
    },
  },
  {
    id: "7",
    name: "Dragon Wok",
    rating: 4.4,
    deliveryTime: "25-30 min",
    priceRange: "$$",
    coverImage:
      "https://images.unsplash.com/photo-1631100732613-6b65da9a343d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0",
    logo: "https://images.unsplash.com/photo-1631100732613-6b65da9a343d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0",
    signatureDish: {
      name: "Kung Pao Chicken",
      image:
        "https://images.unsplash.com/photo-1631100732613-6b65da9a343d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0",
      price: "$13.99",
    },
  },
  {
    id: "8",
    name: "Green Garden",
    rating: 4.2,
    deliveryTime: "20-25 min",
    priceRange: "$$",
    coverImage:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    logo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    signatureDish: {
      name: "Caesar Salad",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
      price: "$10.99",
    },
  },
];

export default function FeaturedVendors() {
  return (
    <section
      className="w-full py-12 md:py-16 bg-background"
      aria-label="Featured vendors"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 container">
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
              {mockProviders.map((provider) => (
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
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            aria-label="See all restaurants"
          >
            See All Restaurants
          </Button>
        </div>
      </div>
    </section>
  );
}

interface ProviderCardProps {
  provider: Provider;
}

function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-[320px] h-95 mx-auto",
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
      {/* Cover Image with Logo */}
      <div className="relative h-45 w-full">
        <Image
          src={provider.coverImage}
          alt={`${provider.name} restaurant cover`}
          fill
          className="object-cover rounded-t-xl"
          sizes="320px"
        />
        {/* Restaurant Logo - Overlapping */}
        <div className="absolute -bottom-8 left-4">
          <div className="relative w-15 h-15 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
            <Image
              src={provider.logo}
              alt={`${provider.name} logo`}
              fill
              className="object-cover"
              sizes="60px"
            />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 flex flex-col pt-10 px-4 pb-4">
        {/* Restaurant Name */}
        <h3 className="font-semibold text-lg mb-3 text-foreground">
          {provider.name}
        </h3>

        {/* Rating + Delivery Info Row */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star
              className="size-4 fill-yellow-400 text-yellow-400"
              aria-hidden="true"
            />
            <span className="font-medium">{provider.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="size-4" aria-hidden="true" />
            <span>{provider.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="size-4" aria-hidden="true" />
            <span>{provider.priceRange}</span>
          </div>
        </div>

        {/* Signature Dish */}
        <div className="flex items-center gap-3 mb-4 p-2 bg-muted/50 rounded-lg">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
            <Image
              src={provider.signatureDish.image}
              alt={provider.signatureDish.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {provider.signatureDish.name}
            </p>
            <p className="text-sm font-semibold text-primary mt-1">
              {provider.signatureDish.price}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
            size="sm"
            aria-label={`View menu for ${provider.name}`}
          >
            View Menu
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            aria-label={`Quick order from ${provider.name}`}
          >
            Quick Order
          </Button>
        </div>
      </div>
    </Card>
  );
}
