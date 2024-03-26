'use server'
import { startOfDay, endOfDay, eachDayOfInterval, format } from 'date-fns'; // Importa las funciones startOfDay y endOfDay
import { db } from "@/lib/db";
import { ResServer } from "@/lib/interfaces";
import { CashFlowType, Transaction, TransactionType } from "@prisma/client";
import { CustomError } from '@/lib/custom-error.class';

interface productsSales {
    name: string;
    quantity: number;
}
export interface DailySalesData {
    totalSales: number;
    sales: {
        products: productsSales[];
        totalAmount: number
    }[];
}
export async function getDailySales(): Promise<ResServer<DailySalesData>> {
    try {
        // Obtener todas las transacciones de venta del día presente
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dailySales = await db.transaction.findMany({
            where: {
                createdAt: {
                    gte: today,
                },
            },
            include: {
                products: true,
            },
        });

        // Calcular el monto total de ventas del día
        const totalSales = dailySales.reduce((acc, sale) => acc + sale.totalAmount, 0);

        // Mapear las transacciones de venta para obtener los productos y su cantidad
        const salesData = dailySales.map((sale) => {
            const productsData = sale.products.map((product) => ({
                name: product.name,
                quantity: 1, // Suponiendo que cada producto vendido cuenta como una unidad
            }));
            return {
                products: productsData,
                totalAmount: sale.totalAmount,
            };
        });

        return {
            error: false,
            message: "Ventas diarias encontradas correctamente",
            code: 200,
            data: {
                totalSales,
                sales: salesData,
            },
        };
    } catch (error) {
        console.error('[GET_DAILY_SALES] ', { error });
        return {
            error: true,
            message: "Error al buscar las ventas diarias",
            code: 500,
            data: {
                totalSales: 0,
                sales: [],
            },
        };
    }
}

interface BarChartData {
    name: string;
    "Number of threatened species": number;
}

export async function getBarChartData(): Promise<ResServer<BarChartData[]>> {
    try {
        const dailySales = await getDailySales();
        if (dailySales.error) {
            throw new CustomError("Error al buscar las ventas diarias", 500);
        }
        const salesData = dailySales.data;
        if (!salesData) {
            throw new CustomError("No se encontraron ventas diarias", 404);
        }

        const barChartData: BarChartData[] = salesData?.sales.map((sale) => ({
            name: sale.products[0].name, // Suponiendo que solo se vende un producto por transacción
            "Number of threatened species": sale.products[0].quantity, // Usando la cantidad vendida como número de especies amenazadas
        }));

        return {
            error: false,
            message: "Datos de gráfico de barras encontrados correctamente",
            code: 200,
            data: barChartData,
        };
    } catch (error) {
        console.error("[GET_BAR_CHART_DATA] ", error);
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
                data: [],
            };
        }
        return {
            error: true,
            message: "Error al buscar los datos de gráfico de barras",
            code: 500,
            data: [],
        };
    }
}




export interface DateRange {
    startDate: Date;
    endDate: Date;
}


export async function getTotalRevenue(dateRange: DateRange): Promise<ResServer<number>> {
    try {
        const { startDate, endDate } = dateRange;

        const startDateTruncated = startOfDay(startDate);
        const endDateTruncated = endOfDay(endDate);

        const salesTransactions: Transaction[] = await db.transaction.findMany({
            where: {
                createdAt: {
                    gte: startDateTruncated,
                    lte: endDateTruncated,
                },
                transactionType: TransactionType.SALE,
            },
        });

        let totalRevenue = 0;
        for (const transaction of salesTransactions) {
            totalRevenue += transaction.totalAmount || 0;
        }

        return {
            error: false,
            message: "Total de ingresos encontrado correctamente",
            code: 200,
            data: totalRevenue,
        };
    } catch (error) {
        console.error('[GET_TOTAL_REVENUE] Error:', error);
        return {
            error: true,
            message: "Error al buscar el total de ingresos",
            code: 500,
            data: 0,
        };
    }
}

export async function getTotalSales(dateRange: DateRange): Promise<ResServer<number>> {
    try {
        const { startDate, endDate } = dateRange;

        const startDateTruncated = startOfDay(startDate);
        const endDateTruncated = endOfDay(endDate);

        const salesTransactions: Transaction[] = await db.transaction.findMany({
            where: {
                createdAt: {
                    gte: startDateTruncated,
                    lte: endDateTruncated,
                },
                transactionType: TransactionType.SALE,
            },
        });
        const totalSales = salesTransactions.length;

        return {
            error: false,
            message: 'Total ventas encontrado correctamente',
            code: 200,
            data: totalSales,
        };
    } catch (error) {
        console.error('[GET_TOTAL_SALES] Error:', error);
        return {
            error: true,
            message: 'Error al buscar el total de ventas',
            code: 500,
            data: 0,
        };
    }
}

