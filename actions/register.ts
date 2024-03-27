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

        const { email, password, name, acepTerms } = validatedFields.data;
        if (!acepTerms) {
            return { error: "Debe aceptar los términos y condiciones" }
        }
        // Verificar si el usuario ya existe
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return { error: "Usuario ya registrado" }
        }

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password!, salt);

        // Crear nuevo usuario
        await db.user.create({
            data: {
                email,
                password: hash,
                name,
                acepTerms,
                emailVerified: undefined,
            }
        })

        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { success: "Email de verificación enviado" }
    } catch (error) {
        console.error('[REGISTER]', { error });
        return { error: "Ha ocurrido un error" }
    }
}