"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getMeals } from "@/actions/meal.actions";
import { Meal, PaginationControlsProps } from "@/types";
import MealListBlock from "@/components/modules/providerDashboard/meals/MealListBlock";
import { useUser } from "@/contexts/UserContext";
import { SortingState, PaginationState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function MealsPage() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [meta, setMeta] = useState<PaginationControlsProps | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);

  // Derive state from URL
  const currentPage = Number(searchParams.get("page") || "1");
  const currentLimit = Number(searchParams.get("limit") || "10");
  const currentSortBy = searchParams.get("sortBy") || "name";
  const currentSortOrder = searchParams.get("sortOrder") || "asc";
  const currentSearch = searchParams.get("search") || "";

  // Stable ref for searchParams
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const updateURL = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router],
  );

  // Sorting
  const sortingState: SortingState = currentSortBy
    ? [{ id: currentSortBy, desc: currentSortOrder === "desc" }]
    : [];

  const onSortingChange = useCallback(
    (state: SortingState) => {
      if (state.length > 0) {
        updateURL({
          sortBy: state[0].id,
          sortOrder: state[0].desc ? "desc" : "asc",
          page: "",
        });
      } else {
        updateURL({ sortBy: "", sortOrder: "", page: "" });
      }
    },
    [updateURL],
  );

  // Pagination
  const paginationState: PaginationState = {
    pageIndex: currentPage - 1,
    pageSize: currentLimit,
  };

  const onPaginationChange = useCallback(
    (state: PaginationState) => {
      updateURL({
        page: String(state.pageIndex + 1),
        limit: String(state.pageSize),
      });
    },
    [updateURL],
  );

  // Search
  const onSearchChange = useCallback(
    (value: string) => {
      updateURL({ search: value, page: "" });
    },
    [updateURL],
  );

  // Fetch meals whenever URL params change
  useEffect(() => {
    async function loadMeals() {
      setLoading(true);

      try {
        const result = await getMeals({
          providerId: user?.providerProfile?.id,
          search: currentSearch,
          page: String(currentPage),
          limit: String(currentLimit),
          sortBy: currentSortBy,
          sortOrder: currentSortOrder,
        });

        if (result.error) {
          setMeals([]);
          setMeta(undefined);
        } else {
          setMeals(result.data?.data?.data ?? []);
          setMeta(result.data?.data?.meta ?? undefined);
        }
      } catch {
        setMeals([]);
        setMeta(undefined);
      } finally {
        setLoading(false);
      }
    }

    loadMeals();
  }, [searchParams]);

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Meals</h1>
          <p className="text-muted-foreground mt-1">Manage your meals</p>
        </div>
      </div>

      <MealListBlock
        meals={meals}
        meta={meta}
        isLoading={loading}
        search={{
          initialValue: currentSearch,
          placeholder: "Search meals...",
          onDebouncedChange: onSearchChange,
        }}
        sorting={{
          state: sortingState,
          onSortingChange,
        }}
        pagination={{
          state: paginationState,
          onPaginationChange,
        }}
        toolbarAction={
          <Link href="/provider-dashboard/meals/create">
            <Button size="lg" className="gap-2">
              <Plus className="size-4" />
              Add New meal
            </Button>
          </Link>
        }
      />
    </div>
  );
}
