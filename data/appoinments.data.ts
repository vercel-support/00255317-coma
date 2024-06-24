'use server'

import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/interfaces";
import { TAppointment, TService } from "@/schemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";


export async function getAllAppointments(): Promise<ResServer<TAppointment[] | null>> {

    try {

        const appointments = await db.appointment.findMany({
            include: {
                user: true,
                service: true,
                employee: true
            }
        })
        console.log('[APPONTMENT DATA] -> ', appointments);
        return {
            error: false,
            code: 200,
            message: 'Citas encontrados con éxito',
            data: appointments
        }
    } catch (error) {
        console.log('[APPOINTMENT DATA] -> ', error);
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


export async function getAppointmentById({ id }: { id: string }): Promise<ResServer<TAppointment>> {

    try {
        const appointment = await db.appointment.findUnique({
            where: {
                id
            },
            include: {
                user: true,
                service: true,
                employee: true
            }
        })
        if (!appointment) throw new CustomError('Cita no encontrado', 400)

        return {
            error: false,
            code: 200,
            message: 'Cita eliminado con éxito',
            data: appointment
        }
    } catch (error) {
        console.log('[APPOINTMENT DATA] -> ', error);
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