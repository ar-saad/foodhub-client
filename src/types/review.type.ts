export interface Review {
  id: string;
  customerId: string;
  mealId: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    image?: string;
  };
  meal?: {
    id: string;
    name: string;
    image: string;
  };
  order?: {
    id: string;
  };
}

export interface CreateReviewPayload {
  customerId: string;
  mealId: string;
  orderId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export interface MealReviewSummary {
  averageRating: number;
  totalReviews: number;
}
