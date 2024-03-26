'use server'

import { PrivateRoute } from "@/lib/routes";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/interfaces";
import { NewSupplierSchema, SupplierSchema, TNewSupplier, TSupplier } from "@/schemas";
import { revalidatePath } from "next/cache";
import { CustomError } from "@/lib/custom-error.class";
import { CashFlowType, DeliveryStatus, StatusPayment, TransactionType, UserRole } from "@prisma/client";
import { ZodError } from "zod";
import { authorizeRoles } from "./user.action";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { cashReserverUpdate } from "./settings.action";


export const createSupplier = async (data: TNewSupplier): Promise<ResServer<TSupplier | null>> => {
    try {
        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado.", 401);

        NewSupplierSchema.parse(data);

        const supplierExist = await db.supplier.findFirst({
            where: {
                name: data.name,
            },

        });
        if (supplierExist) throw new CustomError("Ya existe un proveedor con este nombre", 400);

        const supplier = await db.supplier.create({
            data
        });

        revalidatePath(PrivateRoute.SUPPLIERS.path);

        return {
            error: false,
            message: "Proveedor creado correctamente",
            code: 201,
            data: supplier as TSupplier,
        };
    } catch (error) {
        console.log("[CREATE_SUPPLIER]", error);
        if (error instanceof ZodError) {
            return {
                error: true,
                code: 400,
                message: error.issues.map((issue) => issue.message).join("\n \n"),
            };
        }
        if (error instanceof CustomError) {
            return {
                error: true,
                code: 400,
                message: error.message,
            };
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return { message: "Error en base de datos durante la creación del proveedor", error: true, code: 500 };
        }
        return {
            error: true,
            message: "Error al crear el proveedor",
            code: 500,
            data: null,
        };
    }
}

interface PropsSupplierUpdateI {
    values: TSupplier;
    path: string;
}
export async function updateSupplier(
    props: PropsSupplierUpdateI
): Promise<ResServer<TSupplier>> {
    try {
        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado.", 401);

        const { values, path } = props;
        SupplierSchema.parse(values);

        const { id, products, ...updateData } = values;

        const supplierId = id.toString();
        const update = {
            name: values.name,
            email: values.email,
            phone: values.phone,
            address: values.address,
            description: values.description,
            saleTransactionsId: values.transactionsId,
        }

        const existingNameSupplier = await db.supplier.findFirst({
            where: {
                name: values.name,
            },
        });
        if (existingNameSupplier && existingNameSupplier.id !== supplierId) {
            throw new CustomError("Ya existe un proveedor con este nombre", 400);
        }

        const supplier = await db.supplier.findUnique({
            where: {
                id: supplierId,
            },
        });

        if (!supplier) throw new Error("Proveedor no encontrado");


        // Actualiza la categoría en la base de datos.
        await db.supplier.update({
            where: {
                id: supplierId,
            },
            data: update,
        });

        revalidatePath(path);


        return {
            error: false,
            message: "Proveedor actualizado correctamente",
            code: 200,
        };
    } catch (error) {
        console.log("[UPDATE_SUPPLIER]", error);
        if (error instanceof ZodError) {
            return {
                error: true,
                code: 400,
                message: error.issues.map((issue) => issue.message).join("\n \n"),
            };
        }
        if (error instanceof CustomError) {
            return {
                error: true,
                code: 401,
                message: error.message,
            };
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return { message: "Error en base de datos durante la actualización del proveedor", error: true, code: 500 };
        }
        return {
            error: true,
            message: "Error al actualizar el proveedor",
            code: 500,
        };
    }
}


export async function deleteSupplier(id: string): Promise<ResServer> {

    try {
        if (!id) throw new CustomError("No se ha proporcionado un id", 400);
        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado.", 401);

        const supplier = await db.supplier.findUnique({
            where: {
                id,
            },
            include: {
                products: true,
            },
        });
        if (!supplier) throw new CustomError("Proveedor no encontrado", 404);
        if (supplier.products.length > 0) {
            return {
                error: true,
                message: "No se puede eliminar el proveedor porque tiene productos asociados",
                code: 400,
            };
        }
        await db.supplier.delete({
            where: {
                id,
            },
        });
        revalidatePath(PrivateRoute.SUPPLIERS.path);

        return {
            error: false,
            message: "Proveedor eliminado correctamente",
            code: 200,
        };
    } catch (error) {
        console.log("[DELETE_SUPPLIER]", error);

        if (error instanceof CustomError) {
            return {
                error: true,
                code: 401,
                message: error.message,
            };
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return { message: "Error en base de datos durante la eliminación del proveedor", error: true, code: 500 };
        }
        return {
            error: true,
            message: "Error al eliminar el proveedor",
            code: 500,
        };
    }
}

