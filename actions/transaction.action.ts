'use server'

import { ResServer } from "@/lib/types";
import { NewCreditSaleSchema, NewTransactionSchema, TNewCreditSale, TNewNotification, TNewTransaction, TTransaction } from "@/schemas";
import { CashFlowType, DeliveryStatus, NotificationType, PaymentMethod, StatusPayment, UserRole } from "@prisma/client";
import { authorizeRoles } from "./user.action";
import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { cashReserverUpdate } from "./settings.action";
import { PrivateRoute } from "@/constants/routes.constants";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notification.action";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function handlePaidSaleTransaction(transactionId: string, paymentMethod: PaymentMethod): Promise<ResServer<TTransaction | null>> {
    try {
        if (!transactionId) throw new CustomError("Falta el ID de la transacción", 400);
        if (!paymentMethod) throw new CustomError("Falta el método de pago", 400);

        const authorization = await authorizeRoles([UserRole.ADMIN, UserRole.USER]);
        if (!authorization) throw new CustomError("No autorizado", 401);

        const transaction = await db.transaction.findUnique({
            where: { id: transactionId },
            include: { products: true },
        });

        if (!transaction) throw new CustomError("Transacción no encontrada", 404);
        if (transaction.statusPayment !== StatusPayment.PENDING) throw new CustomError("La transacción ya ha sido pagada", 400);

        const cashReconsiliation = await db.cashReconsiliation.findFirst({ where: { isOpen: true } });
        if (!cashReconsiliation) throw new CustomError("No se encontró una sesión de caja abierta. Debes iniciar el arqueo de caja.", 400);
        // Actualizar el estado del pago a "paid"
        const updatedTransaction = await db.transaction.update({
            where: { id: transactionId },
            data: { statusPayment: StatusPayment.PAID, paymentMethod },
            include: { products: true },
        });

        if (!updatedTransaction) throw new CustomError("Error al actualizar la transacción.", 500);

        // Generar registro de flujo de efectivo si el método de pago es en efectivo
        if (paymentMethod === PaymentMethod.CASH_REGISTER) {
            const cashFlow = await db.cashFlow.create({
                data: {
                    amount: updatedTransaction.totalAmount,
                    type: CashFlowType.SALE,
                    description: `Pago de la venta de productos fiados por un total de $${updatedTransaction.totalAmount}`,
                    createdAt: updatedTransaction.createdAt,
                    transactionId: updatedTransaction.id,
                },
            });
            if (!cashFlow) throw new CustomError("Error al crear el cashFlow con efectivo de caja", 500);

            // Actualizar la conciliación de efectivo con el monto de la transacción
            await db.cashReconsiliation.update({
                where: { id: cashReconsiliation.id },
                data: { amount: { increment: updatedTransaction.totalAmount }, transactions: { connect: { id: updatedTransaction.id } } },
            });
        }
        // Actualizar la reserva de efectivo con el valor de la transacción de venta
        await cashReserverUpdate({
            value: updatedTransaction.totalAmount,
            type: updatedTransaction.transactionType
        })


        return {
            error: false,
            message: "Transacción actualizada correctamente",
            code: 200,
            data: updatedTransaction,
        };
    } catch (error) {
        console.error('[HANDLE_PAID_SALE_TRANSACTION] ', { error });
        if (error instanceof CustomError) {
            return { error: true, code: 400, message: error.message, data: null };
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return { error: true, code: 500, message: "Error en base de datos al actualizar la transacción", data: null };
        }
        return { error: true, code: 500, message: "Error al actualizar la transacción", data: null };
    }
}

