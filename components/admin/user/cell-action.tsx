"use client";
import { DeleteUser } from "@/actions/user.action";
import { AlertModal } from "@/components/custom ui/alert-modal";
import { Button } from "@/components/ui/button";
import { PrivateRoute } from "@/lib/routes";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CUserSchema } from "./columns";

interface ICellAction {
  data: CUserSchema;
}

export const CellAction: React.FC<ICellAction> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onDelete = (id: string) => {
    startTransition(() => {
      DeleteUser(id)
        .then((data) => {
          if (data.error) {
            toast.error(data.message);
          }
          if (!data.error) {
            toast.success(data.message);
            // router.push(PrivateRoute.USERS.href);
            setOpen(false);
          }
        })
        .catch(() => {
          toast.error("Algo salió mal! Inténtalo de nuevo.");
          setOpen(false);
        });
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete(data.id!)}
        loading={isPending}
        title={"Eliminar usuario"}
        description={
          "¿Estás seguro que deseas eliminar este usuario? Esta acción no se puede deshacer."
        }
      />
      <Button
        variant={"destructive"}
        disabled={isPending}
        onClick={() => setOpen(true)}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </>
  );
};
