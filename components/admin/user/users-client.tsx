"use client";
import { Separator } from "@/components/ui/separator";
import { TEmployee, TUser } from "@/schemas";
import { columns } from "./columns";
import { FlexContainer } from "@/components/custom ui/flex-container";
import { SubHeading } from "@/components/custom ui/sub-heading";
import { DataTable } from "@/components/custom ui/dataTable/DataTable";

export const UsersClient = ({ data }: { data: TUser[] }) => {
  return (
    <div className="bg-secondary rounded-lg shadow-md p-6">
      <DataTable columns={columns} data={data as TUser[]} searchKey={"name"} />
    </div>
  );
};
