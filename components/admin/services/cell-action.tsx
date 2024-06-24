"use client";

/** Packages */

import { deleteService } from "@/actions/services.action";
import { AlertModal } from "@/components/custom ui/alert-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ServiceFormDrawer from "./ServiceFormDrawer";
import { CService } from "./columns";

interface ICellAction {
  data: CService;
}

export const CellAction: React.FC<ICellAction> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onDelete = async (id: string) => {
    startTransition(() => {
      deleteService({ id })
        .then((res) => {
          if (res.error) {
            toast.error(res.message);
          }
          if (!res.error) {
            toast.success(res.message);
          }
        })
        .catch(() => {
          toast.error("Algo salió mal! Inténtalo de nuevo.");
        })
        .finally(() => {
          setOpen(false);
        });
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete(data.id)}
        loading={isPending}
        title={"Eliminar servicio"}
        description={
          "¿Estás seguro que deseas eliminar este servicio? Esta acción no se puede deshacer."
        }
      />
      <div className="w-full flex items-center justify-center gap-2">
        <ServiceFormDrawer initialData={data} />
        <Button
          variant={"destructive"}
          disabled={isPending}
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
