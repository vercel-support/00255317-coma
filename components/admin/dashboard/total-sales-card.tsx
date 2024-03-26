"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TotalSalesCard = ({
  initialData,
  previous = null,
  classname,
}: {
  initialData: number;
  previous?: number | null;
  classname?: string;
}) => {
  const [percentageChange, setPercentageChange] = useState<number | null>(null);

  useEffect(() => {
    if (initialData !== null && previous !== null) {
      const change = ((initialData - previous!) / previous!) * 100;
      setPercentageChange(change);
    }
  }, [initialData, previous]);
  return (
    <Card
      className={cn(
        "flex flex-col items-center p-4 rounded-lg shadow-lg",
        classname ? classname : ""
      )}
    >
      <h2 className="text-lg font-semibold mb-2 ">Total Ventas</h2>
      <Separator />

      <div className="flex flex-col h-full items-center justify-center">
        <h1>
          <p className="text-2xl font-bold">
            {initialData !== null && initialData}
          </p>
        </h1>
        {previous !== null && percentageChange !== null && (
          <p
            className={cn(
              "font-light text-sm",
              percentageChange >= 0 ? "text-emerald-500" : "text-red-500"
            )}
          >
            {isNaN(percentageChange) ? 0 : percentageChange.toFixed(2)}%
            {/* {percentageChange >= 0 ? "+" : ""} {percentageChange.toFixed(2)}% */}
          </p>
        )}{" "}
      </div>
    </Card>
  );
};

export default TotalSalesCard;
