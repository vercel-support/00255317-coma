"use client";
import { formatCurrency } from "@/lib/utils";
import { TTransaction } from "@/schemas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HandCoins } from "lucide-react";
import { PaymentMethod } from "@prisma/client";
import { useTransition } from "react";
import { toast } from "sonner";
import { handlePaidSaleTransaction } from "@/actions/transaction.action";
import { revalidatePath } from "next/cache";
import { PrivateRoute } from "@/lib/routes";
import { CurrencyType } from "@/lib/interfaces";

export const ItemCredit = ({ transaction }: { transaction: TTransaction }) => {
  const [isPending, startTransition] = useTransition();

  const handlePay = async (
    transaction: TTransaction,
    paymentMethod: PaymentMethod
  ) => {
    startTransition(() => {
      handlePaidSaleTransaction(transaction.id, paymentMethod)
        .then((data) => {
          if (data.error) {
            toast.error(data.message);
          }
          if (!data.error) {
            toast.success(data.message);
            revalidatePath(PrivateRoute.PROFILE.href);
          }
        })
        .catch(() => {
          toast.error("Algo salió mal! Inténtalo de nuevo.");
        });
    });
  };
  return (
    <div className="w-full flex justify-between items-center mb-4 flex-wrap gap-3">
      <div className="flex items-center">
        <div className="ml-4">
          <p className=" font-bold">{transaction.creditSale?.name}</p>
          <p className="text-xs">{transaction.creditSale?.description}</p>
        </div>
      </div>
      <p className=" font-bold text-xl">
        {formatCurrency(transaction.totalAmount, CurrencyType.PesoArgentino)}
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isPending}>
          <Button
            variant="default"
            size="icon"
            className="w-1/2 flex items-center gap-x-3"
          >
            <HandCoins /> Cobrar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background">
          <DropdownMenuItem
            onClick={() => handlePay(transaction, PaymentMethod.CASH_REGISTER)}
            disabled={isPending}
            className="font-bold  p-4 rounded"
          >
            {isPending ? "Procesando..." : "Efectivo"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handlePay(transaction, PaymentMethod.CREDIT_CARD)}
            disabled={isPending}
            className="font-bold  p-4 rounded"
          >
            Tarjeta
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handlePay(transaction, PaymentMethod.MERCADO_PAGO)}
            disabled={isPending}
            className="font-bold  p-4 rounded"
          >
            Mercado Pago
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handlePay(transaction, PaymentMethod.PAY_PAL)}
            disabled={isPending}
            className="font-bold  p-4 rounded"
          >
            PayPal
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
