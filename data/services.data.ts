'use server'

import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/interfaces";
import { TService } from "@/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";


export async function getAllServices(): Promise<ResServer<TService[] | null>> {

    try {

        const services = await db.service.findMany()

        return {
            error: false,
            code: 200,
            message: 'Servicios encontrados con éxito',
            data: services
        }
    } catch (error) {
        console.log('[SERVICE DATA] -> ', error);
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


export async function getServiceById({ id }: { id: string }): Promise<ResServer<TService>> {

    try {
        const service = await db.service.findUnique({
            where: {
                id
            }
        })
        if (!service) throw new CustomError('Servicio no encontrado', 400)

        return {
            error: false,
            code: 200,
            message: 'Servicio eliminado con éxito',
            data: service
        }
    } catch (error) {
        console.log('[SERVICE DATA] -> ', error);
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