export async function createSaleTransaction(data: TNewTransaction, creditSale?: TNewCreditSale): Promise<ResServer<TTransaction | null>> {
    try {
        // Validar los datos de la venta
        NewTransactionSchema.safeParse(data)

        // Validar los datos de la venta a crédito si procede
        if (creditSale) { NewCreditSaleSchema.safeParse(creditSale) }

        // Autorización de roles de usuario
        const authorization = await authorizeRoles([UserRole.ADMIN, UserRole.USER])

        // Verificar si la autorización es válida
        if (!authorization) throw new CustomError("No autorizado", 401)


        // Obtener la fecha de venta sin la hora
        const saleDate = new Date(data.createdAt);
        saleDate.setHours(0, 0, 0, 0);

        // Encontrar la conciliación de efectivo abierta actualmente
        const cashReconsiliation = await db.cashReconsiliation.findFirst({
            where: {
                isOpen: true,
            },
        });
        // Verificar si se encontró la conciliación de efectivo
        if (!cashReconsiliation) throw new CustomError("No se encontró una sesión de caja abierta. Debes iniciar el arqueo de caja.", 400);
        console.warn('[TRANSACTION_ACTION_ANTES DE CREAR VENTA_BACK] -> ', { data });
        // Crear la transacción de venta
        const saleTransaction = await db.transaction.create({
            data: {
                employeeId: data.employeeId,
                productsId: data.productSaleTransaction?.map(product => product.productId),
                transactionType: data.transactionType,
                totalAmount: data.totalAmount,
                createdAt: data.createdAt,
                paymentMethod: data.paymentMethod,
                statusPayment: data.statusPayment,
                deliveryStatus: data.deliveryStatus,
            },
            include: {
                products: true
            }
        })
        // Verificar si se creó la transacción de venta correctamente
        if (!saleTransaction) throw new CustomError("Error al crear la transacción de venta", 400);
        console.warn('[TRANSACTION_ACTION_DESPUES DE CREAR VENTA_BACK] -> ', { saleTransaction });
        // Si el estado de entrega de la venta es 'Entregado'
        if (data.deliveryStatus === DeliveryStatus.DELIVERED) {
            // Iterar sobre los productos vendidos
            for (const { productId, quantity } of data.productSaleTransaction!) {
                // Actualizar la información del producto vendido
                const product = await db.product.update({
                    where: { id: productId },
                    data: {
                        transactionsId: {
                            push: saleTransaction.id
                        },
                        transactions: {
                            connect: { id: saleTransaction.id }, // Conectar la transacción de venta al producto
                        },
                        stock: { decrement: quantity }, // Restar la cantidad vendida del stock
                    },
                });
                // Si el stock del producto es menor o igual a 10, crear una notificación de stock bajo
                if (product.stock <= 10) {
                    // creamos notificacion
                    const data: TNewNotification = {
                        title: "Stock bajo",
                        message: `El producto ${product.name} esta por agotarse, quedan ${product.stock} unidades.`,
                        type: NotificationType.LOW_STOCK_ALERT,
                        read: false,
                        link: `${PrivateRoute.SUPPLIER_ORDER.href}${product.supplierId}`,
                        createdAt: new Date(),
                    }
                    await createNotification(data)
                }
            }
        }

        // Crear registros de los productos vendidos
        for (const productData of data.productSaleTransaction!) {
            const { productId, quantity, price, name } = productData;
            const productSaleTransaction = await db.productSaleTransaction.create({
                data: {
                    productId,
                    name,
                    quantity,
                    price,
                    totalAmount: price * quantity,
                    createdAt: new Date(),
                    transactionId: saleTransaction.id,
                },
            });
            // Conectar el producto vendido con la transacción de venta
            await db.transaction.update({
                where: {
                    id: saleTransaction.id,
                },
                data: {
                    productSaleTransaction: {
                        connect: {
                            id: productSaleTransaction.id,
                        },
                    },
                },
            });
        }
        // Actualizar el registro de empleado con la nueva transacción de venta
        await db.employee.update({
            where: {
                id: data.employeeId
            },
            data: {
                transactionsId: {
                    push: saleTransaction.id
                }
            }

        })
        // Inicializar la variable para el ID del flujo de efectivo
        let cashFlowId: string | null = null;
        // Si el estado de pago de la venta es 'Pagado'
        if (data.statusPayment === StatusPayment.PAID) {
            // Crear un registro en el flujo de efectivo
            const cashFlow = await db.cashFlow.create({
                data: {
                    amount: data.totalAmount,
                    type: CashFlowType.SALE,
                    description: `Venta de productos por un total de $${data.totalAmount}`,
                    createdAt: data.createdAt,
                    transactionId: saleTransaction.id,
                }
            })
            cashFlowId = cashFlow.id;
            // Si el método de pago es 'Caja registradora'
            if (data.paymentMethod === PaymentMethod.CASH_REGISTER) {
                const saleDate = new Date(data.createdAt);
                saleDate.setHours(0, 0, 0, 0);
                // Encontrar la conciliación de efectivo abierta actualmente
                const cashReconsiliation = await db.cashReconsiliation.findFirst({
                    where: {
                        isOpen: true
                    },
                });
                // Verificar si se encontró la conciliación de efectivo
                if (!cashReconsiliation) throw new CustomError("No se encontró una sesión de caja abierta. Debes iniciar el arqueo de caja.", 400);
                // Actualizar el registro de conciliación de efectivo con el monto de la venta
                await db.cashReconsiliation.update({
                    where: {
                        id: cashReconsiliation.id,
                    },
                    data: {
                        amount: { increment: data.totalAmount },
                        transactions: {
                            connect: {
                                id: saleTransaction.id,
                            },
                        },
                    },
                });

            }
            // Si se asignó un ID de flujo de efectivo
            if (cashFlowId) {
                // Actualizar el registro de flujo de efectivo con el ID de la transacción de venta
                await db.cashFlow.update({
                    where: {
                        id: cashFlowId!
                    },
                    data: {
                        transactionId: saleTransaction.id
                    }
                })
                // Actualizar la transacción de venta con el ID de flujo de efectivo
                await db.transaction.update({
                    where: {
                        id: saleTransaction.id
                    },
                    data: {
                        cashFlowId: cashFlowId
                    }
                })
            }
            // Actualizar la reserva de efectivo con el valor de la transacción de venta
            await cashReserverUpdate({
                value: data.totalAmount,
                type: data.transactionType
            })
        }

        // Si la venta es a crédito
        if (data.paymentMethod === PaymentMethod.CREDIT && creditSale) {
            // Crear un registro de venta a crédito
            const newCreditSale = await db.creditSale.create({
                data: {
                    name: creditSale.name,
                    description: creditSale.description,
                    userId: creditSale.userId,
                    transactionId: saleTransaction.id,
                },
            });
            // Verificar si se creó el registro de venta a crédito
            if (!newCreditSale) throw new CustomError("Error al crear la venta a crédito", 400);
        }
        console.warn('[TRANSACTION_ACTION_DESPUES DE CREAR VENTA_BACK] -> ', 'PAsa todos los controles revalida paths');
        // Actualizar las rutas para revalidar la caché
        revalidatePath(PrivateRoute.PRODUCTS.path)
        revalidatePath(PrivateRoute.TPV.path)
        // revalidatePath(PrivateRoute.SETTINGS.path)
        return {
            error: false,
            message: "Venta realizada correctamente",
            code: 201,
            data: null
        }
    } catch (error) {
        console.error('[CREATE_SALE_TRANSACTION] ', { error });
        if (error instanceof ZodError) {
            return {
                error: true,
                code: 400,
                message: "No se pudo realizar la venta. Los datos son inválidos o están incompletos",
                data: null
            }
        }

        if (error instanceof CustomError) {
            return {
                error: true,
                code: 401,
                message: error.message,
                data: null
            }
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return {
                error: true,
                code: 500,
                message: "Error en base de datos al realizar la venta",
                data: null
            }
        }
        return {
            error: true,
            message: "Error al realizar la venta",
            code: 500,
            data: null,
        };
    }
}

