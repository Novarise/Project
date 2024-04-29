"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { Billboard, Category } from "@/types"

export type CategoryColumn = {
  id: string
  name: string;
  label: string
  billboardId: string,
  createdAt: string;
  billboards: Billboard[];
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.label,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} billboards={row.original.billboards} />
  },
];