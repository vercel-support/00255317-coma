'use server'

import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/interfaces";
import { sendConfirmAppointmentEmail, sendTherapistAppointmentEmail, sendVerificationEmail, sendVerificationEmailWhitAppointment } from "@/lib/mail";
import { PrivateRoute } from "@/lib/routes";
import { generateVerificationToken } from "@/lib/tokens";
import { AppoinmentFormSchema, AppointmentSchema, TAppointment, TAppointmentForm, TUser } from "@/schemas";
import { StatusAppointment, UserRole } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from 'bcryptjs'
import { connect } from "http2";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from 'uuid';
import { ZodError, date } from "zod";
interface PropsTAppointmentForm {
    values: TAppointmentForm
}

export async function newPetitionAppoinment({ values }: PropsTAppointmentForm): Promise<ResServer> {
    try {
        const { name, email, phone, coupleName, situation, message, serviceId, employeeId } = AppoinmentFormSchema.parse(values)
        // Buscar en db el email del usaurio
        const userExist = await db.user.findUnique({
            where: { email }
        })
        let newUser: TUser | undefined
        let NewUserPassword: string = ''
        // Si el usuario no existe lo crea
        if (!userExist) {
            const password = uuidv4()
            NewUserPassword = password
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

        //TODO: cambiar metodo para encontrar al terapeuta adecuado en production
        const therapist = await db.user.findFirst({
            where: {
                employeeId
            }
        })
        // crea una cita con status pending
        const newAppointment = await db.appointment.create({
            data: {
                bookingDate: new Date(),
                status: StatusAppointment.PENDING,
                coupleName, situation, message,
                user: {
                    connect: { id: user?.id }
                },
                service: { connect: { id: serviceId } },
                employee: { connect: { id: therapist?.employeeId! } }
            },
            include: {
                service: true,
                employee: true,
                user: true
            }

        });
        // envia email al usaurio con informacion de la cita
        // si es usuario ya registrado solo info cita
        if (userExist) {
            await sendConfirmAppointmentEmail(email, user?.name!)
        }
        // si es usuario nuevo un tipo de email con su password
        if (newUser) {
            const verificationToken = await generateVerificationToken(email!);
            const userName = name
            const resemail = await sendVerificationEmailWhitAppointment(verificationToken.email, verificationToken.token, userName!, NewUserPassword);
        }
        // envia email al terapeuta con la nueva cita pendiente para que la acepte o rechace
        // el email tendra el id del terapeuta, el id del servicio cpara redirigirlo directametne a la pagina de la cita especifica reservada alli el terapeuta podra rechazar o aceptar la cita y ponerle fecha. Se enciara un email al cliente con la cita y un enlace de pago en el email, tendra hasta 3 dias para pagar la cita si no se cancela la sita por impago.

        // crear notificacion para el terapeuta
        await sendTherapistAppointmentEmail({
            email: therapist?.email!,
            therapistName: therapist?.name!,
            userName: user?.name!,
            coupleName: coupleName || '',
            situation,
            message,
            service: newAppointment.service.name
        })
        // TODO: socket para appointments y socket para notification
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
                message: "Error en la base de datos.",
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


export async function deleteAppointment() {
    // no se borra la cita solo se cancela sin enviar email 
}

export async function editAppointment({ values }: { values: TAppointment }): Promise<ResServer> {
    try {
        const {
            id,
            bookingDate,
            appointmentDate,
            status,
            coupleName,
            situation,
            message,
            userId,
            employeeId,
            serviceId,
            linkMeet
        } = AppointmentSchema.parse(values)
        // guardar los nuevos datos de la cita
        // si la cita es canceled entonces encia un email al paciente para avisarle que ha sido cancelada la cita y darle un enlace para poder reclamar
        // si la cita en pendiente no hace nada
        // si la cita es confirmada, crea un enlace de pago del valor del servicio, crea tambien un enlace de googlemeets que gaurdara en db y envia un email al paciente con la fecha los datos de la cita y el enlace de pago

        revalidatePath(PrivateRoute.APPOINTMENTS.path)
        return {
            error: false,
            code: 200,
            message: 'ok',
            data: null
        }
    } catch (error) {
        console.log("[APPOINTMENT ACTIONS]", { error });
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
                message: "Error en la base de datos.",
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