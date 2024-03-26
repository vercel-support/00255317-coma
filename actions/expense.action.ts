'use server'
import { PrivateRoute } from "@/lib/routes";
import { getRecurrentExpenses } from "@/data/expense.data";
import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/interfaces";
import { TExpense, TNewExpense, TNewNotification, TNewTransaction } from "@/schemas";
import { CashFlowType, DeliveryStatus, ExpenseFrequency, NotificationType, PaymentMethod, StatusPayment, TransactionType, UserRole } from "@prisma/client";
import { addDays, addMonths, addWeeks, addYears, differenceInDays, differenceInMonths, differenceInWeeks, differenceInYears } from 'date-fns';
import { revalidatePath } from "next/cache";
import { authorizeRoles } from "./user.action";
import { cashReserverUpdate } from "./settings.action";
import { createNotification } from "./notification.action";




export async function createExpense({ data }: { data: TNewExpense }): Promise<ResServer<TExpense>> {
    try {
        // Paso 1: Verificar los permisos de autorización del usuario.
        const authorization = await authorizeRoles([UserRole.ADMIN, UserRole.USER])
        if (!authorization) throw new CustomError("No autorizado.", 401)

        // Paso 2: Verificar si se proporcionó información de gasto y si el tipo de transacción es gasto.
        if (!data) throw new CustomError("Falta información del gasto", 400);

        // Paso 5: Crear o actualizar el gasto en la base de datos.
        const { typeTransaction, statusPayment, paymentMethod, employeeId, ...dataExpense } = data
        // Crear un nuevo gasto si no se proporciona un ID.
        const expense = await db.expense.create({
            data: {
                ...dataExpense!,
                recurring: data.frequency !== ExpenseFrequency.UNIQUE ? true : false,
            },
        });
        if (!expense) throw new CustomError("Error al crear el gasto", 500);



        // Paso 7: Actualizar el cashReserver y crear un nuevo cashFlow si el pago se realizó.
        if (data.statusPayment === StatusPayment.PAID) {
            const saleTransaction = await db.transaction.create({
                data: {
                    employeeId: data.employeeId,
                    transactionType: data.typeTransaction,
                    totalAmount: data.amount,
                    createdAt: data.createdAt,
                    paymentMethod: data.paymentMethod,
                    statusPayment: data.statusPayment,
                    deliveryStatus: DeliveryStatus.NEVER,
                },
            })
            await cashReserverUpdate({
                value: data.amount,
                type: data.typeTransaction
            })

            await db.cashFlow.create({
                data: {
                    amount: data.amount,
                    type: CashFlowType.EXPENSE as CashFlowType,
                    description: `Gasto por  $${data.amount}`,
                    createdAt: new Date(),
                    transactionId: saleTransaction.id,
                }
            })
            await db.expense.update({
                where: {
                    id: expense.id
                },
                data: {
                    lastPurchaseDate: data.frequency !== ExpenseFrequency.UNIQUE ? new Date() : null,
                    transactions: {
                        connect: {
                            id: saleTransaction.id
                        }
                    }
                }
            });
            await db.transaction.update({
                where: {
                    id: saleTransaction.id,
                },
                data: {
                    expense: {
                        connect: {
                            id: expense.id,
                        },
                    },
                },
            });

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
                            decrement: data.amount
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
        revalidatePath(PrivateRoute.EXPENSES.path);
        revalidatePath(PrivateRoute.TPV.path);
        return {
            error: false,
            message: "Gasto creado correctamente",
            code: 200,
            data: expense as TExpense
        }

    } catch (error) {
        console.error('[CREATE_EXPENSE] ', { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
            };
        }
        return {
            error: true,
            message: "Error al crear el gasto",
            code: 500,

        };
    }
}

export async function updateExpense({ id, data }: { id: string, data: TNewExpense }): Promise<ResServer<TExpense>> {
    try {
        const authorization = await authorizeRoles([UserRole.ADMIN])
        if (!authorization) throw new CustomError("No autorizado.", 401)
        if (!data) throw new CustomError("Falta información del gasto", 400);

        const { typeTransaction, statusPayment, paymentMethod, employeeId, ...dataExpense } = data
        const expenseUpdate = await db.expense.update({
            where: {
                id: id
            },
            data: { ...dataExpense }
        });

        // si el statusPayment es true, se actualiza el cashReserver y el cashFlow
        if (data.statusPayment === StatusPayment.PAID) {
            const transaction = await db.transaction.create({
                data: {
                    employeeId: data.employeeId,
                    transactionType: data.typeTransaction,
                    totalAmount: data.amount,
                    createdAt: data.createdAt,
                    paymentMethod: data.paymentMethod,
                    statusPayment: data.statusPayment,
                    deliveryStatus: DeliveryStatus.NEVER,
                },
            })
            await cashReserverUpdate({
                value: data.amount,
                type: data.typeTransaction
            })
            await db.cashFlow.create({
                data: {
                    amount: data.amount,
                    type: CashFlowType.EXPENSE as CashFlowType,
                    description: `Gasto por  $${data.amount}`,
                    createdAt: new Date(),
                    transactionId: transaction.id,
                }
            })
            await db.expense.update({
                where: {
                    id
                },
                data: {
                    lastPurchaseDate: new Date(),
                    transactions: {
                        connect: {
                            id: transaction.id
                        }
                    }
                }
            });
            await db.transaction.update({
                where: {
                    id: transaction.id,
                },
                data: {
                    expense: {
                        connect: {
                            id
                        },
                    },
                },
            });
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
                            decrement: data.amount
                        },
                        transactions: {
                            connect: {
                                id: transaction.id
                            }
                        }
                    }
                })

            }
        }
        revalidatePath(PrivateRoute.EXPENSES.path);
        return {
            error: false,
            message: "Gasto actualizado correctamente",
            code: 200,
            data: expenseUpdate as TExpense
        }
    } catch (error) {
        console.error('[UPDATE_EXPENSE] ', { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
            };
        }
        return {
            error: true,
            message: "Error al actualizar el gasto",
            code: 500,
        };
    }
}

