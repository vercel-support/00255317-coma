'use server'
import { CustomError } from '@/lib/custom-error.class'
import { db } from '@/lib/db'
import { ResServer } from '@/lib/interfaces'
import { PrivateRoute } from '@/lib/routes'
import { CurrencyType, LocaleType } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { revalidatePath } from 'next/cache'


export interface IUpdateCurrencyType {
    id: string, currencyType: CurrencyType
}
export const UpdateCurrencyType = async ({ id, currencyType }: IUpdateCurrencyType): Promise<ResServer> => {
    try {
        if (!id) throw new CustomError('Id es requerido', 400)
        if (!currencyType) throw new CustomError('Tipo de moneda es requerido', 400)

        const currency = currencyType
        const locale = () => {
            switch (currencyType) {
                case CurrencyType.USD:
                    return LocaleType.en_US
                case CurrencyType.EUR:
                    return LocaleType.es_ES
                case CurrencyType.ARS:
                    return LocaleType.es_AR
                case CurrencyType.ILS:
                    return LocaleType.he_IL
                default:
                    return LocaleType.es_AR
            }
        }
        await db.settings.update({
            where: { id },
            data: { currencyType: currency, localeType: locale() }
        })
        return {
            error: false,
            message: 'Tipo de moneda actualizado con éxito',
            code: 200,
        }
    } catch (error) {
        console.error('Error al actualizar el tipo de moneda:', error)
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
            }
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return { error: true, code: 500, message: 'Error en base de datos al actualizar el tipo de moneda' }
        }
        return {
            error: true,
            message: 'Error al actualizar el tipo de moneda',
            code: 500,
        }
    }
}


export interface INewCashReserver {
    cashLiquid: number,
    id?: string
}
export const newCashReserver = async ({ cashLiquid, id }: INewCashReserver): Promise<ResServer> => {
    try {
        if (!cashLiquid) throw new CustomError('Valor es requerido', 400)

        if (!id) {
            const newSettings = await db.settings.create({
                data: {
                    currencyType: CurrencyType.ARS,
                    localeType: LocaleType.es_AR,
                    cashReserves: cashLiquid,
                }
            });
            revalidatePath(PrivateRoute.SETTINGS.href)

            return {
                error: false,
                message: 'Liquidez actualizada con éxito',
                code: 200,
                data: newSettings
            }
        }
        const setting = await db.settings.findUnique({ where: { id } })
        if (!setting) throw new CustomError("Error al obtener la configuración", 400);

        const settings = await db.settings.update({
            where: {
                id: setting.id,
            },
            data: {
                cashReserves: cashLiquid
            },
        });
        revalidatePath(PrivateRoute.SETTINGS.href)
        return {
            error: false,
            message: 'Liquidez actualizada con éxito',
            code: 200,
            data: settings
        }
    } catch (error) {
        console.error('[NEW_CASH_RESERVER]', error)
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
            }
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return { error: true, code: 500, message: 'Error en base de datos al actualizar la liquidez' }
        }
        return {
            error: true,
            message: 'Error al actualizar la liquidez',
            code: 500,
        }
    }
}