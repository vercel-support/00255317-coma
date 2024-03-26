'use server'

import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/types";
import { TTransaction, TSupplier } from "@/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


export async function getSupplierById(
    id: string
): Promise<ResServer<TSupplier | null>> {
    try {
        if (id === "new") return {
            error: false,
            message: "Crea un nuevo proveedor",
            code: 200,
            data: null,
        };
        const supplier = await db.supplier.findUnique({
            where: {
                id,
            },
            include: {
                products: true,
                transactions: true,
            },
        });
        if (!supplier) throw new CustomError("Proveedor no encontrado", 404);
        return {
            error: false,
            message: "Proveedor encontrado correctamente",
            code: 200,
            data: supplier as TSupplier,
        };
    } catch (error) {
        console.error('[GET_SUPPLIER_BY_ID] ', { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
                data: null,
            };
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return { message: "Error en base de datos durante la búsqueda del proveedor", error: true, code: 500 };
        }
        return {
            error: true,
            message: "Error al buscar el proveedor",
            code: 500,
            data: null,
        };
    }
}

export async function getSuppliers(): Promise<ResServer<TSupplier[]>> {
    try {
        const suppliers = await db.supplier.findMany({
            include: {
                products: true,
            },
        });
        if (!suppliers) throw new CustomError("No se encontraron proveedores", 404);
        return {
            error: false,
            message: "Proveedores encontrados correctamente",
            code: 200,
            data: suppliers as TSupplier[],
        };
    } catch (error) {
        console.error('[GET_SUPPLIERS] ', { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
                data: [],
            };
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return { message: "Error en base de datos durante la búsqueda de proveedores", error: true, code: 500 };
        }
        return {
            error: true,
            message: "Error al buscar los proveedores",
            code: 500,
            data: [],
        };
    }
}


export async function getSuppliersOrders(): Promise<ResServer<TTransaction[]>> {
    try {
        const transactions = await db.transaction.findMany({
            where: {
                supplierId: {
                    not: null,
                },
            },
            include: {
                products: true,
                employee: true,
                supplier: true,
            },
            orderBy: {
                createdAt: 'desc', // Ordena por fecha de la más reciente a la más antigua
            },
        });
        return {
            error: false,
            message: "Pedidos de proveedores encontrados correctamente",
            code: 200,
            data: transactions as TTransaction[],
        };
    } catch (error) {
        console.error('[GET_SUPPLIERS] ', { error });
        if (error instanceof PrismaClientKnownRequestError) {
            return { message: "Error en base de datos durante la búsqueda de pedidos de proveedores", error: true, code: 500 };
        }
        return {
            error: true,
            message: "Error al buscar los pedidos de proveedores",
            code: 500,
            data: [],
        };
    }
}

export async function getSupplierOrderById(
    id: string
): Promise<ResServer<TTransaction | null>> {
    try {
        const transaction = await db.transaction.findUnique({
            where: {
                id,
            },
            include: {
                products: true,
                employee: true,
                supplier: true,
                productSaleTransaction: true,
            },
        });
        if (!transaction) throw new CustomError("Pedido de proveedor no encontrado", 404);
        return {
            error: false,
            message: "Pedido de proveedor encontrado correctamente",
            code: 200,
            data: transaction as TTransaction,
        };
    } catch (error) {
        console.error('[GET_SUPPLIER_ORDER_BY_ID] ', { error });
        if (error instanceof PrismaClientKnownRequestError) {
            return { message: "Error en base de datos durante la búsqueda del pedido de proveedor", error: true, code: 500 };
        }
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
            message: "Error al buscar el pedido de proveedor",
            code: 500,
            data: null,
        };
    }
}