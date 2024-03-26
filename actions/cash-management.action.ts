'use server'

import { PrivateRoute } from "@/constants/routes.constants";
import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/types";
import { UserRole } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { revalidatePath } from "next/cache";
import { authorizeRoles } from "./user.action";

export async function createCashReconsiliation(data: {
    description: string | null,
    startDay: Date;
    startCash: number;
}): Promise<ResServer> {
    try {

        // Verifica si el usuario tiene permisos para realizar esta acción
        const authorization = await authorizeRoles([UserRole.ADMIN, UserRole.USER]);
        if (!authorization) throw new CustomError("No autorizado", 401);

        // Extrae los datos de inicio de la sesión de caja
        const { startDay, startCash } = data;
        if (!startDay || !startCash) {
            throw new CustomError("La fecha de inicio y el monto de efectivo son requeridos", 400);
        }
        // Trunca la fecha al principio y al final del día
        const startDateTruncated = startOfDay(startDay);
        const endDateTruncated = endOfDay(startDay);

        // Busca una sesión de caja abierta para el día especificado
        const existingReconsiliation = await db.cashReconsiliation.findFirst({
            where: {
                startDay: {
                    lte: endDateTruncated, // Menor o igual al final del día
                    gte: startDateTruncated, // Mayor o igual al principio del día
                },
                isOpen: true, // Verifica si hay una sesión abierta para el día especificado
            },
        });

        // Si ya existe una sesión abierta para este día, lanza un error
        if (existingReconsiliation) {
            throw new CustomError("Ya existe una sesión de caja abierta para este día", 400);
        }

        // Crea una nueva sesión de caja con los datos proporcionados
        const cashReconsiliation = await db.cashReconsiliation.create({
            data: {
                amount: 0,
                startDay,
                startCash,
                description: data.description,
                isOpen: true, // Indica que la sesión está abierta al crearla
            },
        });
        if (!cashReconsiliation) throw new CustomError("Error al crear la sesión de caja", 500);
        // Vuelve a validar las rutas asociadas al manejo de efectivo
        revalidatePath(PrivateRoute.CASH_MANAGEMENT.path);
        revalidatePath(PrivateRoute.TPV.path);
        // Devuelve una respuesta exitosa con los datos de la sesión de caja creada
        return {
            error: false,
            message: "Sesión de caja creada correctamente",
            code: 201,
            data: cashReconsiliation,
        };
    } catch (error) {
        console.log("[CREATE_CASH_RECONCILIATION]", error);
        // Maneja los errores, devolviendo una respuesta con el código y el mensaje adecuados

        if (error instanceof CustomError) {
            return {
                error: true,
                code: 401,
                message: error.message,
            };
        }
        return {
            error: true,
            message: "Error al crear la sesión de caja",
            code: 500,
        };
    }
}

export async function closeCashReconsiliation(data: {
    description: string | null,
    startDay: Date;
    endDay: Date | null;
    endCash: number | null
}): Promise<ResServer> {
    try {
        // Verifica si el usuario tiene permisos para realizar esta acción
        const authorization = await authorizeRoles([UserRole.ADMIN, UserRole.USER]);
        if (!authorization) throw new CustomError("No autorizado.", 401);

        // Verifica si se proporcionaron la fecha de cierre y el monto de efectivo al final del día
        if (!data.endDay || !data.endCash) {
            throw new CustomError("La fecha de cierre y el monto de efectivo son requeridos.", 400);
        }

        // Trunca la fecha al principio y al final del día
        const endDateTruncated = endOfDay(data.endDay!);
        const startDateTruncated = startOfDay(data.startDay!);

        // Busca una sesión de caja abierta para el día especificado
        const existingReconsiliation = await db.cashReconsiliation.findFirst({
            where: {
                startDay: {
                    lte: endDateTruncated, // Menor o igual al final del día
                    gte: startDateTruncated, // Mayor o igual al principio del día
                },
                isOpen: true, // Verifica si hay una sesión abierta para el día especificado
            },
        });

        // Si no se encuentra una sesión abierta para el día de cierre, lanza un error
        if (!existingReconsiliation) {
            throw new CustomError("No se encontró una sesión de caja abierta para este día", 404);
        }

        // Actualiza la sesión de caja con los datos de cierre proporcionados y marca la sesión como cerrada
        const updatedReconsiliation = await db.cashReconsiliation.update({
            where: {
                id: existingReconsiliation.id,
            },
            data: {
                endDay: data.endDay,
                endCash: data.endCash,
                description: data.description,
                isOpen: false, // Indica que la sesión está cerrada al actualizarla
            },
        });

        // Vuelve a validar las rutas asociadas al manejo de efectivo
        revalidatePath(PrivateRoute.CASH_MANAGEMENT.path);
        revalidatePath(PrivateRoute.TPV.path);
        // Devuelve una respuesta exitosa con los datos de la sesión de caja actualizada
        return {
            error: false,
            message: "Sesión de caja cerrada correctamente",
            code: 200,
            data: updatedReconsiliation,
        };
    } catch (error) {
        console.log("[CLOSE_CASH_RECONCILIATION]", error);
        // Maneja los errores, devolviendo una respuesta con el código y el mensaje adecuados
        if (error instanceof CustomError) {
            return {
                error: true,
                code: 404,
                message: error.message,
            };
        }
        return {
            error: true,
            message: "Error al cerrar la sesión de caja",
            code: 500,
        };
    }
}
