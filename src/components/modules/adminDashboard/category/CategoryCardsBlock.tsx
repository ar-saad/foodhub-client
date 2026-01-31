import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

export default function CategoryCardsBlock({
  categories,
}: {
  categories: Category[];
}) {
  if (!categories || categories.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">No categories found.</p>
          <Link href="/admin-dashboard/categories/create">
            <Button variant="outline">Create your first category</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category: Category) => (
          <Card
            key={category.id}
            className={cn(
              "group overflow-hidden",
              "hover:shadow-lg transition-all duration-200",
              "cursor-pointer",
            )}
          >
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-linear-to-br from-muted to-muted/50">
                  <span className="text-6xl">{category.emoji || "📦"}</span>
                </div>
              )}
              {/* Emoji Badge */}
              {category.emoji && category.image && (
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-md">
                  <span className="text-2xl">{category.emoji}</span>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg truncate">
                {category.name}
              </h3>
              {!category.image && category.emoji && (
                <div className="mt-2 text-center">
                  <span className="text-4xl">{category.emoji}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
