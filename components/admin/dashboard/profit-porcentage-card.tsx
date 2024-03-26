"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ProfitPorcentageCard = ({
  initialData,
  classname,
  previous,
}: {
  initialData: number;
  previous?: number | null;
  classname?: string;
}) => {
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  useEffect(() => {
    if (previous === null) {
      setPercentageChange(null);
    } else {
      const change = ((initialData - previous!) / previous!) * 100;
      setPercentageChange(change);
    }
  }, [previous]);
  return (
    <Card
      className={cn(
        "flex flex-col items-center p-4 rounded-lg shadow-lg",
        classname ? classname : ""
      )}
    >
      <h2 className="text-lg font-semibold mb-2">Beneficio</h2>
      <Separator />

      <div className="flex flex-col h-full items-center justify-center">
        <h1>
          <p
            className={cn(
              "font-bold text-2xl ",
              !initialData || initialData >= 0
                ? "text-emerald-500"
                : "text-red-500"
            )}
          >
            {isNaN(initialData) ? 0 : initialData.toFixed(2)}%
            {/* {profitPorcentage !== null ? profitPorcentage : initialData} % */}
          </p>
        </h1>
        {previous !== null && percentageChange !== null && (
          <p
            className={cn(
              "font-light text-sm",
              percentageChange >= 0 ? "text-emerald-500" : "text-red-500"
            )}
          >
            {percentageChange >= 0 ? "+" : ""} {percentageChange.toFixed(2)}%
          </p>
        )}
      </div>
    </Card>
  );
};

export default ProfitPorcentageCard;
