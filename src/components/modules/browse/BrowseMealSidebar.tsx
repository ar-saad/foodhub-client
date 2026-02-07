"use client";

import { Category } from "@/types/category.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, X } from "lucide-react";

interface BrowseMealSidebarProps {
  categories: Category[];
  currentCategory: string;
  currentSort: string;
  currentOrder: string;
  onCategoryChange: (categoryId: string) => void;
  onSortChange: (sort: string, order: string) => void;
  onClearFilters: () => void;
}

export default function BrowseMealSidebarBlock({
  categories,
  currentCategory,
  currentSort,
  currentOrder,
  onCategoryChange,
  onSortChange,
  onClearFilters,
}: BrowseMealSidebarProps) {
  const hasActiveFilters = currentCategory || currentSort !== "name";

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-8 px-2"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Sort Options */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Sort By</Label>
            <Select
              value={`${currentSort}-${currentOrder}`}
              onValueChange={(value) => {
                const [sort, order] = value.split("-");
                onSortChange(sort, order);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Categories</Label>
            <div className="space-y-2">
              <Button
                variant={!currentCategory ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => onCategoryChange("")}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    currentCategory === category.id ? "default" : "outline"
                  }
                  className="w-full justify-start"
                  onClick={() => onCategoryChange(category.id)}
                >
                  <span className="mr-2">{category.emoji}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Additional Filters Section */}
          <div className="pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              {categories.length} categories available
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
