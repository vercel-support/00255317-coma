"use client";

import { ColumnDef } from "@tanstack/react-table";
import * as z from "zod";
import { CellAction } from "./cell-action";
import Link from "next/link";
import { PrivateRoute } from "@/lib/routes";
import { ServiceSchema } from "@/schemas";
import { DataTableColumnHeader } from "@/components/custom ui/dataTable/data-table-column-header";

export const serviceColumnSchema = ServiceSchema;

export type CService = z.infer<typeof serviceColumnSchema>;

export const columns: ColumnDef<CService>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => row.original.name,

    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => row.original.description,
    enableSorting: false,
    enableHiding: true,
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
