import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/category.type";

interface BrowseByCravingProps {
  categories?: Category[];
}

const cravingPrefixes = [
  "Craving",
  "Want",
  "Need",
  "Love",
  "Fancy",
  "Try",
  "Feel Like",
  "In The Mood For",
];

function getCravingTitle(name: string, index: number) {
  const prefix = cravingPrefixes[index % cravingPrefixes.length];
  return `${prefix} ${name}?`;
}

export default function BrowseByCraving({
  categories = [],
}: BrowseByCravingProps) {
  return (
    <section
      className="w-full py-12 md:py-16 bg-background"
      aria-label="Browse by craving"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2">
            What are you craving?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Browse by your mood
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/browse?category=${category.id}`}
              className={cn(
                "group relative overflow-hidden rounded-xl",
                "h-50 md:h-70",
                "bg-foreground/5",
                "shadow-sm hover:shadow-xl",
                "transition-all duration-300 ease-out",
                "transform hover:scale-[1.05]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                "cursor-pointer",
              )}
              aria-label={`Browse ${category.name}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Dark Overlay - becomes darker on hover */}
                <div
                  className={cn(
                    "absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/30",
                    "transition-opacity duration-300",
                    "group-hover:from-black/80 group-hover:via-black/50 group-hover:to-black/40",
                  )}
                />
              </div>

              {/* Content Overlay */}
              <div className="relative h-full flex flex-col justify-center items-center text-center p-4 md:p-6">
                {/* Category Title */}
                <h3 className="text-5xl mb-3">{category.emoji}</h3>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg">
                  {getCravingTitle(category.name, index)}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
