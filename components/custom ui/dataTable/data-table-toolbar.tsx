"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { XCircle } from "lucide-react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

export interface filters {
  key: string;
  options: any[];
  title: string;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey: string;
  filters?: filters[];
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  filters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="w-full flex max-md:flex-col items-center justify-between space-y-4">
      <div className="w-full flex max-md:flex-col flex-1 items-center space-x-2 gap-y-4">
        <Input
          placeholder="Buscar ..."
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="h-8 w-full md:w-[150px] lg:w-[250px]"
        />
        {filters && filters.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-2">
            {filters?.map((filter) => (
              <DataTableFacetedFilter
                key={filter.key}
                column={table.getColumn(filter.key)}
                title={filter.title}
                options={filter.options}
              />
            ))}
            {isFiltered && (
              <Button
                variant="outline"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 lg:px-3"
              >
                Resetear
                <XCircle className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