export interface UpdatePaymentStatus {
    transactionId: string;
    statusPayment: StatusPayment;
}
export async function updatePaymentStatus(values: UpdatePaymentStatus): Promise<ResServer> {
    try {
        // Verificar autorización
        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado.", 401);

        // Extraer propiedades de los argumentos
        const { transactionId, statusPayment } = values;

        if (!transactionId || !statusPayment) throw new CustomError("No se han proporcionado los datos necesarios.", 400);

        // Buscar la transacción en la base de datos
        const transaction = await db.transaction.findUnique({
            where: { id: transactionId },
        });

        // Verificar si la transacción existe
        if (!transaction) throw new CustomError("Transacción no encontrada.", 404);
        const previousStatus = transaction.statusPayment;

        // Actualizar el estado de pago de la transacción
        const updatedTransaction = await db.transaction.update({
            where: { id: transactionId },
            data: { statusPayment },
        });
        // Si el estado de pago es "CANCELADO", se registra el flujo de efectivo
        if (previousStatus === StatusPayment.PAID && statusPayment === StatusPayment.CANCELED) {
            const cashFlow = await db.cashFlow.update({
                where: { id: updatedTransaction.cashFlowId! },
                data: {
                    amount: updatedTransaction.totalAmount,
                    description: `Devolución de dinero por la compra de productos: ${updatedTransaction.productsId.length} unidades`,
                    type: CashFlowType.OTHER,
                    transactionId: updatedTransaction.id,
                }
            });
            const transactionUpdateCanceled = await db.transaction.update({
                where: { id: updatedTransaction.id },
                data: { cashFlowId: cashFlow.id, transactionType: TransactionType.SALE }
            });
            const check = await cashReserverUpdate({
                value: transactionUpdateCanceled.totalAmount,
                type: transactionUpdateCanceled.transactionType
            })
        }
        // Si el estado de pago es "PAGADO", se registra el flujo de efectivo
        if (statusPayment === StatusPayment.PAID) {
            const cashFlow = await db.cashFlow.create({
                data: {
                    amount: updatedTransaction.totalAmount,
                    description: `Compra de productos: ${updatedTransaction.productsId.length} unidades`,
                    type: CashFlowType.PURCHASE,
                    transactionId: updatedTransaction.id,
                }
            });
            await db.transaction.update({
                where: { id: updatedTransaction.id },
                data: { cashFlowId: cashFlow.id }
            });
            const check = await cashReserverUpdate({
                value: updatedTransaction.totalAmount,
                type: updatedTransaction.transactionType
            })
        }

        revalidatePath(PrivateRoute.SUPPLIERS.path);
        revalidatePath(PrivateRoute.TPV.path);
        revalidatePath(PrivateRoute.PRODUCTS.path);
        return { error: false, code: 200, message: "El estado de pago ha sido actualizado correctamente." };
    } catch (error) {
        console.error("[UPDATE_PAYMENT_STATUS]", error);
        if (error instanceof CustomError) {
            return { error: true, code: error.code, message: error.message };
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return { error: true, code: 500, message: "Error en base de datos durante la actualización del estado de pago." };
        }
        return { error: true, code: 500, message: "Error al actualizar el estado de pago." };
    }
}

export interface UpdateDeliveryStatus {
    transactionId: string;
    deliveryStatus: DeliveryStatus;
}
export async function updateDeliveryStatus(values: UpdateDeliveryStatus): Promise<ResServer> {
    try {

        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado.", 401);

        const { transactionId, deliveryStatus } = values;
        if (!transactionId || !deliveryStatus) throw new CustomError("No se han proporcionado los datos necesarios.", 400);

        const transaction = await db.transaction.findUnique({
            where: { id: transactionId },
            include: { products: true, productSaleTransaction: true },
        });


        if (!transaction) throw new CustomError("Transacción no encontrada.", 404);
        const previousStatus = transaction.deliveryStatus;
        if (previousStatus === DeliveryStatus.DELIVERED && deliveryStatus === DeliveryStatus.CANCELED) {
            for (const product of transaction.productSaleTransaction) {
                await db.product.update({
                    where: { id: product.productId },
                    data: {
                        stock: {
                            decrement: product.quantity // Decrementa el stock
                        }
                    }
                });
            }
        }

        await db.transaction.update({
            where: { id: transactionId },
            data: { deliveryStatus },
        });


        if (deliveryStatus === DeliveryStatus.DELIVERED) {
            for (const product of transaction.productSaleTransaction) {

                const res = await db.product.update({
                    where: { id: product.productId },
                    data: {
                        stock: {
                            increment: product.quantity
                        }
                    }

                });
            }
        }

        revalidatePath(PrivateRoute.SUPPLIERS.path);
        revalidatePath(PrivateRoute.TPV.path);
        revalidatePath(PrivateRoute.PRODUCTS.path);

        return { error: false, code: 200, message: 'El estado de entrega ha sido actualizado correctamente.' };
    } catch (error) {
        console.error("[UPDATE_DELIVERY_STATUS]", error);
        if (error instanceof CustomError) {
            return { error: true, code: error.code, message: error.message };
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return { error: true, code: 500, message: "Error en base de datos durante la actualización del estado de entrega." };
        }
        return { error: true, code: 500, message: "Error al actualizar el estado de entrega." };

    }
}