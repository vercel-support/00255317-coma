'use server'

import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/types";
import { TExpense, TTransaction } from "@/schemas";
import { TransactionType } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";

export async function getRecurrentExpenses(): Promise<ResServer<TExpense[]>> {
    try {
        const recurrentExpenses = await db.expense.findMany({
            where: {
                recurring: true
            },
            include: {
                transactions: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        if (!recurrentExpenses) throw new CustomError("No se encontraron gastos recurrentes", 404);
        return {
            error: false,
            message: "Gastos recurrentes encontrados correctamente",
            code: 200,
            data: recurrentExpenses as TExpense[]
        }
    } catch (error) {
        console.error('[GET_RECURRENT_EXPENSES] ', { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
                data: []
            };
        }
        return {
            error: true,
            message: "Error al buscar los gastos recurrentes",
            code: 500,
            data: []
        };
    }
}

export async function getExpensesByDateRange({ startDate, endDate }: { startDate: Date, endDate: Date }): Promise<ResServer<TTransaction[]>> {
    try {
        const startDateTruncated = startOfDay(startDate);
        const endDateTruncated = endOfDay(endDate);

        const saleTransactions = await db.transaction.findMany({
            where: {
                createdAt: {
                    gte: startDateTruncated,
                    lte: endDateTruncated,
                },
                transactionType: TransactionType.EXPENSE
            },
            include: {
                expense: true,
            }
        })
        if (!saleTransactions) throw new CustomError("No se encontraron gastos", 404);
        const sortedExpenseTransactions = saleTransactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return {
            error: false,
            message: "Gastos encontrados correctamente",
            code: 200,
            data: sortedExpenseTransactions as TTransaction[]
        }
    } catch (error) {
        console.error('[GET_EXPENSES_BY_DATE_RANGE] ', { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
                data: []
            };
        }
        return {
            error: true,
            message: "Error al buscar los gastos",
            code: 500,
            data: []
        };
    }
}

export async function getExpenseAll(): Promise<ResServer<TExpense[]>> {
    try {
        const saleTransactions = await db.expense.findMany(
            {
                include: {
                    transactions: true
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            }
        )
        if (!saleTransactions) throw new CustomError("No se encontraron gastos", 404);
        return {
            error: false,
            message: "Gastos encontrados correctamente",
            code: 200,
            data: saleTransactions as TExpense[]
        }
    } catch (error) {
        console.error('[GET_EXPENSE_ALL] ', { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
                data: []
            };
        }
        return {
            error: true,
            message: "Error al buscar los gastos",
            code: 500,
            data: []
        };
    }
}

export async function getExpenseById(id: string): Promise<ResServer<TExpense | null>> {
    try {
        if (id === 'new') {
            return {
                error: false,
                message: "Crea un nuevo gasto",
                code: 400,
                data: null
            };
        }
        const expense = await db.expense.findUnique({
            where: {
                id
            },
            include: {
                transactions: true,
            }
        })
        if (!expense) throw new CustomError("Gasto no encontrado", 404);

        return {
            error: false,
            message: "Gasto encontrado correctamente",
            code: 200,
            data: expense as TExpense
        }
    } catch (error) {
        console.error('[GET_EXPENSE_BY_ID] ', { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
                data: {} as TExpense
            };
        }
        return {
            error: true,
            message: "Error al buscar el gasto",
            code: 500,
            data: {} as TExpense
        };
    }
}
