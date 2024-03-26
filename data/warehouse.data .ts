'use server'

import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/types";
import { TWarehouse } from "@/schemas";



export async function getWarehouseById(
    id: string
): Promise<ResServer<TWarehouse | null>> {
    try {

        if (id === "new") {
            return {
                error: false,
                message: "Crea un nuevo almacén",
                code: 200,
                data: null,
            };
        }

        const warehouse = await db.warehouse.findUnique({
            where: {
                id,
            },
            include: {
                products: true,
            },
        });
        if (!warehouse) throw new CustomError("Almacén no encontrado", 404);
        return {
            error: false,
            message: "Almacén encontrado correctamente",
            code: 200,
            data: warehouse as TWarehouse,
        };
    } catch (error) {
        console.error('[GET_WAREHOUSE_BY_ID] ', { error });
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
            message: "Error al buscar el almacén",
            code: 500,
            data: null,
        };
    }
}

export async function getWarehouses(): Promise<ResServer<TWarehouse[]>> {
    try {
        const warehouses = await db.warehouse.findMany({
            include: {
                products: true,
            },
        });
        if (!warehouses) throw new CustomError("Almacenes no encontrados", 404);
        return {
            error: false,
            message: "Almacenes encontrados correctamente",
            code: 200,
            data: warehouses as TWarehouse[],
        };
    } catch (error) {
        console.error('[GET_WAREHOUSES] ', { error });
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
            message: "Error al buscar los almacenes",
            code: 500,
            data: [],
        };
    }
}
