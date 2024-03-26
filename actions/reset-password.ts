'use server'

import { getUserByEmail } from "@/data/user.data"
import { sendPasswordResetEmail } from '@/lib/mail'
import { generatePasswordResetToken } from '@/lib/tokens'
import { ResetSchema, TReset } from "@/schemas"

export const resetPassword = async (values: TReset) => {
    const validateFields = ResetSchema.safeParse(values)
    if (!validateFields.success) return { error: 'Email inválido!' }

    const { email } = validateFields.data
    try {
        const existingUser = await getUserByEmail(email)
        if (!existingUser) return { error: 'Email no encontrado!' }

        const passwordResetToken = await generatePasswordResetToken(email)

        await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

        return { success: 'Email enviado!' }
    } catch (error) {
        console.log('[RESET_PASSWORD] ', { error })
        return { error: 'Ha ocurrido un error!' }
    }
}