'use server'

import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/interfaces";
import { PrivateRoute } from "@/lib/routes";
import { NewServiceSchema, ServiceSchema, TNewService, TService } from "@/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import * as z from "zod";


export async function createService(values: TNewService): Promise<ResServer> {

    try {
        const { name,
            description,
            price,
            priceIdStripe,
            currencyType,
            localeType,
            duration,
            online,
            discount,
            percentageCommission,
            commission,
            appointments,
            serviceTransaction
        } = NewServiceSchema.parse(values)

        await db.service.create({
            data: {
                name,
                description,
                price,
                priceIdStripe,
                currencyType,
                localeType,
                duration,
                online,
                discount, percentageCommission,
                commission,
                appointments: appointments && undefined,
                serviceTransaction: serviceTransaction && undefined
            }
        })
        revalidatePath(PrivateRoute.SERVICES.href)
        return {
            error: false,
            code: 200,
            message: 'Servicio creado con éxito',
            data: null
        }
    } catch (error) {
        console.log('[SERIVCES ACTION] -> ', error);
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
                message: "Error en la base de datos",
                code: 500,
            };
        }
        return {
            error: true,
            message: "Error",
            code: 500,
        };
    }
}
export async function editService(values: TService): Promise<ResServer> {

    try {
        const { id, name, description, } = ServiceSchema.parse(values)

        await db.service.update({
            where: {
                id
            },
            data: {
                name,
                description,
                //  questions: questions && undefined
            }
        })

        revalidatePath(PrivateRoute.SERIVCES.href)

        return {
            error: false,
            code: 200,
            message: 'Servicio editado con éxito',
            data: null
        }
    } catch (error) {
        console.log('[SERIVICES ACTION] -> ', error);
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
                message: "Error en la base de datos",
                code: 500,
            };
        }
        return {
            error: true,
            message: "Error",
            code: 500,
        };
    }
}
export async function deleteService({ id }: { id: string }): Promise<ResServer> {

    try {
        if (!id) throw new CustomError('Faltan datos', 400)

        await db.service.delete({
            where: {
                id
            }
        })
        revalidatePath(PrivateRoute.SERVICES.href)
        return {
            error: false,
            code: 200,
            message: 'Servicio eliminada con éxito',
            data: null
        }
    } catch (error) {
        console.log('[SERIVICES ACTION] -> ', error);
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
                message: "Error en la base de datos",
                code: 500,
            };
        }
        return {
            error: true,
            message: "Error",
            code: 500,
        };
    }
}
