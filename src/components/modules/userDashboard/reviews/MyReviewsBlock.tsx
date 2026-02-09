"use client";

import { deleteReview } from "@/actions/review.actions";
import { Review } from "@/types/review.type";
import { User } from "@/types/user.type";
import StarRating from "@/components/modules/common/StarRating";
import ReviewFormDialog from "@/components/modules/common/ReviewFormDialog";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MessageSquare, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface MyReviewsBlockProps {
  reviews: Review[];
  user: User | null;
}

export default function MyReviewsBlock({ reviews, user }: MyReviewsBlockProps) {
  const router = useRouter();

  async function handleDelete(reviewId: string) {
    const toastId = toast.loading("Deleting review...");
    try {
      const result = await deleteReview(reviewId);
      if (result.error) {
        toast.error(result.error.message, { id: toastId });
      } else {
        toast.success("Review deleted.", { id: toastId });
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete review.", { id: toastId });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">My Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Manage your meal reviews
        </p>
      </div>

      {reviews.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <MessageSquare className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">No Reviews Yet</h3>
            <p className="text-muted-foreground max-w-md">
              You haven&apos;t reviewed any meals yet. After a delivered order,
              you can leave reviews from the order details page.
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Your Reviews
            </CardTitle>
            <CardDescription>
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meal</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Comment
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {review.meal?.image && (
                            <Image
                              src={review.meal.image}
                              alt={review.meal?.name ?? "Meal"}
                              width={40}
                              height={40}
                              className="rounded object-cover"
                            />
                          )}
                          <span className="font-medium text-sm">
                            {review.meal?.name ?? "Unknown Meal"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StarRating value={review.rating} readonly size="sm" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {review.comment || "—"}
                        </p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(review.createdAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {user && (
                            <ReviewFormDialog
                              trigger={
                                <Button variant="ghost" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              }
                              mealId={review.mealId}
                              orderId={review.orderId}
                              customerId={user.id}
                              mealName={review.meal?.name ?? "Meal"}
                              mealImage={review.meal?.image}
                              existingReview={review}
                              onSuccess={() => router.refresh()}
                            />
                          )}
                          <ConfirmationDialog
                            title="Delete Review"
                            description="Are you sure you want to delete this review? This action cannot be undone."
                            variant="destructive"
                            trigger={<Trash2 className="h-4 w-4" />}
                            actionFunction={() => handleDelete(review.id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
