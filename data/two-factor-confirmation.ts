import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
        const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
            where: {
                userId,
            },
        });
        return twoFactorConfirmation;
    } catch (error) {
        console.log('[GET_TWO_FACTOR_CONFIRMATION_BY_USER_ID] ', { error });
        return null;
    }
}