import MealDetailBlock from "@/components/modules/browse/MealDetailBlock";
import RelatedMeals from "@/components/modules/browse/RelatedMeals";
import ReviewList from "@/components/modules/common/ReviewList";
import { getMeal, getMeals } from "@/actions/meal.actions";
import { getReviews } from "@/actions/review.actions";
import { Meal } from "@/types/meal.type";
import { notFound } from "next/navigation";

export default async function MealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getMeal(id);

  if (result.error || !result.data?.data) {
    notFound();
  }

  const meal: Meal = result.data.data;

  const [providerResult, categoryResult, reviewsResult] = await Promise.all([
    getMeals({ providerId: meal.providerId, limit: "5" }),
    getMeals({ categoryId: meal.categoryId, limit: "5" }),
    getReviews({ mealId: id }),
  ]);

  const reviews = reviewsResult.data?.data?.data ?? [];

  const relatedByProvider = (providerResult.data?.data?.data ?? []).filter(
    (m: Meal) => m.id !== id,
  );

  const relatedByCategory = (categoryResult.data?.data?.data ?? []).filter(
    (m: Meal) => m.id !== id && m.providerId !== meal.providerId,
  );

  console.log(meal);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      <MealDetailBlock meal={meal} />

      <ReviewList
        reviews={reviews}
        title="Customer Reviews"
        averageRating={meal.averageRating}
        totalReviews={meal.totalReviews}
      />

      {relatedByProvider.length > 0 && (
        <RelatedMeals
          meals={relatedByProvider}
          title={`More from ${meal.providerProfile?.name ?? "this restaurant"}`}
        />
      )}

      {relatedByCategory.length > 0 && (
        <RelatedMeals
          meals={relatedByCategory}
          title={`More ${meal.category?.name ?? "similar"} dishes`}
        />
      )}
    </div>
  );
}
