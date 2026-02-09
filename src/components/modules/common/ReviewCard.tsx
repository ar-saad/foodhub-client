"use client";

import { Review } from "@/types/review.type";
import StarRating from "./StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  review: Review;
}

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex gap-3 py-4 border-b last:border-b-0">
      <div className="shrink-0">
        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-medium overflow-hidden">
          {review.customer?.image ? (
            <img
              src={review.customer.image}
              alt={review.customer.name ?? "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{getInitials(review.customer?.name)}</span>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">
            {review.customer?.name ?? "Anonymous"}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(review.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <StarRating value={review.rating} readonly size="sm" />
        {review.comment && (
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            {review.comment}
          </p>
        )}
      </div>
    </div>
  );
}
