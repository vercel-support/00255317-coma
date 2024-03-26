'use server'

import { ITEMS_PER_PAGE_NOTIFICATIONS } from "@/components/notifications";
import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/server-auth";
import { ResServer } from "@/lib/types";
import { TNotification } from "@/schemas";

export async function getNotifications(offset: number = 0): Promise<ResServer<TNotification[] | null>> {
    try {
        const user = await currentUser()
        const notifications = await db.notification.findMany({
            where: {
                userId: user?.id
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: offset,
            take: 5
        });
        if (!notifications) throw new CustomError("No se encontraron notificaciones", 404);
        return {
            error: false,
            code: 200,
            message: "Notificaciones encontradas correctamente",
            data: notifications as TNotification[]
        }
    } catch (error) {
        console.log("[GET_NOTIFICATIONS]", { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                code: 404,
                message: error.message,
                data: null
            };
        }
        return {
            error: true,
            code: 500,
            message: "Error al buscar las notificaciones",
            data: null
        }
    }
}

export async function getTotalNotifications(): Promise<ResServer<number>> {
    try {
        const user = await currentUser()
        const totalNotifications = await db.notification.count({
            where: {
                userId: user?.id
            }
        });
        return {
            error: false,
            code: 200,
            message: "Total de notificaciones encontradas correctamente",
            data: totalNotifications
        }
    } catch (error) {
        console.log("[GET_TOTAL_NOTIFICATIONS]", { error });
        return {
            error: true,
            code: 500,
            message: "Error al buscar el total de notificaciones",
            data: 0
        }
    }
}