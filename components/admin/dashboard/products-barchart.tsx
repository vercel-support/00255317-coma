"use client";
import { getBestSellingProducts } from "@/data/products.data";
import { CalendarSearch } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface itemChart {
  name: string;
  quantity: number;
}
interface props {
  data: itemChart[];
}

export const ProductsSoldChart = ({ data }: props) => {
  const [dataState, setDataState] = useState(data);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleDateChange = (date: Date, isStart: boolean) => {
    isStart ? setStartDate(date) : setEndDate(date);
  };

  useEffect(() => {
    handleGetTotal();
  }, []);

  const handleGetTotal = async () => {
    setLoading(true);
    const dateRange = { startDate, endDate };
    const responseBestSellings = await getBestSellingProducts(dateRange);
    if (responseBestSellings) {
      setDataState(responseBestSellings!);
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

  return (
    <Card className="w-full  sm:px-6 lg:px-8 p-10">
      <div className="w-full flex flex-col items-center justify-end mb-4 gap-y-2 md:flex-row">
        <h2 className="text-xl font-bold text-primary">Más vendidos</h2>

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
                    <Label htmlFor="width">Inicio:</Label>
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
                  <button
                    className="bg-branding hover:bg-brandingThird text-white font-bold py-2 px-4 rounded"
                    onClick={handleGetTotal}
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
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={500}
          height={400}
          data={dataState}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <YAxis />
          <XAxis dataKey="name" />
          <CartesianGrid strokeDasharray="3 3" />
          <Legend />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="quantity" fill="#3B82F6" type="monotone" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-secondary flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{label}</p>
        <p className="text-sm text-blue-400">
          Cantidad vendida:
          <span className="ml-2">{payload[0].value}</span>
        </p>
      </div>
    );
  }
};