export async function getTotalCosts(dateRange: DateRange): Promise<ResServer<number>> {
    try {
        const { startDate, endDate } = dateRange;

        const startDateTruncated = startOfDay(startDate);
        const endDateTruncated = endOfDay(endDate);
        const purchaseTransactions = await db.cashFlow.findMany({
            where: {
                createdAt: {
                    gte: startDateTruncated,
                    lte: endDateTruncated,
                },
                type: CashFlowType.PURCHASE,
            },
        });

        let totalCosts = 0;
        for (const transaction of purchaseTransactions) {
            totalCosts += transaction.amount ?? 0;
        }

        return {
            error: false,
            message: 'Total de costos encontrado correctamente',
            code: 200,
            data: totalCosts,
        };
    } catch (error) {
        console.error('[GET_TOTAL_COSTS] Error:', error);
        return {
            error: true,
            message: 'Error al buscar el total de costos',
            code: 500,
            data: 0,
        };
    }
}

export async function getProfitPercentage(dateRange: DateRange): Promise<ResServer<number>> {
    try {


        // Obtener los ingresos totales
        const revenueResponse = await getTotalRevenue(dateRange);
        if (revenueResponse.error) {
            throw new Error(revenueResponse.message);
        }
        const totalRevenue = revenueResponse.data;

        // Obtener los costos totales
        const costsResponse = await getTotalCosts(dateRange); // Necesitas implementar getTotalCosts
        if (costsResponse.error) {
            throw new Error(costsResponse.message);
        }
        const totalCosts = costsResponse.data ?? 0;

        // Calcular el porcentaje de ganancia
        const profitPercentage = ((totalRevenue! - totalCosts) / totalRevenue!) * 100;

        return {
            error: false,
            message: 'Porcentaje de ganancia encontrado correctamente',
            code: 200,
            data: profitPercentage,
        };
    } catch (error) {
        console.error('[GET_PROFIT_PERCENTAGE] Error:', error);
        return {
            error: true,
            message: 'Error al buscar el porcentaje de ganancia',
            code: 500,
            data: 0,
        };
    }
}


export async function getDailyCashFlow(dateRange: DateRange): Promise<ResServer<number>> {
    try {
        const { startDate, endDate } = dateRange;

        const startDateTruncated = startOfDay(startDate);

        const endDateTruncated = endOfDay(endDate);
        const cashFlows = await db.cashFlow.findMany({
            where: {
                createdAt: {
                    gte: startDateTruncated,
                    lt: endDateTruncated,
                },
            },
            select: {
                amount: true,
                type: true,
            },
        });


        // Sumamos los montos correspondientes al flujo de efectivo
        let dailyCashFlow = 0;
        cashFlows.forEach((flow) => {
            if (flow.type === CashFlowType.SALE) {
                dailyCashFlow += flow.amount;
            } else if (flow.type === CashFlowType.PURCHASE) {
                dailyCashFlow -= flow.amount;
            }
        });

        return {
            error: false,
            message: "Flujo de efectivo diario encontrado correctamente",
            code: 200,
            data: dailyCashFlow,
        };
    } catch (error) {
        console.error("[GET_DAILY_CASH_FLOW] Error:", error);
        return {
            error: true,
            message: "Error al buscar el flujo de efectivo diario",
            code: 500,
            data: 0,
        };
    }
}

interface CashFlow {
    date: string;
    amount: number;
}


export async function getCashflowAreaChart(dateRange: DateRange): Promise<CashFlow[]> {
    try {
        const { startDate, endDate } = dateRange;

        // Trunca las fechas para que comiencen y terminen a la medianoche
        const startDateTruncated = startOfDay(startDate);
        const endDateTruncated = endOfDay(endDate);

        // Obtiene todas las fechas dentro del rango de fechas
        const allDates = eachDayOfInterval({ start: startDateTruncated, end: endDateTruncated });

        // Consulta la base de datos para obtener los flujos de efectivo dentro del rango de fechas
        const cashFlows = await db.cashFlow.findMany({
            where: {
                createdAt: {
                    gte: startDateTruncated,
                    lt: endDateTruncated,
                },
            },
            select: {
                amount: true,
                type: true,
                createdAt: true,
            },
        });

        // Inicializa un objeto para almacenar los montos del flujo de efectivo para cada día
        const dailyCashFlows: Record<string, number> = {};

        // Itera sobre los flujos de efectivo y suma los montos correspondientes para cada día
        cashFlows.forEach((flow) => {
            const date = format(flow.createdAt, 'yyyy-MM-dd');
            if (!dailyCashFlows[date]) {
                dailyCashFlows[date] = 0;
            }
            if (flow.type === CashFlowType.SALE) {
                dailyCashFlows[date] += flow.amount;
            } else if (flow.type === CashFlowType.PURCHASE) {
                dailyCashFlows[date] -= flow.amount;
            }
        });

        // Construye el array de objetos CashFlow para devolver
        const data: CashFlow[] = allDates.map(date => ({
            date: format(date, 'yyyy-MM-dd'),
            amount: dailyCashFlows[format(date, 'yyyy-MM-dd')] || 0,
        }));

        return data;
    } catch (error) {
        console.error("[GET_CASHFLOW_AREA_CHART] Error:", error);
        // En caso de error, devuelve un array vacío
        return [];
    }
}