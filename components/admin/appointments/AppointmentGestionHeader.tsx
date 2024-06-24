"use client";

import HeaderAdminBox, {
  LoaderHeaderAdminBox,
} from "@/components/custom ui/HeaderAdminBox";
import { TAppointment } from "@/schemas";

import { ShoppingBasket, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

const AppointmentGestionHeader = ({
  appointments,
  loading,
}: {
  appointments: TAppointment[];
  loading: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(loading ?? true);
  const [appointmentsUpdated, setAppointmentsUpdated] =
    useState<TAppointment[]>(appointments);
  useEffect(() => {
    const fectch = async () => {
      try {
        setIsLoading(true);
        setAppointmentsUpdated(appointments);
      } catch (error) {
        console.log("[APPOINTMENT GESTION HEADER] -> ", [error]);
      } finally {
        setIsLoading(false);
      }
    };
    fectch();
  }, [appointments]);

  return (
    <>
      {isLoading ? (
        <LoaderHeaderAdminBox />
      ) : (
        <HeaderAdminBox
          icon={<FaRegCalendarAlt className="text-white h-20 w-20" />}
          title={"citas"}
          titleBigDetail={appointmentsUpdated.length ?? 0}
          titleBoxLeft={""}
          contentBoxLeft={undefined}
          titleBoxRight={""}
          contentBoxRight={undefined}
        />
      )}
    </>
  );
};

export default AppointmentGestionHeader;
