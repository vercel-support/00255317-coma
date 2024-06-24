"use client";

import { ColumnDef } from "@tanstack/react-table";
import * as z from "zod";
import { CellAction } from "./cell-action";
import Link from "next/link";
import { PrivateRoute } from "@/lib/routes";
import { AppointmentSchema, ServiceSchema } from "@/schemas";
import { DataTableColumnHeader } from "@/components/custom ui/dataTable/data-table-column-header";

export const appointmentColumnSchema = AppointmentSchema;

export type CAppointment = z.infer<typeof appointmentColumnSchema>;

export const columns: ColumnDef<CAppointment>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => row.original.id.slice(row.original.id.length - 6),

    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "bookingDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    cell: ({ row }) =>
      row.original.bookingDate.toLocaleString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),

    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => row.original.status,

    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "service",
    header: "Descripción",
    cell: ({ row }) => row.original.service?.name,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paciente" />
    ),
    cell: ({ row }) => row.original.user?.name,

    enableSorting: true,
    enableHiding: false,
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
