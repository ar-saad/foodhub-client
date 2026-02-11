"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import BrowseMealListBlock from "@/components/modules/browse/BrowseMealList";
import BrowseMealSidebarBlock from "@/components/modules/browse/BrowseMealSidebar";
import { getMeals } from "@/actions/meal.actions";
import { getCategories } from "@/actions/category.actions";
import { Meal } from "@/types/meal.type";
import { Category } from "@/types/category.type";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BrowseMealPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from URL only once
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );

  // Get current filter values from URL
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "name";
  const currentOrder = searchParams.get("order") || "asc";

  // Update URL with new parameters
  const updateURL = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Debounced search removed. Search now triggers only on submit.

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      const result = await getCategories({ limit: "99999" });
      if (result.data) {
        setCategories(result.data?.data?.data);
      }
    }
    loadCategories();
  }, []);

  // Fetch meals whenever URL params change
  useEffect(() => {
    async function loadMeals() {
      setLoading(true);
      setError(null);

      try {
        const result = await getMeals({
          search: searchParams.get("search") || undefined,
          categoryId: searchParams.get("category") || undefined,
          sortBy: searchParams.get("sort") || "name",
          sortOrder: searchParams.get("order") || "asc",
        });

        if (result.error) {
          setError(result.error.message);
          setMeals([]);
        } else {
          setMeals(result.data.data.data || []);
        }
      } catch (err) {
        setError("Failed to load meals. Please try again.");
        setMeals([]);
      } finally {
        setLoading(false);
      }
    }

    loadMeals();
  }, [searchParams]);

  // Handle filter changes
  const handleCategoryChange = (categoryId: string) => {
    updateURL({ category: categoryId });
  };

  const handleSortChange = (sort: string, order: string) => {
    updateURL({ sort, order });
  };

  const handleClearFilters = () => {
    router.replace(pathname);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ search: searchQuery });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-5 my-5">
      {/* Search Bar */}
      <div className="mb-6 mt-2">
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full max-w-xl mx-auto"
        >
          <div className="relative flex items-center w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </span>
            <Input
              type="text"
              placeholder="Search for meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-24 py-6 text-lg rounded-full border-2 border-primary/40 focus:border-primary transition-colors w-full shadow-sm"
            />
            <Button
              type="submit"
              size="lg"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6 py-2 bg-primary text-white font-semibold shadow-md hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:outline-none"
              style={{ minHeight: "2.5rem" }}
            >
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Main Content */}
      <div className="flex gap-5 flex-col lg:flex-row">
        <BrowseMealSidebarBlock
          categories={categories}
          currentCategory={currentCategory}
          currentSort={currentSort}
          currentOrder={currentOrder}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
        />
        <BrowseMealListBlock meals={meals} loading={loading} error={error} />
      </div>
    </div>
  );
}
