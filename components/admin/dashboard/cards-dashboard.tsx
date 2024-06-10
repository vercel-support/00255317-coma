"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  getDailyCashFlow,
  getProfitPercentage,
  getTotalRevenue,
  getTotalSales,
} from "@/data/sales.data";
import { CalendarSearch } from "lucide-react";
import { useEffect, useState } from "react";
import DailyCashFlowCard from "./daily-cash-flow-card";
import ProfitPorcentageCard from "./profit-porcentage-card";
import RevenueCard from "./revenue-card";
import TotalSalesCard from "./total-sales-card";

interface CardsDashboardProps {
  totalRevenue: number | undefined;
  totalSales: number | undefined;
  totalCost: number | undefined;
  cashFlow: number | undefined;
}
export const CardsDashboard = ({
  totalRevenue,
  totalSales,
  totalCost,
  cashFlow,
}: CardsDashboardProps) => {
  const [totalRevenueState, setTotalRevenueState] = useState(totalRevenue ?? 0);
  const [totalSalesState, setTotalSalesState] = useState(totalSales ?? 0);
  const [totalCostState, setTotalCostState] = useState(totalCost ?? 0);
  const [cashFlowState, setCashFlowState] = useState(cashFlow ?? 0);

  const [previousTotalRevenue, setPreviousTotalRevenue] = useState<
    number | null
  >(null);
  const [previousTotalSale, setPreviousTotalSale] = useState<number | null>(
    null
  );
  const [previousTotalCost, setPreviousTotalCost] = useState<number | null>(
    null
  );
  const [previousTotalCashFlow, setPreviousTotalCashFlow] = useState<
    number | null
  >(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activateComparation, setActivateComparation] =
    useState<boolean>(false);
  const [startDatePrevious, setStartDatePrevious] = useState<Date>(new Date());
  const [endDatePrevious, setEndDatePrevious] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (activateComparation) {
      handleGetPreviousTotal();
    } else {
      setPreviousTotalRevenue(null);
      setPreviousTotalSale(null);
      setPreviousTotalCost(null);
      setPreviousTotalCashFlow(null);
    }
  }, [activateComparation]);

  useEffect(() => {
    handleGetTotal();
    handleGetPreviousTotal();
    setActivateComparation(false);
    setPreviousTotalCashFlow(null);
    setPreviousTotalCost(null);
    setPreviousTotalRevenue(null);
    setPreviousTotalSale(null);
  }, []);

  const handleDateChange = (date: Date, isStart: boolean) => {
    isStart ? setStartDate(date) : setEndDate(date);
  };
  const handlePreviousDateChange = (date: Date, isStart: boolean) => {
    isStart ? setStartDatePrevious(date) : setEndDatePrevious(date);
  };

  const handleGet = async () => {
    setLoading(true);
    await handleGetTotal();
    if (activateComparation) {
      await handleGetPreviousTotal();
    }
    setLoading(false);
  };

  const handleGetTotal = async () => {
    setLoading(true);
    const dateRange = { startDate, endDate };
    const responseRevenue = await getTotalRevenue(dateRange);
    if (!responseRevenue.error) {
      setTotalRevenueState(responseRevenue?.data!);
    }
    const responseSales = await getTotalSales(dateRange);
    if (!responseSales.error) {
      setTotalSalesState(responseSales?.data!);
    }
    const responseCost = await getProfitPercentage(dateRange);
    if (!responseCost.error) {
      setTotalCostState(responseCost?.data!);
    }
    const responseCashFlow = await getDailyCashFlow(dateRange);
    if (!responseCashFlow.error) {
      setCashFlowState(responseCashFlow?.data!);
    }
    setLoading(false);
    setPopoverOpen(false);
  };

  const handleGetToday = async () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
    await handleGetTotal();
  };

  const handleGetPreviousTotal = async () => {
    if (activateComparation === false) {
      return;
    }

    const dateRange = {
      startDate: startDatePrevious,
      endDate: endDatePrevious,
    };

    const responseRevenue = await getTotalRevenue(dateRange);
    if (!responseRevenue.error) {
      setPreviousTotalRevenue(responseRevenue?.data!);
    }
    const responseSales = await getTotalSales(dateRange);
    if (!responseSales.error) {
      setPreviousTotalSale(responseSales?.data!);
    }
    const responseCost = await getProfitPercentage(dateRange);
    if (!responseCost.error) {
      setPreviousTotalCost(responseCost?.data!);
    }
    const responseCashFlow = await getDailyCashFlow(dateRange);
    if (!responseCashFlow.error) {
      setPreviousTotalCashFlow(responseCashFlow?.data!);
    }
  };

  return (
    <div className="w-full ">
      <div className="w-full flex items-center justify-end mb-4">
        <div className="w-full flex items-center justify-end gap-x-3">
          <h2
            className="bg-branding text-white rounded-md p-2 hover:bg-brandingThird cursor-pointer"
            onClick={handleGetToday}
          >
            Hoy
          </h2>
          <Popover
            open={popoverOpen}
            onOpenChange={() => setPopoverOpen(!popoverOpen)}
          >
            <PopoverTrigger asChild>
              <Button size={"icon"} variant="ghost">
                <CalendarSearch className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Cambiar fecha</h4>
                  <p className="text-sm text-muted-foreground">
                    Selecciona el rango de fechas para obtener los datos
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="width">Inicio: </Label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate.toISOString().split("T")[0]}
                      onChange={(e) =>
                        handleDateChange(new Date(e.target.value), true)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxWidth">Fin:</Label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate.toISOString().split("T")[0]}
                      onChange={(e) =>
                        handleDateChange(new Date(e.target.value), false)
                      }
                    />
                  </div>
                  <Separator className="my-4" />
                  <div className="w-full flex items-center justify-start gap-x-4">
                    <p>Activar comparación</p>
                    <Switch
                      checked={activateComparation}
                      onCheckedChange={() =>
                        setActivateComparation(!activateComparation)
                      }
                    />
                  </div>
                  {activateComparation && (
                    <>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="width">Inicio:</Label>
                        <input
                          type="date"
                          id="startDatePrevious"
                          value={startDatePrevious.toISOString().split("T")[0]}
                          onChange={(e) =>
                            handlePreviousDateChange(
                              new Date(e.target.value),
                              true
                            )
                          }
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="maxWidth">Fin:</Label>
                        <input
                          type="date"
                          id="endDatePrevious"
                          value={endDatePrevious.toISOString().split("T")[0]}
                          onChange={(e) =>
                            handlePreviousDateChange(
                              new Date(e.target.value),
                              false
                            )
                          }
                        />
                      </div>
                    </>
                  )}
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleGet}
                    disabled={loading}
                  >
                    {loading ? "Cargando..." : "Obtener datos"}
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <RevenueCard
          initialData={totalRevenueState}
          previous={previousTotalRevenue}
        />
        <TotalSalesCard
          initialData={totalSalesState}
          previous={previousTotalSale}
        />
        <ProfitPorcentageCard
          initialData={totalCostState}
          previous={previousTotalCost}
        />
        <DailyCashFlowCard
          initialData={cashFlowState}
          previous={previousTotalCashFlow}
        />
      </div>
    </div>
  );
};
