import { db } from "@/lib/db";

export const getTwoFactorToken = async (token: string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findUnique({
            where: {
                token,
            },
        });
        return twoFactorToken;
    } catch (error) {
        console.log('[GET_TWO_FACTOR_TOKEN] ', { error });
        return null;
    }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findFirst({
            where: {
                email,
            },
        });
        return twoFactorToken;
    } catch (error) {
        console.log('[GET_TWO_FACTOR_TOKEN_BY_EMAIL] ', { error });
        return null;
    }
};