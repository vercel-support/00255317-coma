'use server'

import { authorizeRoles } from "@/actions/user.action";
import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/interfaces";
import { TCashReconsiliation } from "@/schemas";
import { UserRole } from "@prisma/client";
import { endOfDay, startOfDay, subDays } from "date-fns";


export async function getCashReconsiliation(date: Date): Promise<ResServer> {
    try {
        // Verifica si la fecha es válida
        if (!date) throw new CustomError("La fecha es requerida.", 400);

        // Verifica si el usuario tiene permiso para realizar esta acción
        const authorization = await authorizeRoles([UserRole.ADMIN, UserRole.USER]);
        if (!authorization) throw new CustomError("No tienes los permisos para realizar esta acción.", 401);

        // Truncamos la fecha al principio y al final del día
        const startDateTruncated = startOfDay(subDays(date, 1)); // Buscamos también cajas abiertas del día anterior
        const endDateTruncated = endOfDay(date);

        // Buscamos la reconciliación de caja abierta para el día actual o del día anterior que aún no se ha cerrado
        const reconsiliation = await db.cashReconsiliation.findFirst({
            where: {
                startDay: {
                    lte: endDateTruncated,
                    gte: startDateTruncated,
                },
                isOpen: true, // Verificar si hay una sesión de caja abierta
            },
        });

        if (!reconsiliation) {
            throw new CustomError("No se encontró un arqueo de caja abierta.", 404);
        }

        return {
            error: false,
            code: 200,
            data: reconsiliation,
            message: "Arqueo de caja encontrado correctamente",
        };
    } catch (error) {
        console.log("[GET_CASH_RECONCILIATION]", error);
        if (error instanceof CustomError) {
            return {
                error: true,
                code: 404,
                message: error.message,
            };
        }
        return {
            error: true,
            message: "Hubo un error al buscar el arqueo de caja",
            code: 500,
        };
    }
}

export async function getLastCashReconsiliation(): Promise<ResServer> {
    try {
        // Verifica si el usuario tiene permiso para realizar esta acción
        const authorization = await authorizeRoles([UserRole.ADMIN, UserRole.USER]);
        if (!authorization) throw new CustomError("No tienes los permisos para realizar esta acción.", 401);

        // Busca la última reconciliación de caja cerrada
        const lastReconsiliation = await db.cashReconsiliation.findFirst({
            where: {
                isOpen: false, // Solo buscamos reconciliaciones cerradas
            },
            orderBy: {
                endDay: "desc", // Ordena las reconciliaciones por fecha de cierre de forma descendente
            },
        });


        // Retorna la última reconciliación encontrada
        return {
            error: false,
            code: 200,
            data: lastReconsiliation as TCashReconsiliation,
            message: "Último arqueo de caja encontrado correctamente",
        };
    } catch (error) {
        console.log("[GET_LAST_CASH_RECONCILIATION]", error);

        if (error instanceof CustomError) {
            return {
                error: true,
                code: error.code,
                message: error.message,
            };
        }
        return {
            error: true,
            message: "Hubo un error al buscar el último arqueo de caja",
            code: 500,
        };
    }
}
