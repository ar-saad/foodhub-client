"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createReview, updateReview } from "@/actions/review.actions";
import { Review } from "@/types/review.type";
import StarRating from "./StarRating";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface ReviewFormDialogProps {
  trigger: React.ReactNode;
  mealId: string;
  orderId: string;
  customerId: string;
  mealName: string;
  mealImage?: string;
  existingReview?: Review | null;
  onSuccess?: (review?: Review) => void;
}

export default function ReviewFormDialog({
  trigger,
  mealId,
  orderId,
  customerId,
  mealName,
  mealImage,
  existingReview,
  onSuccess,
}: ReviewFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!existingReview;

  async function handleSubmit() {
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(
      isEditing ? "Updating review..." : "Submitting review...",
    );

    try {
      let result;
      if (isEditing && existingReview) {
        result = await updateReview(existingReview.id, {
          rating,
          comment: comment.trim() || undefined,
        });
      } else {
        result = await createReview({
          customerId,
          mealId,
          orderId,
          rating,
          comment: comment.trim() || undefined,
        });
      }

      if (result.error) {
        toast.error(result.error.message, { id: toastId });
      } else {
        toast.success(
          isEditing
            ? "Review updated successfully!"
            : "Review submitted successfully!",
          { id: toastId },
        );
        onSuccess?.(result.data);
        setOpen(false);
      }
    } catch {
      toast.error("Something went wrong.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  }

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen);
    if (newOpen) {
      // Reset to existing values when opening
      setRating(existingReview?.rating ?? 0);
      setComment(existingReview?.comment ?? "");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Review" : "Leave a Review"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your review for this meal."
              : "Share your experience with this meal."}
          </DialogDescription>
        </DialogHeader>

        {/* Meal info */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          {mealImage && (
            <Image
              src={mealImage}
              alt={mealName}
              width={48}
              height={48}
              className="rounded object-cover"
            />
          )}
          <span className="font-medium text-sm">{mealName}</span>
        </div>

        <div className="space-y-4 py-2">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="review-comment">Comment (optional)</Label>
            <Textarea
              id="review-comment"
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/500
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || rating === 0}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Review" : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
