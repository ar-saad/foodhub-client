"use client";

import { useEffect, useState } from "react";
import { getReviews } from "@/actions/review.actions";
import { Review } from "@/types/review.type";
import { Meal } from "@/types/meal.type";
import ReviewCard from "../common/ReviewCard";
import StarRating from "../common/StarRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageSquare, Loader2 } from "lucide-react";
import Image from "next/image";

interface RestaurantReviewsSectionProps {
  meals: Meal[];
}

interface MealReviewData {
  mealId: string;
  meal: Meal;
  reviews: Review[];
  averageRating: number;
}

export default function RestaurantReviewsSection({
  meals,
}: RestaurantReviewsSectionProps) {
  const [mealReviews, setMealReviews] = useState<MealReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllReviews() {
      setLoading(true);
      try {
        const results = await Promise.all(
          meals.map(async (meal) => {
            const result = await getReviews({ mealId: meal.id });
            const reviews: Review[] =
              !result.error && result.data?.data ? result.data.data : [];
            const averageRating =
              reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;
            return {
              mealId: meal.id,
              meal,
              reviews,
              averageRating,
            };
          }),
        );
        // Only show meals that have reviews
        setMealReviews(results.filter((r) => r.reviews.length > 0));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    if (meals.length > 0) {
      loadAllReviews();
    } else {
      setLoading(false);
    }
  }, [meals]);

  const totalReviews = mealReviews.reduce(
    (sum, m) => sum + m.reviews.length,
    0,
  );
  const overallAverage =
    totalReviews > 0
      ? mealReviews.reduce(
          (sum, m) => sum + m.averageRating * m.reviews.length,
          0,
        ) / totalReviews
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (mealReviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purple-600" />
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <StarRating value={Math.round(overallAverage)} readonly size="md" />
            <span className="text-slate-600">
              {overallAverage.toFixed(1)} overall ({totalReviews}{" "}
              {totalReviews === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>
      </div>

      <Accordion type="multiple" className="space-y-3">
        {mealReviews.map((mealData) => (
          <AccordionItem
            key={mealData.mealId}
            value={mealData.mealId}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                {mealData.meal.image && (
                  <Image
                    src={mealData.meal.image}
                    alt={mealData.meal.name}
                    width={40}
                    height={40}
                    className="rounded object-cover"
                  />
                )}
                <div className="text-left">
                  <span className="font-medium">{mealData.meal.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating
                      value={Math.round(mealData.averageRating)}
                      readonly
                      size="sm"
                    />
                    <span className="text-xs text-muted-foreground">
                      {mealData.averageRating.toFixed(1)} (
                      {mealData.reviews.length})
                    </span>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="divide-y">
                {mealData.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
