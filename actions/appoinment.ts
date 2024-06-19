'use server'

import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/interfaces";
import { AppoinmentFormSchema, TAppointmentForm, TUser } from "@/schemas";
import { StatusAppointment, UserRole } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from 'bcryptjs'
import { connect } from "http2";
import { v4 as uuidv4 } from 'uuid';
import { ZodError, date } from "zod";
interface PropsTAppointmentForm {
    values: TAppointmentForm
}

export async function newAppoinment({ values }: PropsTAppointmentForm): Promise<ResServer> {
    try {
        const { name, email, phone, situation, message } = AppoinmentFormSchema.parse(values)
        // Buscar en db el email del usaurio
        const userExist = await db.user.findUnique({
            where: { email }
        })
        let newUser: TUser | undefined
        // Si el usuario no existe lo crea
        if (!userExist) {
            const password = uuidv4()
            // Encriptar contraseña
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            newUser = await db.user.create({
                data: {
                    email,
                    password: hash,
                    name,
                    lastName: '',
                    phone,
                    address: '',
                    city: '',
                    postalCode: '',
                    province: '',
                    country: '',
                    emailVerified: undefined,
                    permission: true,
                    image: '',
                    role: UserRole.CLIENT,
                    acepTerms: true,
                    isTwoFactorEnabled: false,
                }
            })
            if (!newUser) throw new CustomError(
                'Ha ocurrido un error',
                400
            )
        }

        const user = newUser ? newUser : userExist

        // crea una cita con status pending
        const newAppointment = await db.appointment.create({
            data: {
                date: new Date(),
                status: StatusAppointment.PENDING,
                user: {
                    connect: { id: user?.id }
                },
                service: { connect: { id: 'some-service-id' } }, // Reemplaza 'some-service-id' con el ID del servicio correspondiente
                employee: { connect: { id: 'some-employee-id' } } // Reemplaza 'some-employee-id' con el ID del empleado correspondiente
            }
        });
        // envia email al usaurio con informacion de la cita
        // si es usuario nuevo un tipo de email con su password
        // si es usuario ya registrado solo info cita
        // envia email al terapeuta con la nueva cita pendiente para que la acepte o rechace
        // crear notificacion para el terapeuta
        return {
            error: false,
            code: 200,
            message: 'ok',
            data: null
        }
    } catch (error) {
        console.log("[NEW APPOINTMENT]", { error });
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
                message: "Error en la base de datos al actualizar el producto",
                code: 500,
            };
        }
        return {
            error: true,
            code: 500,
            message: 'error',
            data: null
        }
    }
}