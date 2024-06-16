'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Billboard, Category } from '@/types';
import { CellAction } from './cell-action';

export type PropertyColumn = {
  id: string;
  values: [{ name: string; value: string }];
  label: string;
  createdAt: string;
  value: string;
  name: string;
};

export const columns: ColumnDef<PropertyColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => row.original.value,
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