export async function deleteExpense({ id }: { id: string }): Promise<ResServer<TExpense>> {
    try {
        const authorization = await authorizeRoles([UserRole.ADMIN])
        if (!authorization) throw new CustomError("No autorizado.", 401)
        if (!id) throw new CustomError("Falta información del gasto", 400);
        const expense = await db.expense.delete({
            where: {
                id
            }
        });
        return {
            error: false,
            message: "Gasto eliminado correctamente",
            code: 200,
            data: expense as TExpense
        }
    } catch (error) {
        console.error('[DELETE_EXPENSE] ', { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
            };
        }
        return {
            error: true,
            message: "Error al eliminar el gasto",
            code: 500,
        };
    }
}


export const checkAndCreateRecurrentExpenses = async (employeeId: string) => {
    try {
        // Paso 1: Verificar los permisos de autorización del usuario.
        //const authorization = await authorizeRoles([UserRole.ADMIN]);
        // if (!authorization) throw new CustomError("No autorizado.", 401);
        //  if (!employeeId) throw new CustomError("Falta información. No tienes un Id de empleado asignado", 400);
        // Obtener los gastos recurrentes
        const { error, data: expenses, message, code } = await getRecurrentExpenses();
        if (error) throw new CustomError(message, code);
        if (!expenses) throw new CustomError("No se encontraron gastos recurrentes", 404);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const expense of expenses) {

            if (!expense.lastPurchaseDate) {
                continue;
            }

            const lastPurchaseDate = new Date(expense.lastPurchaseDate);
            lastPurchaseDate.setHours(0, 0, 0, 0);

            let periodsSinceLastPurchase = 0;
            let addPeriodFunction;

            // Determinar la función adecuada para calcular la diferencia de tiempo y añadir períodos basados en la frecuencia
            switch (expense.frequency) {
                case 'DAILY':
                    periodsSinceLastPurchase = differenceInDays(today, lastPurchaseDate);
                    addPeriodFunction = addDays;
                    break;
                case 'WEEKLY':
                    periodsSinceLastPurchase = differenceInWeeks(today, lastPurchaseDate);
                    addPeriodFunction = (date, i) => addWeeks(date, i);
                    break;
                case 'MONTHLY':
                    periodsSinceLastPurchase = differenceInMonths(today, lastPurchaseDate);
                    addPeriodFunction = addMonths;
                    break;
                case 'QUARTERLY':
                    periodsSinceLastPurchase = Math.floor(differenceInMonths(today, lastPurchaseDate) / 3);
                    addPeriodFunction = (date, i) => addMonths(date, 3 * i);
                    break;
                case 'SEMI_ANNUAL':
                    periodsSinceLastPurchase = Math.floor(differenceInMonths(today, lastPurchaseDate) / 6);
                    addPeriodFunction = (date, i) => addMonths(date, 6 * i);
                    break;
                case 'ANNUAL':
                    periodsSinceLastPurchase = differenceInYears(today, lastPurchaseDate);
                    addPeriodFunction = addYears;
                    break;
            }

            // Asegurarnos de que al menos una transacción se cree si ha pasado un día desde la última compra
            if (periodsSinceLastPurchase > 0) {
                for (let i = 1; i <= periodsSinceLastPurchase; i++) {
                    const transactionDate = addPeriodFunction(lastPurchaseDate, i);
                    const latestTransaction = expense.transactions?.[expense.transactions.length - 1]; // Obtener el último elemento sin modificar el array
                    const payMethod: PaymentMethod =
                        latestTransaction?.paymentMethod || PaymentMethod.CASH;

                    const newSaleTransaction: TNewTransaction = {
                        transactionType: TransactionType.EXPENSE,
                        totalAmount: expense.amount,
                        createdAt: transactionDate,
                        paymentMethod: payMethod,
                        statusPayment: StatusPayment.PAID,
                        deliveryStatus: DeliveryStatus.NEVER,
                        employeeId: employeeId,
                        productsId: [],
                        description: null,
                        supplierId: null,
                        cashReconsiliationId: null,
                        expenseId: null,
                    };

                    // Crear la transacción de gasto recurrente en la base de datos
                    const res = await createRecurrentExpense({ expense, newSaleTransaction });
                    if (res.error) {
                        throw new CustomError(res.message, res.code);
                    } else {
                        console.log(res);
                    }
                }
            }
        }
    } catch (error: any) {
        console.error("[EXPENSE_ACTION] An error occurred:", error);
        // throw new CustomError("Error al crear transacción", 500);
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
            };
        }
        return {
            error: true,
            message: "Error al crear transacción",
            code: 500,
        };
    }
};


