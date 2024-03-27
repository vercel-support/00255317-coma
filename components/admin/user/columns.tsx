"use client";

import { EmployeeSchema, UserSchema } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import * as z from "zod";
import { CellAction } from "./cell-action";
import { SelectRole } from "./select-role";
import { SwitchPermission } from "./switch-permission";

export const employeeColumnSchema = UserSchema;
export type CUserSchema = z.infer<typeof employeeColumnSchema>;

export const columns: ColumnDef<CUserSchema>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => (
      <SelectRole userId={row.original.id!} role={row.original.role!} />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "permission",
    header: "Permiso",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-x-1">
        <SwitchPermission
          userId={row.original.id!}
          permission={row.original.permission}
        />
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
