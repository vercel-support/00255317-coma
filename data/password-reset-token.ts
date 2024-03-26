import { db } from "@/lib/db";

export const getPasswordResetToken = async (token: string) => {

    try {
        const passwordResetToken = await db.passwordResetToken.findUnique({
            where: {
                token
            }
        })
        return passwordResetToken
    } catch (error) {
        console.error('[GET_PASSWORD_RESET_TOKEN]', { error });
        return null
    }
}

export const getPasswordResetEmail = async (email: string) => {

    try {
        const passwordResetToken = await db.passwordResetToken.findFirst({
            where: {
                email
            }
        })
        return passwordResetToken
    } catch (error) {
        console.error('[GET_PASSWORD_RESET_TOKEN]', { error });
        return null
    }
}