export async function buyProductsFromSupplier(
    data: TNewTransaction
): Promise<ResServer> {
    try {
        NewTransactionSchema.safeParse(data);

        const authorization = await authorizeRoles([UserRole.ADMIN, UserRole.USER]);
        if (!authorization) throw new CustomError("No autorizado.", 401);

        const { employeeId, supplierId, productSaleTransaction, transactionType, totalAmount, createdAt, paymentMethod, statusPayment, deliveryStatus } = data;

        const supplier = await db.supplier.findUnique({
            where: {
                id: supplierId!,
            },
        });
        if (!supplier) throw new CustomError("Proveedor no encontrado", 404);


        const productsToBuy = productSaleTransaction?.map((product) => {
            return {
                productId: product.productId,
                quantity: product.quantity,
                name: product.name,
                price: product.price,
                totalAmount: product.price * product.quantity,
            };
        });

        const description: string[] = productsToBuy!.map((product) => {
            return `${product.quantity} de ${product.name}`;
        })
        const productsId: string[] = productsToBuy!.map((product) => {
            return product.productId;
        })

        // crear una saletransaction con los productos comprados
        const saleTransaction = await db.transaction.create({
            data: {
                description: `Pedido a proveedor ${supplier.name}: ${description.join(", ")}`,
                productsId,
                supplierId,
                cashFlowId: null,
                transactionType,
                totalAmount,
                createdAt,
                paymentMethod,
                employeeId,
                statusPayment,
                deliveryStatus,
                productSaleTransaction: {
                    create: productsToBuy,
                },
            },
        });

        if (statusPayment === StatusPayment.PAID) {
            // Crear cashflow
            const cashFlow = await db.cashFlow.create({
                data: {
                    amount: totalAmount,
                    description: `Pedido a proveedor ${supplier.name}: ${description.join(", ")}`,
                    type: CashFlowType.PURCHASE,
                    createdAt: new Date(),
                    transactionId: saleTransaction.id,
                },
            });
            if (!cashFlow) throw new CustomError("Error al crear el cashFlow", 500);

            // actualizar el id cashflow en la saletransaction
            await db.transaction.update({
                where: {
                    id: saleTransaction.id,
                },
                data: {
                    cashFlowId: cashFlow.id,
                },
            });
            await cashReserverUpdate({
                value: totalAmount,
                type: transactionType
            })
            if (paymentMethod === PaymentMethod.CASH_REGISTER) {
                const cashReconsiliation = await db.cashReconsiliation.findFirst({
                    where: {
                        isOpen: true
                    }
                })
                await db.cashReconsiliation.update({
                    where: {
                        id: cashReconsiliation?.id
                    },
                    data: {
                        amount: {
                            decrement: data.totalAmount
                        },
                        transactions: {
                            connect: {
                                id: saleTransaction.id
                            }
                        }
                    }
                })

            }
        }

        if (deliveryStatus === DeliveryStatus.DELIVERED) {
            // recorrer los productos y actualizar la cantidad en la base de datos
            for (const product of productsToBuy!) {
                const productToUpdate = await db.product.findUnique({
                    where: {
                        id: product.productId,
                    },
                });
                if (!productToUpdate) throw new CustomError("Producto no encontrado", 404);

                await db.product.update({
                    where: {
                        id: product.productId,
                    },
                    data: {
                        stock: { increment: product.quantity },
                        transactions: {
                            connect: {
                                id: saleTransaction.id,
                            },
                        },
                        transactionsId: {
                            push: saleTransaction.id
                        },
                    },
                });
            }
        }



        revalidatePath(PrivateRoute.SUPPLIERS.path);
        revalidatePath(PrivateRoute.TPV.path);
        revalidatePath(PrivateRoute.PRODUCTS.path);
        revalidatePath(PrivateRoute.SETTINGS.path);
        return {
            error: false,
            message: "Productos comprados correctamente",
            code: 200,
        };
    } catch (error) {
        console.log("[BUY_PRODUCTS_FROM_SUPPLIER]", error);
        if (error instanceof ZodError) {
            return {
                error: true,
                code: 400,
                message: "No se pudo comprar productos. Los datos son inválidos o están incompletos",
            };
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return {
                error: true,
                code: 500,
                message: "Error en base de datos al crear pedido a proveedor",
            };
        }
        if (error instanceof CustomError) {
            return {
                error: true,
                code: 401,
                message: error.message,
            };
        }
        return {
            error: true,
            message: "Error al comprar productos",
            code: 500,
        };
    }
}