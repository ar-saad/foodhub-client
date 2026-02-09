import MyReviewsBlock from "@/components/modules/userDashboard/reviews/MyReviewsBlock";
import { getCurrentUser } from "@/actions/user.actions";
import { getReviews } from "@/actions/review.actions";
import { Review } from "@/types/review.type";

export default async function CustomerReviewsPage() {
  const { data: userData } = await getCurrentUser();
  const user = userData?.data;

  let reviews: Review[] = [];
  if (user?.id) {
    const result = await getReviews({ customerId: user.id });
    if (!result.error && result.data?.data) {
      reviews = result.data.data.data;
    }
  }

  return (
    <div>
      <MyReviewsBlock reviews={reviews} user={user} />
    </div>
  );
}
