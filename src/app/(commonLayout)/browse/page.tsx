"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { PaginationControlsProps } from "@/types";

export default function BrowseMealPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [meta, setMeta] = useState<PaginationControlsProps | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

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
      setPage(1);
      setMeals([]);
      setMeta(null);
      setTotalPages(1);
      try {
        const result = await getMeals({
          search: searchParams.get("search") || undefined,
          categoryId: searchParams.get("category") || undefined,
          sortBy: searchParams.get("sort") || "name",
          sortOrder: searchParams.get("order") || "asc",
          page: "1",
          limit: "9",
        });
        if (result.error) {
          setError(result.error.message);
          setMeals([]);
        } else {
          setMeals(result.data.data.data || []);
          setMeta(result.data.data.meta);
          setTotalPages(result.data.data.meta?.totalPages || 1);
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

  // Infinite scroll: fetch more meals when sentinel is visible
  useEffect(() => {
    if (!observerRef.current) return;
    if (loading || isFetchingMore || page >= totalPages) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && page < totalPages) {
        setIsFetchingMore(true);
        setPage((prev) => prev + 1);
      }
    };

    const observer = new window.IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [observerRef, loading, isFetchingMore, page, totalPages]);

  // Fetch more meals when page changes (after initial load)
  useEffect(() => {
    if (page === 1 || loading) return;
    async function fetchMoreMeals() {
      try {
        const result = await getMeals({
          search: searchParams.get("search") || undefined,
          categoryId: searchParams.get("category") || undefined,
          sortBy: searchParams.get("sort") || "name",
          sortOrder: searchParams.get("order") || "asc",
          page: String(page),
          limit: "9",
        });
        if (result.error) {
          setError(result.error.message);
        } else {
          setMeals((prev) => [...prev, ...(result.data.data.data || [])]);
          setMeta(result.data.data.meta);
          setTotalPages(result.data.data.meta?.totalPages || 1);
        }
      } catch (err) {
        setError("Failed to load more meals. Please try again.");
      } finally {
        setIsFetchingMore(false);
      }
    }
    fetchMoreMeals();
  }, [page, searchParams, loading]);

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
        <div className="flex-1">
          <BrowseMealListBlock
            totalMeals={meta?.count ?? 9}
            meals={meals}
            loading={loading}
            error={error}
          />
          {/* Infinite scroll sentinel */}
          {meals.length > 0 && page < totalPages && !loading && (
            <div
              ref={observerRef}
              className="w-full h-10 flex items-center justify-center mt-6"
            >
              {isFetchingMore && (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
