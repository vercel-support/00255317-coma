'use server'

import { PrivateRoute } from "@/constants/routes.constants";
import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/types";
import { NewWarehouseSchema, TNewWarehouse, TWarehouse, WarehouseSchema } from "@/schemas";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { authorizeRoles } from "./user.action";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


export const createWarehouse = async (data: TNewWarehouse): Promise<ResServer<TWarehouse | null>> => {
    try {
        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado.", 401);

        NewWarehouseSchema.parse(data);

        const warehouseExist = await db.warehouse.findFirst({
            where: {
                name: data.name,
            },
        });
        if (warehouseExist) throw new CustomError("Ya existe un almacén con este nombre", 400);

        const warehouse = await db.warehouse.create({
            data: {
                name: data.name,
                description: data.description,
                location: data.location,
            },
        });

        revalidatePath(PrivateRoute.WAREHOUSES.path);

        return {
            error: false,
            message: "Almacén creado correctamente",
            code: 201
        };
    } catch (error) {
        console.error("[CREATE_WAREHOUSE]", { error });
        if (error instanceof ZodError) {
            return {
                error: true,
                code: 400,
                message: error.issues.map((issue) => issue.message).join("\n \n"),
            };
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return { message: "Error en base de datos al crear el almacén", error: true, code: 500, data: null };
        }
        if (error instanceof CustomError) {
            return {
                error: true,
                code: 400,
                message: error.message,
            };
        }
        return {
            error: true,
            message: "Error al crear el almacén",
            code: 500,
            data: null,
        };
    }
}


export async function updateWarehouse(
    values: TWarehouse
): Promise<ResServer<TWarehouse>> {


    try {
        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado.", 401);

        const { id, ...updateData } = values;
        if (!id) throw new CustomError("Faltan datos", 400);

        const warehouseId = id.toString();

        WarehouseSchema.parse(values);

        const existingNameWarehouse = await db.warehouse.findFirst({
            where: {
                name: updateData.name,
            },
        });
        if (existingNameWarehouse && existingNameWarehouse.id !== id) throw new CustomError("Ya existe un almacén con este nombre", 400);

        const warehouse = await db.warehouse.findUnique({
            where: {
                id: warehouseId,
            },
        });

        if (!warehouse) throw new CustomError("Almacén no encontrado", 404);

        await db.warehouse.update({
            where: {
                id: warehouseId,
            },
            data: {
                name: updateData.name,
                description: updateData.description,
                location: updateData.location,
            }
        });

        revalidatePath(PrivateRoute.WAREHOUSES.path);

        return {
            error: false,
            message: "Almacén actualizado correctamente",
            code: 200,
        };
    } catch (error) {
        console.log("[UPDATE_WAREHOUSE]", { error });
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
            return {
                error: true,
                message: "Error en base de datos al actualizar el almacén",
                code: 500,
            };
        }
        return {
            error: true,
            message: "Error al actualizar el almacén",
            code: 500,
        };
    }
}


export async function deleteWarehouse(id: string): Promise<ResServer> {

    try {
        if (!id) throw new CustomError("Faltan datos.", 400);

        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado.", 401);

        const warehouse = await db.warehouse.findUnique({
            where: {
                id,
            },
            include: {
                products: true,
            },
        });
        if (!warehouse) throw new CustomError("Almacén no encontrado", 404);

        if (warehouse.products.length > 0) throw new CustomError("No se puede eliminar el almacén porque tiene productos asociados", 400);

        await db.warehouse.delete({
            where: {
                id,
            },
        });
        revalidatePath(PrivateRoute.WAREHOUSES.path);

        return {
            error: false,
            message: "Almacén eliminado correctamente",
            code: 200,
        };
    } catch (error) {
        console.log("[DELETE_WAREHOUSE]", { error });

        if (error instanceof CustomError) {
            return {
                error: true,
                code: 401,
                message: error.message,
            };
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return {
                error: true,
                message: "Error en base de datos al eliminar el almacén",
                code: 500,
            };
        }
        return {
            error: true,
            message: "Error al eliminar el almacén",
            code: 500,
        };
    }
}