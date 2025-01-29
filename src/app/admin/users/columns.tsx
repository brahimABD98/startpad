"use client";
import type { SelectUser } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<SelectUser>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email address",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];
