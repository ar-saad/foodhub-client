import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Aisha Rahman",
    role: "Regular Customer",
    avatar: "AR",
    rating: 5,
    review:
      "FoodHub has completely changed how I eat. The delivery is always on time and the food arrives piping hot. I order at least 3 times a week!",
    restaurant: "Rajshahi Kitchen",
    color: "bg-pink-500",
  },
  {
    name: "Rafiul Hasan",
    role: "Food Enthusiast",
    avatar: "RH",
    rating: 5,
    review:
      "I love how easy it is to find new restaurants. The category filters are super helpful and the checkout process is smooth as butter.",
    restaurant: "Pizza Palace",
    color: "bg-violet-500",
  },
  {
    name: "Nusrat Jahan",
    role: "Busy Professional",
    avatar: "NJ",
    rating: 5,
    review:
      "As someone who works long hours, FoodHub is a lifesaver. Great variety, reliable delivery, and the app never lets me down.",
    restaurant: "Aurora Bites",
    color: "bg-emerald-500",
  },
  {
    name: "Tariq Ahmed",
    role: "Student",
    avatar: "TA",
    rating: 4,
    review:
      "Affordable options and student-friendly deals. The 'Browse by Cuisine' feature helped me discover so many amazing local places.",
    restaurant: "Spice Garden",
    color: "bg-amber-500",
  },
];

function StarRatingDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted",
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      className="w-full py-16 md:py-24 bg-background"
      aria-labelledby="testimonials-heading"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Customer Stories
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
          >
            What Our Customers <span className="text-primary">Say</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t just take our word for it — hear from the people who
            order with us every day.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className={cn(
                "group relative flex flex-col p-6 rounded-2xl border border-border bg-card",
                "hover:shadow-xl hover:border-primary/30",
                "transition-all duration-300",
              )}
            >
              {/* Quote icon */}
              <Quote
                className="absolute top-4 right-4 w-8 h-8 text-muted/30 group-hover:text-primary/20 transition-colors duration-300"
                aria-hidden="true"
              />

              {/* Rating */}
              <StarRatingDisplay rating={t.rating} />

              {/* Review text */}
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed flex-1">
                &ldquo;{t.review}&rdquo;
              </p>

              {/* Divider */}
              <div className="my-4 border-t border-border" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                  aria-hidden="true"
                >
                  {t.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
