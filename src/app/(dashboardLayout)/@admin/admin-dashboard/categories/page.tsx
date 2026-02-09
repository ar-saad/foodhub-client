"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getCategories } from "@/actions/category.actions";
import { Category } from "@/types/category.type";
import { PaginationControlsProps } from "@/types/pagination.type";
import { Input } from "@/components/ui/input";
import PaginationControls from "@/components/ui/pagination-controls";
import CategoryListBlock from "@/components/modules/adminDashboard/category/CategoryListBlock";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CategoryListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<PaginationControlsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const searchParamValue = searchParams.get("search") || "";

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

  // Sync search input from URL
  useEffect(() => {
    setSearchQuery(searchParamValue);
  }, [searchParamValue]);

  // Debounced search — resets to page 1 on new search
  useEffect(() => {
    if (searchQuery === searchParamValue) return;

    const timer = setTimeout(() => {
      updateURL({ search: searchQuery, page: "" });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, searchParamValue, updateURL]);

  // Fetch categories whenever URL params change
  useEffect(() => {
    async function loadCategories() {
      setLoading(true);

      try {
        const result = await getCategories({
          search: searchParams.get("search") || "",
          page: searchParams.get("page") || "1",
          limit: searchParams.get("limit") || "10",
          sortBy: searchParams.get("sortBy") || "name",
          sortOrder: searchParams.get("sortOrder") || "asc",
        });

        if (result.error) {
          setCategories([]);
          setMeta(null);
        } else {
          setCategories(result.data?.data?.data ?? []);
          setMeta(result.data?.data?.meta ?? null);
        }
      } catch {
        setCategories([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, [searchParams]);

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-primary">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your food categories
          </p>
        </div>
        <Link href="/admin-dashboard/categories/create">
          <Button size="lg" className="gap-2">
            <Plus className="size-4" />
            Add New Category
          </Button>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <CategoryListBlock categories={categories} meta={meta} />
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && <PaginationControls meta={meta} />}
    </div>
  );
}
