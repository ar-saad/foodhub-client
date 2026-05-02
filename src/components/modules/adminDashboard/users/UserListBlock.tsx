"use client";

import { User } from "@/types/user.type";
import { PaginationControlsProps } from "@/types/pagination.type";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/shared/table/DataTable";

interface UserListBlockProps {
  users: User[];
  meta: PaginationControlsProps | null;
  isLoading?: boolean;
  search?: any;
  pagination?: any;
  sorting?: any;
  filters?: any;
}

export default function UserListBlock({
  users,
  meta,
  isLoading,
  search,
  pagination,
  sorting,
  filters,
}: UserListBlockProps) {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => row.original.phone || "—",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "ACTIVE" ? "default" : "destructive"}
        >
          {row.original.status}
        </Badge>
      ),
    },
  ];

  const actions = {
    onView: (data: User) => {
      window.location.href = `/admin-dashboard/users/${data.id}`;
    },
  };

  return (
    <DataTable
      data={users}
      columns={columns}
      actions={actions}
      meta={meta ?? undefined}
      isLoading={isLoading}
      search={search}
      pagination={pagination}
      sorting={sorting}
      filters={filters}
      emptyMessage="No users found"
    />
  );
}

