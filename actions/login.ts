"use server"
import { signIn } from "@/auth"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { getUserByEmail } from "@/data/user.data"
import { db } from "@/lib/db"
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail"
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { LoginSchema, TLogin } from "@/schemas"
import { AuthError } from "next-auth"

export const login = async (
    values: TLogin,
    callbackUrl?: string | null
) => {
    const validateFields = LoginSchema.safeParse(values)

    if (!validateFields.success) {
        return { error: "Campos inválidos" }
    }

    const { email, password, code } = validateFields.data

    const existingUser = await getUserByEmail(email)

    if (!existingUser || !existingUser.password || !existingUser.email) {
        return { error: "Credenciales inválidas" }
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { success: "Correo de verificación enviado" }

    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            if (!twoFactorToken) return { error: "Código inválido" }
            if (twoFactorToken.token !== code) return { error: "Código inválido" }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();
            if (hasExpired) return { error: "Código expirado" }

            await db.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id,
                }
            })
            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: existingConfirmation.id,
                    }
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,
                }
            })
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);

            await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);
            return { twoFactor: true }
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,

        })
    } catch (error) {
        console.log('[SIGN_IN_CREDENTIALS]', { error })
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Credenciales inválidas" }
                default:
                    return { error: "Ha ocurrido un error. Por favor, intenta de nuevo." }
            }
        }
        throw error
    }
}