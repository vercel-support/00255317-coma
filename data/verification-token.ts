import { db } from "@/lib/db";

export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await db.verificationToken.findUnique({
            where: {
                token,
            },
        });

        return verificationToken;
    } catch (error) {
        console.log('[VERIFICATION_TOKEN_BY_TOKEN] ', { error });
        return null;
    }
}

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.verificationToken.findFirst({
            where: {
                email,
            },
        });

        return verificationToken;
    } catch (error) {
        console.log('[VERIFICATION_TOKEN_BY_EMAIL] ', { error });
        return null;
    }
}