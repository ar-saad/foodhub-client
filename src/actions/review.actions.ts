"use server";

import { revalidatePath } from "next/cache";
import { reviewService } from "@/services/review.service";
import { CreateReviewPayload, UpdateReviewPayload } from "@/types/review.type";

export async function getReviews(params: {
  mealId?: string;
  customerId?: string;
  orderId?: string;
  page?: string;
  limit?: string;
}) {
  return await reviewService.getReviews(params);
}

export async function createReview(payload: CreateReviewPayload) {
  const result = await reviewService.create(payload);
  if (!result.error) {
    revalidatePath("/dashboard/reviews", "page");
  }
  return result;
}

export async function updateReview(
  reviewId: string,
  payload: UpdateReviewPayload,
) {
  const result = await reviewService.update(reviewId, payload);
  if (!result.error) {
    revalidatePath("/dashboard/reviews", "page");
  }
  return result;
}

export async function deleteReview(reviewId: string) {
  const result = await reviewService.delete(reviewId);
  if (!result.error) {
    revalidatePath("/dashboard/reviews", "page");
  }
  return result;
}
