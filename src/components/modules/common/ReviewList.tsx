"use client";

import { useState } from "react";
import { Review } from "@/types/review.type";
import ReviewCard from "./ReviewCard";
import StarRating from "./StarRating";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const INITIAL_DISPLAY_COUNT = 3;

interface ReviewListProps {
  reviews: Review[];
  title?: string;
  averageRating?: number;
  totalReviews?: number;
}

export default function ReviewList({
  reviews,
  title = "Reviews",
  averageRating = 0,
  totalReviews,
}: ReviewListProps) {
  const [expanded, setExpanded] = useState(false);

  const reviewCount = totalReviews ?? reviews.length;

  const hasMore = reviews.length > INITIAL_DISPLAY_COUNT;
  const displayedReviews = expanded
    ? reviews
    : reviews.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {title}
          </CardTitle>
          {reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <StarRating
                value={Math.round(averageRating)}
                readonly
                size="sm"
              />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({reviewCount}{" "}
                {reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No reviews yet.
          </p>
        ) : (
          <>
            <div className="divide-y">
              {displayedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="text-muted-foreground"
                >
                  {expanded ? (
                    <>
                      Show less <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show all {reviews.length} reviews{" "}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
