import { formatCurrency } from "@/lib/utils";
import { TTransaction } from "@/schemas";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { CurrencyType } from "@/lib/interfaces";

export const ItemTransaction = ({
  transaction,
}: {
  transaction: TTransaction;
}) => {
  return (
    <div key={transaction.id} className="w-full my-3 border-2 rounded-md p-4">
      <p className="">
        {transaction.createdAt.toLocaleString("es-ES", {
          dateStyle: "full",
          timeStyle: "short",
        })}
      </p>
      <Separator />
      <p className="mb-3">
        Vendedor:{" "}
        <span className="ml-3 font-bold">
          {transaction.employee?.user.name}
        </span>
      </p>

      <p className="flex flex-col items-start">
        {transaction.productSaleTransaction?.map((product) => (
          <span key={product.id} className="flex items-center gap-x-3">
            SUBTOTAL:{""}
            <span className="ml-3 font-bold">
              {product.quantity} | {product.name}{" "}
              {formatCurrency(product.totalAmount, CurrencyType.PesoArgentino)}
            </span>
          </span>
        ))}
      </p>
      <p>
        TOTAL:{" "}
        <span className="ml-3 font-bold">
          {formatCurrency(transaction.totalAmount, CurrencyType.PesoArgentino)}
        </span>
      </p>
    </div>
  );
};
