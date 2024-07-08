"use client";

import {
  DataTable,
  LoaderDataTable,
} from "@/components/custom ui/dataTable/DataTable";
import { FlexContainer } from "@/components/custom ui/flex-container";
import { Skeleton } from "@/components/ui/skeleton";
import { TAppointment } from "@/schemas";
import AppointmentGestionHeader from "./AppointmentGestionHeader";
import { columns } from "./columns";
import { StatusAppointment } from "@prisma/client";
interface Props {
  appointments: TAppointment[];
  loading: boolean;
}
export interface filters {
  key: string;
  options: any[];
  title: string;
}
export const AppointmentsClient = ({ appointments, loading }: Props) => {
  console.log("[APPOINTMENT CLIENT] -> ", appointments);

  const statusFormat = [
    {
      label: StatusAppointment.CANCELED,
      value: StatusAppointment.CANCELED,
    },
    {
      label: StatusAppointment.COMPLETED,
      value: StatusAppointment.COMPLETED,
    },
    {
      label: StatusAppointment.CONFIRMED,
      value: StatusAppointment.CONFIRMED,
    },
    {
      label: StatusAppointment.PAID,
      value: StatusAppointment.PAID,
    },
    {
      label: StatusAppointment.PENDING,
      value: StatusAppointment.PENDING,
    },
  ];
  const filters: filters[] = [
    {
      key: "status",
      options: statusFormat,
      title: "Estado",
    },
  ];
  return (
    <>
      {loading ? (
        <LoaderCategoryClient />
      ) : (
        <FlexContainer className="gap-8 P-4">
          <AppointmentGestionHeader
            appointments={appointments}
            loading={loading}
          />
          {loading ? (
            <LoaderDataTable />
          ) : (
            <DataTable
              columns={columns}
              data={appointments}
              searchKey={"id"}
              filters={filters}
            />
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
