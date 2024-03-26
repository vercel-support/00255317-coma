'use server'
import { db } from "@/lib/db";
import { DateRange, ResServer } from "@/lib/types";
import { TProduct } from "@/schemas";
import { endOfDay, startOfDay } from "date-fns";
import { TransactionType } from "@prisma/client";
import { CustomError } from "@/lib/custom-error.class";


export async function getProductById(
    id: string
): Promise<ResServer<TProduct | null>> {
    try {
        if (id === "new") {
            return {
                error: false,
                message: "Crea un nuevo producto",
                code: 400,
                data: null,
            };
        }
        const product = await db.product.findUnique({
            where: {
                id,
            },
        });
        if (!product) throw new CustomError("Producto no encontrado", 404);

        return {
            error: false,
            message: "Producto encontrado correctamente",
            code: 200,
            data: product as TProduct,
        };
    } catch (error) {
        console.error('[GET_PRODUCT_BY_ID] ', { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
                data: null,
            };
        }
        return {
            error: true,
            message: "Error al buscar el producto",
            code: 500,
            data: null,
        };
    }
}

export async function getProducts(): Promise<ResServer<TProduct[]>> {
    try {
        const products = await db.product.findMany({
            include: {
                category: true,
                supplier: true,
                warehouse: true,
                transactions: {
                    where: {
                        transactionType: TransactionType.SALE,
                    },
                    select: {
                        id: true,
                        transactionType: true,
                        createdAt: true,
                        productSaleTransaction: {
                            select: {
                                id: true,
                                quantity: true,
                            },
                        },
                    },
                },
            },

        });
        if (!products) throw new CustomError("No se encontraron productos", 404);


        return {
            error: false,
            message: "Productos encontrados correctamente",
            code: 200,
            data: products as TProduct[],
        };
    } catch (error) {
        console.error('[GET_PRODUCTS] ', { error });
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
            message: "Error al buscar los productos",
            code: 500,
            data: [],
        };
    }
}

export type BestSellingProduct = {
    name: string;
    quantity: number;
};
export async function getBestSellingProducts(dateRange: DateRange): Promise<BestSellingProduct[]> {
    const { startDate, endDate } = dateRange;
    if (!startDate || !endDate) {
        throw new CustomError("Fechas no válidas", 400);
    }
    const startDateTruncated = startOfDay(startDate);
    const endDateTruncated = endOfDay(endDate);


    const bestSellingProducts = await db.productSaleTransaction.findMany({
        where: {
            createdAt: {
                gte: startDateTruncated,
                lte: endDateTruncated,
            },
            transaction: {
                transactionType: TransactionType.SALE,
            },
        },
        select: {
            id: true,
            quantity: true,
            name: true,
        },
    });

    // Mapear y agrupar los productos sumando sus cantidades
    const aggregatedProductsArray = bestSellingProducts.reduce((acc, { name, quantity }) => {
        // Buscar si el producto ya está en el array
        const existingProductIndex = acc.findIndex(product => product.name === name);

        if (existingProductIndex !== -1) {
            // Si el producto ya está en el array, sumar la cantidad
            acc[existingProductIndex].quantity += quantity;
        } else {
            // Si el producto no está en el array, agregarlo con la cantidad
            acc.push({ name, quantity });
        }

        return acc;
    }, [] as { name: string; quantity: number }[]);

    // Ordenar los productos por cantidad
    const sortedProducts = aggregatedProductsArray.sort((a, b) => b.quantity - a.quantity);

    return sortedProducts;
}
