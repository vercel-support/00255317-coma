"use client";

import {
  DataTable,
  LoaderDataTable,
} from "@/components/custom ui/dataTable/DataTable";
import { FlexContainer } from "@/components/custom ui/flex-container";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceFormDrawer from "./ServiceFormDrawer";
import ServiceGestionHeader from "./ServiceGestionHeader";
import { columns } from "./columns";
import { TService } from "@/schemas";
interface Props {
  services: TService[];
  loading: boolean;
}
export const ServicesClient = ({ services, loading }: Props) => {
  return (
    <>
      {loading ? (
        <LoaderCategoryClient />
      ) : (
        <FlexContainer className="gap-8 P-4">
          <ServiceGestionHeader services={services} loading={loading} />
          <div className="w-full flex gap-2 items-center justify-end">
            <ServiceFormDrawer />
          </div>

          {loading ? (
            <LoaderDataTable />
          ) : (
            <DataTable columns={columns} data={services} searchKey={"name"} />
          )}
        </FlexContainer>
      )}
    </>
  );
};
export const LoaderCategoryClient = () => {
  return (
    <div className="w-full h-full space-y-2">
      <Skeleton className="h-[150px] w-full rounded-lg" />
      <Skeleton className="h-10 w-full mt-4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-[320px] w-full" />
    </div>
  );
};
