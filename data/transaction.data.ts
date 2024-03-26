'use server'
import { authorizeRoles } from "@/actions/user.action";
import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { DateRange, ResServer } from "@/lib/types";
import { TTransaction } from "@/schemas";
import { PaymentMethod, StatusPayment, TransactionType, UserRole } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";


export async function getSaleTansactionByEmployee(employeeId: string, dateRange: DateRange, offset: number = 0): Promise<ResServer<TTransaction[]>> {
    try {
        if (!employeeId) throw new CustomError('Id de empleado es requerido', 400);
        if (!dateRange.startDate || !dateRange.endDate) throw new CustomError('Rango de fechas es requerido', 400);

        const { startDate, endDate } = dateRange;

        const startDateTruncated = startOfDay(startDate);
        const endDateTruncated = endOfDay(endDate);
        const saleTransactions = await db.transaction.findMany({
            where: {
                employeeId,
                transactionType: TransactionType.SALE,
                createdAt: {
                    gte: startDateTruncated,
                    lte: endDateTruncated
                }
            },
            include: {
                products: true,
                productSaleTransaction: true,
                employee: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: offset,
            take: 5
        })
        if (saleTransactions.length === 0) {
            return {
                error: false,
                message: "No hay transacciones de venta",
                code: 200,
                data: []
            }
        }
        return {
            error: false,
            message: "Transacciones encontradas correctamente",
            code: 200,
            data: saleTransactions as TTransaction[]
        }
    } catch (error) {
        console.error('[GET_SALE_TRANSACTIONS_BY_EMPLOYEE_ID] ', { error });
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
            message: "Error al buscar las transacciones",
            code: 500,
            data: []
        };
    }
}

export async function getTotalSaleTransactionsByEmployee(employeeId: string, dateRange: DateRange): Promise<ResServer<number>> {
    try {
        if (!employeeId) throw new CustomError('Id de empleado es requerido', 400);
        if (!dateRange.startDate || !dateRange.endDate) throw new CustomError('Rango de fechas es requerido', 400);

        const { startDate, endDate } = dateRange;

        const startDateTruncated = startOfDay(startDate);
        const endDateTruncated = endOfDay(endDate);
        const totalSaleTransactions = await db.transaction.count({
            where: {
                employeeId,
                transactionType: TransactionType.SALE,
                createdAt: {
                    gte: startDateTruncated,
                    lte: endDateTruncated
                }
            }
        })
        return {
            error: false,
            message: "Total de transacciones encontradas correctamente",
            code: 200,
            data: totalSaleTransactions
        }
    }
    catch (error) {
        console.error('[GET_TOTAL_SALE_TRANSACTIONS_BY_EMPLOYEE_ID] ', { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
                data: 0
            };
        }
        return {
            error: true,
            message: "Error al buscar las transacciones",
            code: 500,
            data: 0
        };
    }
}

interface Props {
    transactionType: TransactionType
    dateRange: DateRange
    offset?: number
}
export async function getSaleTansactionByType({ transactionType, dateRange, offset = 0 }: Props): Promise<ResServer<TTransaction[]>> {
    try {
        const { startDate, endDate } = dateRange;

        const startDateTruncated = startOfDay(startDate);
        const endDateTruncated = endOfDay(endDate);

        const saleTransactions = await db.transaction.findMany({
            where: {
                createdAt: {
                    gte: startDateTruncated,
                    lte: endDateTruncated,
                },
                transactionType,
            },
            include: {
                products: true,
                productSaleTransaction: true,
                employee: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: offset,
            take: 5
        })
        console.warn('[TRANSACTION_DATA_GET_TRANSACTION_BY_TYPE] -> ', saleTransactions.map((t) => t.productsId.length), { saleTransactions });
        const sortedSaleTransactions = saleTransactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return {
            error: false,
            message: "Transacciones encontradas correctamente",
            code: 200,
            data: sortedSaleTransactions as TTransaction[]
        }
    } catch (error) {
        console.error('[GET_SALE_TRANSACTIONS_BY_TYPE] ', { error });
        return {
            error: true,
            message: "Error al buscar las transacciones",
            code: 500,
            data: []
        };
    }
}

export async function getTotalSaleTansactionByType({ transactionType, dateRange }: Props): Promise<ResServer<number>> {
    try {
        const { startDate, endDate } = dateRange;

        const startDateTruncated = startOfDay(startDate);
        const endDateTruncated = endOfDay(endDate);

        const totalSaleTransactions = await db.transaction.count({
            where: {
                createdAt: {
                    gte: startDateTruncated,
                    lte: endDateTruncated,
                },
                transactionType,
            }
        })
        return {
            error: false,
            message: "Total de transacciones encontradas correctamente",
            code: 200,
            data: totalSaleTransactions
        }
    } catch (error) {
        console.error('[GET_TOTAL_SALE_TRANSACTIONS_BY_TYPE] ', { error });
        return {
            error: true,
            message: "Error al buscar las transacciones",
            code: 500,
            data: 0
        };
    }
}


export async function getCreditsTransactions(): Promise<ResServer<TTransaction[]>> {
    try {
        const authorization = await authorizeRoles([UserRole.ADMIN, UserRole.USER]);
        if (!authorization) throw new CustomError("No autorizado", 401);
        const saleTransactions = await db.transaction.findMany({
            where: {
                statusPayment: StatusPayment.PENDING,
                paymentMethod: PaymentMethod.CREDIT
            },
            include: { products: true, creditSale: true },
        });

        return {
            error: false,
            message: "Transacciones encontradas correctamente",
            code: 200,
            data: saleTransactions as TTransaction[],
        };
    } catch (error) {
        console.error('[GET_CREDITS_TRANSACTIONS] ', { error });
        if (error instanceof CustomError) {
            return { error: true, code: 400, message: error.message, data: [] };
        }
        return {
            error: true,
            code: 500,
            message: "Error al buscar las transacciones",
            data: []
        };
    }
}