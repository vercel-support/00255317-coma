'use server'
import { db } from "@/lib/db";
import { ResServer } from "@/lib/types";
import { TSettings } from "@/schemas";
import { CurrencyType, LocaleType } from "@prisma/client";



export async function getSettings(): Promise<ResServer<TSettings>> {

    try {
        const settingsExist = await db.settings.findFirst();
        if (!settingsExist) {
            const newSettings = await db.settings.create({
                data: {
                    currencyType: CurrencyType.ARS,
                    localeType: LocaleType.es_AR,
                    cashReserves: 0,
                }
            });
            return {
                error: false,
                message: "Configuración obtenida con éxito",
                code: 200,
                data: newSettings as TSettings,
            }
        } else {
            return {
                error: false,
                message: "Configuración obtenida con éxito",
                code: 200,
                data: settingsExist as TSettings,
            }
        }
    } catch (error) {
        console.error("[SETTING_DATA] -> ", error);

        return { error: true, message: "Error al obtener configuración", code: 500 };
    }
}