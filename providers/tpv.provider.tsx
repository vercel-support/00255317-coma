"use client";
import { checkAndCreateRecurrentExpenses } from "@/actions/expense.action";
import { Loader } from "@/components/loader";
import { getCashReconsiliation } from "@/data/cash-reconsiliation.data";
import useCashReconsiliationStore from "@/hooks/use-cash-reconsiliation-day";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const TpvProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const setCashReconsiliation = useCashReconsiliationStore(
    (state) => state.setCashReconsiliation
  );
  const user = useCurrentUser();
  useEffect(() => {
    console.log("[TPV_PROVIDER] -> ", "fecth -> checkRecurrentExpenses");
    const fetch = async () => {
      try {
        await checkAndCreateRecurrentExpenses(user?.employeeId!);
      } catch (error) {
        console.log("Error al crear y verificar gastos recurrentes");
        return;
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    console.log("[TPV_PROVIDER] -> ", "fetchData -> getCashReconsiliation");
    setLoading(true);
    const fetchData = async () => {
      try {
        // Verificar la sesión de caja abierta para el día actual
        const currentDate = new Date();
        const reconciliationResponse = await getCashReconsiliation(currentDate);

        // Si hay una sesión de caja abierta, actualiza el estado global
        if (!reconciliationResponse.error && reconciliationResponse.data) {
          setCashReconsiliation(reconciliationResponse.data);
        } else {
          // Manejo cuando no hay caja abierta
          toast.error(
            "No se ha encontrado una sesión de caja abierta para el día actual. Por favor, abra una sesión de caja."
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error al obtener datos de caja");
        return;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setCashReconsiliation]);
  if (loading) {
    return <Loader />;
  }
  return <div>{children}</div>;
};

export default TpvProvider;
