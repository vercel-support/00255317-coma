'use server'

import { getPasswordResetToken } from "@/data/password-reset-token"
import { getUserByEmail } from "@/data/user.data"
import { db } from "@/lib/db"
import { NewPasswordSchema, TNewPassword } from "@/schemas"
import bcrypt from "bcryptjs"

export const newPassword = async (values: TNewPassword, token?: string | null) => {
    if (!token) {
        return { error: 'Token extraviado!' }
    }

    const validateFiels = NewPasswordSchema.safeParse(values)
    if (!validateFiels.success) {
        return { error: 'Campos inválidos' }
    }
    const { password } = validateFiels.data
    console.log('[NEW_PASSWORD] ', { password, token })
    try {
        const existingToken = await getPasswordResetToken(token)
        if (!existingToken) {
            return { error: 'Token inválido!' }
        }
        const hasExpired = new Date(existingToken.expires) < new Date()
        if (hasExpired) {
            return { error: 'Token expirado!' }
        }
        const existingUser = await getUserByEmail(existingToken.email)
        if (!existingUser) {
            return { error: 'Usuario no encontrado!' }
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password!, salt)
        await db.user.update({
            where: { id: existingUser.id },
            data: {
                password: hashedPassword,
            },
        })
        await db.passwordResetToken.delete({
            where: { id: existingToken.id },
        })

        return { success: 'Contraseña actualizada con éxito!' }
    } catch (error) {
        console.log('[NEW_PASSWORD] ', { error })
        return { error: 'Ha ocurrido un error!' }
    }
}