"use server"

import { getUserByEmail } from "@/data/user.data"
import { db } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/mail"
import { generateVerificationToken } from "@/lib/tokens"
import { RegisterSchema } from "@/schemas"
import bcrypt from 'bcryptjs'
import * as z from "zod"

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    try {
        // Validación de los campos
        const validatedFields = RegisterSchema.safeParse(values)
        if (!validatedFields.success) {
            return { error: "campos inválidos" }
        }

        const { email, password, name, aceptTerms } = validatedFields.data;
        if (!aceptTerms) {
            return { error: "Debe aceptar los términos y condiciones" }
        }
        // Verificar si el usuario ya existe
        const existingUser = await getUserByEmail(email!);
        if (existingUser) {
            return { error: "Usuario ya registrado" }
        }

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password!, salt);

        // Crear nuevo usuario
        await db.user.create({
            data: {
                email: email || '',
                password: hash,
                name: name || '',
                acepTerms: aceptTerms,
                emailVerified: undefined,
                lastName: '',
                address: '',
                postalCode: '',
                province: '',
                phone: '',
                country: '',
                city: '',


            }
        })

        const verificationToken = await generateVerificationToken(email!);
        const resemail = await sendVerificationEmail(verificationToken.email, verificationToken.token);
        console.log('[EMAIL VERIFICATIOM] -> ', { resemail });
        return { success: "Email de verificación enviado" }
    } catch (error) {
        console.error('[REGISTER]', { error });
        return { error: "Ha ocurrido un error" }
    }
}