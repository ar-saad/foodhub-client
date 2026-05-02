"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getUsers } from "@/actions/user.actions";
import { User } from "@/types/user.type";
import { PaginationControlsProps } from "@/types/pagination.type";
import UserListBlock from "@/components/modules/adminDashboard/users/UserListBlock";
import { SortingState, PaginationState } from "@tanstack/react-table";

export default function AdminDashboardUserListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationControlsProps | null>(null);
  const [loading, setLoading] = useState(true);

  // Derive state from URL
  const currentPage = Number(searchParams.get("page") || "1");
  const currentLimit = Number(searchParams.get("limit") || "10");
  const currentSortBy = searchParams.get("sortBy") || "name";
  const currentSortOrder = searchParams.get("sortOrder") || "asc";
  const currentSearch = searchParams.get("search") || "";

  // Stable ref for searchParams to avoid callback identity churn
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  // Update URL with new parameters (stable — does not depend on searchParams)
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

  // Tanstack sorting state derived from URL
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

  // Tanstack pagination state derived from URL
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

  // Search handler
  const onSearchChange = useCallback(
    (value: string) => {
      updateURL({ search: value, page: "" });
    },
    [updateURL],
  );

  // Fetch users whenever URL params change
  useEffect(() => {
    async function loadUsers() {
      setLoading(true);

      try {
        const result = await getUsers({
          search: currentSearch,
          page: String(currentPage),
          limit: String(currentLimit),
          sortBy: currentSortBy,
          sortOrder: currentSortOrder,
        });

        if (result.error) {
          setUsers([]);
          setMeta(null);
        } else {
          setUsers(result.data?.data?.data ?? []);
          setMeta(result.data?.data?.meta ?? null);
        }
      } catch {
        setUsers([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [searchParams]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">User List</h1>

      <UserListBlock
        users={users}
        meta={meta}
        isLoading={loading}
        search={{
          initialValue: currentSearch,
          placeholder: "Search by name or phone...",
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
      />
    </div>
  );
}
