'use server'

import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/server-auth";
import { ResServer } from "@/lib/interfaces";
import { NewNotificationSchema, TNewNotification } from "@/schemas";
import { ZodError } from "zod";

export async function createNotification(data: TNewNotification): Promise<ResServer> {
    try {
        NewNotificationSchema.safeParse(data)
        const user = await currentUser()
        const userID = user?.id
        if (!userID) throw new CustomError("Usuario no encontrado", 404)

        await db.notification.create({
            data: {
                ...data,
                userId: userID
            }
        });

        return {
            error: false,
            code: 200,
            message: "Notificación creada correctamente",
            data: null
        }
    } catch (error) {
        console.log("[CREATE_NOTIFICATION]", { error });
        if (error instanceof ZodError) {
            return {
                error: true,
                code: 400,
                message: "No se pudo crear la notificación. Los datos son inválidos o están incompletos",
            }
        }
        if (error instanceof CustomError) {
            return {
                error: true,
                code: error.code,
                message: error.message,
                data: null
            }
        }
        return {
            error: true,
            code: 500,
            message: "Error al crear la notificación",
            data: null
        }
    }
}

export async function changeStatusReadNotification(): Promise<ResServer> {
    try {
        const user = await currentUser()
        const userID = user?.id
        if (!userID) throw new CustomError("Usuario no encontrado", 404)
        await db.notification.updateMany({
            where: {
                userId: userID
            },
            data: {
                read: true
            }
        });

        return {
            error: false,
            code: 200,
            message: "Notificaciones leídas actualizadas",
            data: null
        }
    } catch (error) {
        console.log("[CHANGE_STATUS_READ_NOTIFICATION]", { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                code: error.code,
                message: error.message,
                data: null
            }
        }
        return {
            error: true,
            code: 500,
            message: "Error al cambiar el estado de las notificaciones",
            data: null
        }
    }
}

export async function changeStatusReadNotificationById(id: string): Promise<ResServer> {
    try {
        const user = await currentUser()
        const userID = user?.id
        if (!userID) throw new CustomError("Usuario no encontrado", 404)
        await db.notification.update({
            where: {
                id
            },
            data: {
                read: true
            }
        });

        return {
            error: false,
            code: 200,
            message: "Notificación leída actualizada",
            data: null
        }
    } catch (error) {
        console.log("[CHANGE_STATUS_READ_NOTIFICATION_BY_ID]", { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                code: error.code,
                message: error.message,
                data: null
            }
        }
        return {
            error: true,
            code: 500,
            message: "Error al cambiar el estado de la notificación",
            data: null
        }
    }
}

export async function deleteAllNotifications(): Promise<ResServer> {
    try {
        const user = await currentUser()
        const userID = user?.id
        if (!userID) throw new CustomError("Usuario no encontrado", 404)
        await db.notification.deleteMany({
            where: {
                userId: userID
            }
        });

        return {
            error: false,
            code: 200,
            message: "Notificaciones eliminadas correctamente",
            data: null
        }
    } catch (error) {
        console.log("[DELETE_ALL_NOTIFICATIONS]", { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                code: error.code,
                message: error.message,
                data: null
            }
        }
        return {
            error: true,
            code: 500,
            message: "Error al eliminar las notificaciones",
            data: null
        }
    }
}