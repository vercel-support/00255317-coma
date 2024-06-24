"use client";

/** Packages */

import { deleteAppointment } from "@/actions/appoinment";
import { AlertModal } from "@/components/custom ui/alert-modal";
import { Button } from "@/components/ui/button";
import { PrivateRoute } from "@/lib/routes";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CAppointment } from "./columns";

interface ICellAction {
  data: CAppointment;
}

export const CellAction: React.FC<ICellAction> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onDelete = async (id: string) => {
    startTransition(() => {
      deleteAppointment() //{ id }
        .then((res) => {
          // if (res.error) {
          //   toast.error(res.message);
          // }
          // if (!res.error) {
          //   toast.success(res.message);
          // }
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
        title={"Eliminar cita"}
        description={
          "¿Estás seguro que deseas eliminar esta cita? Esta acción no se puede deshacer."
        }
      />
      <div className="w-full flex items-center justify-center gap-2">
        <Button
          variant={"default"}
          disabled={isPending}
          onClick={() =>
            router.push(`${PrivateRoute.APPOINTMENT.href}${data.id}`)
          }
        >
          <Edit className="h-4 w-4" />
        </Button>
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
