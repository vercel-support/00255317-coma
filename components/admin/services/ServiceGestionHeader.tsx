"use client";

import HeaderAdminBox, {
  LoaderHeaderAdminBox,
} from "@/components/custom ui/HeaderAdminBox";
import { TService } from "@/schemas";

import { ShoppingBasket, Tag } from "lucide-react";
import { useEffect, useState } from "react";

const ServiceGestionHeader = ({
  services,
  loading,
}: {
  services: TService[];
  loading: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(loading ?? true);
  const [servicesUpdated, setServicesUpdated] = useState<TService[]>(services);
  useEffect(() => {
    const fectch = async () => {
      try {
        setIsLoading(true);
        setServicesUpdated(services);
      } catch (error) {
        console.log("[SERVICE GESTION HEADER] -> ", [error]);
      } finally {
        setIsLoading(false);
      }
    };
    fectch();
  }, [services]);

  return (
    <>
      {isLoading ? (
        <LoaderHeaderAdminBox />
      ) : (
        <HeaderAdminBox
          icon={<ShoppingBasket className="text-white h-20 w-20" />}
          title={"servicios"}
          titleBigDetail={servicesUpdated.length ?? 0}
          titleBoxLeft={""}
          contentBoxLeft={undefined}
          titleBoxRight={""}
          contentBoxRight={undefined}
        />
      )}
    </>
  );
};

export default ServiceGestionHeader;