export const createRecurrentExpense = async ({ expense, newSaleTransaction }: { expense: TExpense, newSaleTransaction: TNewTransaction }) => {
    try {
        const saleTransaction = await db.transaction.create({
            data: {
                employeeId: newSaleTransaction.employeeId,
                transactionType: newSaleTransaction.transactionType,
                totalAmount: newSaleTransaction.totalAmount,
                createdAt: newSaleTransaction.createdAt,
                paymentMethod: newSaleTransaction.paymentMethod,
                statusPayment: newSaleTransaction.statusPayment,
                deliveryStatus: newSaleTransaction.deliveryStatus,
            }
        })
        await cashReserverUpdate({
            value: newSaleTransaction.totalAmount,
            type: newSaleTransaction.transactionType
        })
        const typeCashFlow = newSaleTransaction.paymentMethod === PaymentMethod.TRANSFER ? CashFlowType.TRANSFER : CashFlowType.EXPENSE;
        await db.cashFlow.create({
            data: {
                amount: newSaleTransaction.totalAmount,
                type: typeCashFlow,
                transaction: {
                    connect: {
                        id: saleTransaction.id
                    }
                }
            }
        })
        await db.expense.update({
            where: {
                id: expense.id
            },
            data: {
                lastPurchaseDate: new Date(),
                transactions: {
                    connect: {
                        id: saleTransaction.id
                    }
                }
            }
        });
        await db.transaction.update({
            where: {
                id: saleTransaction.id,
            },
            data: {
                expense: {
                    connect: {
                        id: expense.id,
                    },
                },
            },
        });
        const data: TNewNotification = {
            title: "Pago de gasto recurrente",
            message: `Se ha realizado el pago de un gasto recurrente de ${expense.name} por $${newSaleTransaction.totalAmount} el día ${newSaleTransaction.createdAt.toLocaleDateString("es-ES", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
            })}`,
            type: NotificationType.PAYMENT_NOTIFICATION,
            read: false,
            link: `${PrivateRoute.EXPENSE.href}${expense.id}`,
            createdAt: new Date(),
        }

        await createNotification(data)
        revalidatePath(PrivateRoute.EXPENSES.path);
        return {
            error: false,
            message: "Transacción de gasto recurrente creada correctamente",
            code: 200,
            data: saleTransaction as TNewTransaction
        }
    } catch (error) {
        console.error('[CREATE_RECURRENT_EXPENSE] ', { error });
        return {
            error: true,
            message: "Error al crear la transacción de gasto recurrente",
            code: 500,
        };
    }
}

