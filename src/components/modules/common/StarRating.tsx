"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
  className,
  showValue = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const displayValue = hovered || value;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayValue;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={cn(
              "transition-colors duration-150",
              readonly
                ? "cursor-default"
                : "cursor-pointer hover:scale-110 transition-transform",
            )}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                sizeMap[size],
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/40",
              )}
            />
          </button>
        );
      })}
      {showValue && value > 0 && (
        <span className="ml-1.5 text-sm font-medium text-muted-foreground">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
